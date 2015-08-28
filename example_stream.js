var es_broker = require('./index'),
	fs = require('fs'),
	eventstream = require('event-stream');

var argv = require('optimist')
	.boolean('v')
	.alias('t', 'target')
    .alias('l', 'logpath')
	.alias('v', 'verbose')
    .describe('t', 'elasticsearch url')
    .describe('l', 'log file path')
    .describe('v', 'verbose')
	.demand(['l'])
	.argv;

var logpath = argv.l;
var estarget = argv.t;
var verbose = argv.v;

if (!fs.existsSync(logpath)) {
	throw new Error("log file is not exist");
}

var frs = fs.createReadStream(logpath);
if (frs == null) {
	throw new Error("failed to load file");
}

var parser = function(str, callback) {
	if (str == null) {
		callback('parse queue received null', null);
		return;
	}

	var data;
	try {
		data = JSON.parse(str);
	} catch(e) {
		callback(e, null);
		return;
	}

	data.timestamp = data.timestamp || Date.now();
	callback(null, data);
};

var broker = es_broker.create({
	parser: parser,
	target: estarget,
	max_bulk_qtty: 1000,
	max_request_num: 10,
	verbose: true,
	verbose_data: true,
	index: 'index'
});

frs.pipe(eventstream.split())
	.pipe(eventstream.mapSync(function(line) {
			broker.push(line);
		}).on('end', function() {
			broker.close(function(total_task) {
				console.log(total_task + ' has done.');
			});
		})
	);
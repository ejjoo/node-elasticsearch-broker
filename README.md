# node-elasticsearch-broker
Bulk data stream transfer for elasticSearch

# Usage
## Create
```js
var EsBroker = require('node-elasticsearch-broker');
var esBroker = EsBroker.create({
  parser: function, //user data parser which will be parsed in job_queue
  target: string, //elasticsearch host target
  max_bulk_qtty: number, //maximum bulk quantity sent to elasticsearch at once  
  max_request_num: number, //maximum request number concurrently.
  verbose: boolean, //verbose
  index: string //elastic_search index
}};
```
### Push
esBroker.push(string);

### Close
esBroker.close(callback);

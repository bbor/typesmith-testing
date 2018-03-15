var fs =            require('fs');
var minify =        require('strip-json-comments');
var axios =         require('axios');

var typesmith =     require('typesmith');
var subgroup =      require('typesmith-subgroup');
var writeJson =     require('typesmith-write-json');
var writeHtml =     require('typesmith-mixtape');

console.log("reading config...");

var config_content = fs.readFileSync('./configs/webster_config.json', 'utf8');
var config = JSON.parse( minify(config_content) );

console.log("starting the typesmith process!");


typesmith(config)
  .use(function() { console.log("Getting data...") })
  .use(get_webster_data)
  .use(function() { console.log("Writing JSON...") })
  .use(writeJson())
  .use(function() { console.log("Sending to mixtape...") })
  .use(writeHtml())
  .run( function(errmsg) { if (errmsg) { console.log("Error: " + errmsg); } console.log('finished the run!'); } );

function get_webster_data(typesmith, done) {
  // async version retrieving data from github.com

  // console.log('requesting data...');
  // axios.get('https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary.json')
  // .then(response => {
    // console.log('processing...');
    // handle_data(response.data, typesmith);
    // done();
  // })
  // .catch(error => {
    // console.log(error);
    // done();
  // });

  // synchronous version reading from local data file

  var doc_content = fs.readFileSync('./testdata/webster.json', 'utf8');
  var docs = JSON.parse( doc_content );
  handle_data(docs, typesmith);
  done();

}

function handle_data(data, typesmith) {
  var letters = {};
  Object.keys(data).forEach( function(key) {
    var record = {
      name:key,
      type:'word',
      content_title:key,
      content:data[key],
    }
    var letter = key.charAt(0).toUpperCase();
    letters[letter] = letters[letter] || [];
    letters[letter].push(record);
  });
  Object.keys(letters).forEach( function(key) {
    var record = {
      name:key,
      type:'letter',
      content_title:key,
    }
    typesmith.db.add(record);
    letters[key].forEach( function(child) { typesmith.db.add(child, record); } );
  });
}


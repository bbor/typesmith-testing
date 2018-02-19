var fs =            require('fs');
var minify =        require('strip-json-comments');
var axios =         require('axios');

var typesmith =     require('typesmith');
var subgroup =      require('typesmith-subgroup');
var writeJson =     require('typesmith-write-json');
var writeHtml =     require('typesmith-mixtape');

console.log("reading config...");

var config_content = fs.readFileSync('./configs/nodejs_config.json', 'utf8');
var config = JSON.parse( minify(config_content) );

console.log("starting the typesmith process!");


typesmith(config)
  .use(get_nodejs_data)
  .use(subgroup())
  .use(writeJson())
  .use(writeHtml())
  .run( function(errmsg) { if (errmsg) { console.log("Error: " + errmsg); } console.log('finished the run!'); } );

function get_nodejs_data(typesmith, done) {
  // async version retrieving data from nodejs.com
  console.log('requesting data...');
  axios.get('https://nodejs.org/api/all.json')
  .then(response => {
    console.log('processing...');
    handle_record(response.data, typesmith);
    done();
  })
  .catch(error => {
    console.log(error);
    done();
  });
  
  // synchronous version reading from local data file
  /*
  var doc_content = fs.readFileSync('./testdata/test_nodejs.json', 'utf8');
  var docs = JSON.parse( doc_content );
  handle_record(docs, typesmith);
  done();
  */
}

function handle_record(record, typesmith, is_property) {
  if (!!record.desc && typeof(record.desc) == 'string')
  {
    record.content = record.desc.replace(/<pre>/gi,'<pre class="prettyprint">');
  }
  record['content_title'] = record.displayName || record.textRaw || record.name;
  if (is_property)
  {
    record.data_type = record.type;
    record.type = 'property';
  }
  if (record.name)
    typesmith.add_to_db(record);
  var nested_types = ['miscs','modules','classes','globals','properties','methods'];
  nested_types.forEach( function(typelist) {
    if (record[typelist]) {
      var isproperty = (typelist == 'properties');
      record[typelist].forEach(function(nested_record) {
        handle_record(nested_record, typesmith, isproperty);
        if (record.uid && record.children)
          record.children.push(nested_record.uid);
          nested_record.parent = record.uid;
      });
    }
  });
}


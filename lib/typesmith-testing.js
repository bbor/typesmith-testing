var fs =            require('fs');
var minify =        require('strip-json-comments');


var typesmith =     require('typesmith');
var readJson =      require('typesmith-read-json');
var readMarkdown =  require('typesmith-read-markdown');
var autoparent =    require('typesmith-autoparent');
var subgroup =      require('typesmith-subgroup');
var writeJson =     require('typesmith-write-json');
var writeHtml =     require('typesmith-mixtape');

console.log("reading config...");

var config_content = fs.readFileSync('./configs/lua_config.json', 'utf8');
var config = JSON.parse( minify(config_content) );

console.log("starting the typesmith process!");

function detab (typesmith) {
  Object.values(typesmith.db).forEach(function(record) {
    if (record.type == "page" || !record.details) return;
    // find the first time there are tabs after a line break, and record how many tabs there are
    var tabs = record.details.match(/\n\t+/);
    if (tabs)
    {
      // remove that number of tabs every time it happens at the start of a line
      record.details = record.details.replace(new RegExp(tabs, 'g'), '\n');
    }
  });
}


function tweak (typesmith){
  Object.values(typesmith.db).forEach(function(record) {
    if (record.type == "page") return;
    record.content_summary = record.summary;
    record.content = record.details;
    record.content_title = record.display_name || record.name;
  });
}

typesmith(config).use(readJson())
  .use(readMarkdown())
  .use(autoparent())
  .use(subgroup())
  .use(writeJson())
  .use(detab)
  .use(tweak)
  .use(writeHtml())
  .run( function(errmsg) { if (errmsg) { console.log("Error: " + errmsg); } console.log('finished the run!'); } );


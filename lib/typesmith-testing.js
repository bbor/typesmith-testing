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

typesmith(config).use(readJson())
  .use(readMarkdown())
  .use(autoparent())
  .use(subgroup())
  .use(writeJson())
  .use(writeHtml())
  .run( function(errmsg) { if (errmsg) { console.log("Error: " + errmsg); } console.log('finished the run!'); } );


var optimist = require('optimist');
optimist.usage('Precompile translation strings.\nUsage: $0 template...', {
  'f': {
    'type': 'string',
    'description': 'Output File',
    'alias': 'output'
  },
  'n': {
    'type': 'string',
    'description': 'Template namespace',
    'alias': 'namespace',
    'default': 'Handlebars.templates'
  }
}).check(function(argv) {
  if (argv.version) {
    return;
  }
});

var fs = require('fs');
var Handlebars = require('handlebars');

var output = [];

for (var i = 0; i < optimist.argv._.length; ++i) {
  var file = optimist.argv._[i];
  var blob = fs.readFileSync(file);
  var json = JSON.parse(blob);

  for (var lang in json) {
    var namespace = optimist.argv.n + '.' + lang;
    output.push('(function() {\n');
    output.push('  var template = Handlebars.template, templates = ');
    output.push(namespace);
    output.push(' = ');
    output.push(namespace);
    output.push(' || {};\n');

    var functions = {};
    var pack = json[lang];
    for (var key in pack) {
      output.push('templates[\'' + key + '\'] = template(' +
                  Handlebars.precompile(pack[key]) + ');\n');
    }
    output.push('})();\n');
  }
}

output = output.join('');
if (optimist.argv.f) {
  fs.writeFileSync(optimist.argv.f, output, 'utf8');
} else {
  console.log(output);
}

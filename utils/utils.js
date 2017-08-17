
var esprima = require('esprima');
var fs = require('fs');
var escodegen = require('escodegen');

function updateIndexFile(ctx, filePath, componentPath, componentName) {
    var content = fs.readFileSync(ctx.destinationPath(filePath), {
        encoding: "utf8"
    })
    var parsed = esprima.parseModule(content);
    var importStatement;
    if (componentPath == './' + componentName) {
        importStatement = `import ${componentName} from '${componentPath}'`
    } else {
        importStatement = `import {${componentName}} from '${componentPath}'`
    }
    parsed.body.unshift(esprima.parseModule(importStatement))
    parsed.body[parsed.body.length - 1].specifiers.push(esprima.parseModule(`export {${componentName}}`).body[0].specifiers[0]);
    content = escodegen.generate(parsed);
    ctx.fs.write(ctx.destinationPath(filePath), content);
}

module.exports = {
    updateIndexFile
}
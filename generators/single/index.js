var Generator = require("yeoman-generator");
var glob = require('glob');
var { updateIndexFile } = require('../utils/utils');

module.exports = class extends Generator {

    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        this.dest = this.destinationPath('packages');

        // This makes `appname` a required argument.
        this.argument("componentName", { type: String, required: true, });

        // And you can then access it later; e.g.
        this.log("Component Name: ", this.options.componentName);
    }

    prompting() {
        return this.prompt([{
            type: "list",
            name: "folder",
            message: "Select component parent folder",
            default: "packages", // Default to current folder name
            choices: glob.sync("packages/**/", {
                cwd: this.destinationPath(),
            })
        }]).then((answers) => {
            this.selectedParent = answers.folder
            this.log("Selected parent folder: ", answers.folder);
        });
    }

    writing() {
        // var path = this.selectedParent.replace("packages", ".") + this.options.componentName;
        var indexFilePath = this.destinationPath(this.selectedParent) + "index.js";

        // updateIndexFile(this, 'packages/index.js', path, this.options.componentName);
        updateIndexFile(this, indexFilePath, './' + this.options.componentName, this.options.componentName, 'single');

        this.fs.copyTpl(
            this.templatePath('component.js'),
            this.destinationPath(`${this.selectedParent}${this.options.componentName}.js`),
            { componentName: this.options.componentName }
        );
    }

};
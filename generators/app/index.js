var Generator = require("yeoman-generator");
var glob = require('glob');
var { updateIndexFile } = require('../utils/utils')

module.exports = class extends Generator {



    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        this.dest = this.destinationPath('packages');

        // This makes `appname` a required argument.
        this.argument("componentName", { type: String, required: false, });

        this.promptOptions = [{
            type: "list",
            name: "folder",
            message: "Select component parent folder",
            default: "packages/", // Default to current folder name
            choices: glob.sync("packages/**/", {
                cwd: this.destinationPath(),
            })
        }]

        if (!this.options.componentName) {
            this.promptOptions.unshift({
                type: "input",
                name: "componentName",
                message: "Enter Component Name",
                default: "ComponentName",
            })
        } else {
            this.log("Component Name: ", this.options.componentName);
        }
    }

    prompting() {
        return this.prompt(this.promptOptions).then((answers) => {
            this.selectedParent = answers.folder
            this.options.componentName = this.options.componentName || answers.componentName;
            this.log("Selected parent folder: ", answers.folder);
        });
    }

    writing() {
        // var path = this.selectedParent.replace("packages", ".") + this.options.componentName;
        var indexFilePath = this.destinationPath(this.selectedParent) + "index.js";

        // updateIndexFile(this, 'packages/index.js', path, this.options.componentName);
        updateIndexFile(this, indexFilePath, './' + this.options.componentName,
            this.options.componentName);

        this.fs.copyTpl(
            this.templatePath('component.js'),
            this.destinationPath(`${this.selectedParent}${this.options.componentName}/${this.options.componentName}.js`),
            { componentName: this.options.componentName }
        );
        this.fs.copyTpl(
            this.templatePath('index.js'),
            this.destinationPath(`${this.selectedParent}${this.options.componentName}/index.js`),
            { componentName: this.options.componentName }
        );
    }
};
var Helpers = {};

Helpers.log  = (indentlevel, msg) => {
    process.stdout.write("    ".repeat(indentlevel) + msg);
}

module.exports = Helpers;


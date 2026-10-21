// Builds index.html: wraps src/template.html in a full document and inlines src/pi-engine.js.
// Usage: node build.js
const fs = require("fs");
const path = require("path");

const engine = fs
  .readFileSync(path.join(__dirname, "src", "pi-engine.js"), "utf8")
  .replace(/if \(typeof module[^\n]*\n?/, "");
if (engine.includes("</script")) throw new Error("engine source must not contain </script");

let template = fs.readFileSync(path.join(__dirname, "src", "template.html"), "utf8");
if (!template.includes("/*ENGINE*/")) throw new Error("template is missing the /*ENGINE*/ marker");
template = template.replace("/*ENGINE*/", () => engine);

// Drop the publishing-tool meta tag and reset the default body margin.
template = template.replace(/<meta name="claude:viewport-fit-sides"[^>]*>\n?/, "");
template = template.replace("* { box-sizing: border-box; }", "* { box-sizing: border-box; }\nbody { margin: 0; }");

const split = template.indexOf("</style>") + "</style>".length;
const head = template.slice(0, split);
const body = template.slice(split);

const html =
  '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' +
  head +
  "\n</head>\n<body>" +
  body +
  "</body>\n</html>\n";

fs.writeFileSync(path.join(__dirname, "index.html"), html);
console.log("Wrote index.html (" + html.length + " bytes)");

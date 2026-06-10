const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "config.js",
  "vercel.json",
  "assets/monogram-sd-transparent.png"
];

function fail(message) {
  console.error(`Build verification failed: ${message}`);
  process.exit(1);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) fail(`Missing required file: ${file}`);
}

const html = read("index.html");
const css = read("styles.css");
const app = read("app.js");
const configSource = read("config.js");

try {
  new Function(app);
  new Function(configSource);
} catch (error) {
  fail(`JavaScript parse error: ${error.message}`);
}

const sandbox = { window: {} };
try {
  vm.runInNewContext(configSource, sandbox, { filename: "config.js" });
} catch (error) {
  fail(`Config execution error: ${error.message}`);
}

const config = sandbox.window.WEDDING_CONFIG;
if (!config) fail("window.WEDDING_CONFIG was not created.");
if (!config.content?.fr || !config.content?.en) fail("French and English content are required.");
if (html.includes('id="theme"')) fail("Removed theme section is still present in index.html.");
if (html.includes("monogram-sd.png")) fail("Old non-transparent monogram is still referenced.");
if (!html.includes("/assets/monogram-sd-transparent.png")) fail("Transparent logo is not referenced from an absolute asset path.");
if (html.includes('name="contact"')) fail("Old combined contact field is still present.");
if (!html.includes('name="email"') || !html.includes('name="phone"')) fail("RSVP email and phone fields are required.");
if (config.links?.accommodation !== "https://book.nightsbridge.com/29945") fail("Avianto booking link is not set to the official NightsBridge booking page.");
if (config.rsvp?.endpoint !== "https://formsubmit.co/ajax/dorcasmalemo@icloud.com") fail("RSVP email endpoint is not configured for dorcasmalemo@icloud.com.");

const relativeRefPattern = new RegExp('(?:href|src)="\\\\./([^"#?]+)(?:[?#][^"]*)?"', "g");
const absoluteRefPattern = new RegExp('(?:href|src)="/([^"#?]+)(?:[?#][^"]*)?"', "g");
const localRefs = [
  ...[...html.matchAll(relativeRefPattern)].map((match) => match[1]),
  ...[...html.matchAll(absoluteRefPattern)].map((match) => match[1])
];
for (const ref of localRefs) {
  if (!fs.existsSync(path.join(root, ref))) fail(`Broken local reference in index.html: ${ref}`);
}

const cssBalance = (css.match(/{/g) || []).length - (css.match(/}/g) || []).length;
if (cssBalance !== 0) fail("styles.css appears to have unbalanced braces.");

console.log("Build verification passed.");

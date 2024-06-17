let fs = require("fs");
let props = JSON.parse(fs.readFileSync("../raw-data/nodejs-properties.json"));

console.log(props.length)

let propsOfInterest = []
let banned = ['FORCE_COLOR', 'NODE_DISABLE_COLORS', 'NO_COLOR', 'TMUX', 'CI','TEAMCITY_VERSION' ]
let accessed = new Set();
console.log("Starting")
function poluteAll() {
    let proto = Object.prototype;
    props.push("contextExtensions");
    for (let i = 0; i < props.length; i++) {
        let currProp = props[i];
        if (currProp === "_parent") continue // causes error with at least execSync
        if (currProp === "afterWriteTickInfo") continue // causes error with at least execSync
        if (currProp === "status") continue // causes error with execFile

        // causes errors when testing `import`; during testing these were only uncommented for the `import` test
        // if (currProp === "port") continue
        // if (currProp === "host") continue
        // if (currProp === "username") continue
        // if (currProp === "password") continue
        // if (currProp === "query") continue
        // if (currProp === "fragment") continue

        if (!proto.hasOwnProperty(currProp) && currProp != "get" && props[i] != "set" && props[i] != "writable" && props[i] != "enumerable" && props[i] != "value" && props[i] != "prototype" &&  props[i] != "__proto__" &&  props[i] != 4)
            Object.defineProperty(proto, currProp, { get: function() { if(this[currProp + "cs"]) return this[currProp + "cs"]; if (currProp != "configurable" && !banned.includes(currProp)) accessed.add(currProp); return undefined; }, set: function(val){ this[currProp + "cs"] = val} });
    }
}


let ofInterest = "";

function findProp(cb) {
    let proto = Object.prototype;
    for (let i = 0; i < props.length; i++) {
        if (!proto[props[i]] && props[i] != "get" && props[i] != "set" && props[i] != "writable" && props[i] != "enumerable" && props[i] != "value") {
            proto[props[i]] = -1;
            try {
                cb();
            } catch(e) {
                ofInterest += (props[i]) + "\n";
            }
            delete proto[props[i]];
        }
    }
}

const cp = require("child_process");
const vm = require("vm");
poluteAll();


// vm test case
try {
    //1
    // vm.runInNewContext("1+1");
    // global.text = ' '
    // const fn = vm.compileFunction(`console.log('' + text)`);
    // fn();
} catch (e) {
    console.log(e)
}

// gadget test cases, taken from <https://github.com/KTH-LangSec/server-side-prototype-pollution/tree/ce509983f42810e81be5e036ff9e27670aca2724>
try {
    //2
    // cp.execSync('echo "NORMAL EXECUTION"');

    //3
    // cp.spawnSync("echo", ["NORMAL EXECUTION"]);

    //4
    // cp.spawn("echo", ["NORMAL EXECUTION"]);

    //5
    // require("bytes");
} catch (e) {
    console.log(e)
}

// additional test cases, based on described gadgets in the paper following the pattern of gadgets from <https://github.com/KTH-LangSec/server-side-prototype-pollution/tree/ce509983f42810e81be5e036ff9e27670aca2724>
try {
    //6
    // cp.exec('echo "NORMAL EXECUTION"');

    //7
    // cp.execFile("echo", ["NORMAL EXECUTION"]);

    //8
    // cp.execFileSync("echo", ["NORMAL EXECUTION"]);

    //9
    // cp.fork(`${__dirname}/sample-fork.js`);

    //10
    require("./utils.js");

    //11 (for this test, extract `./fakepkg.zip` and put the dir `fakepkg` into `./node_modules` such that `ls ./node_modules/fakepkg` gives `index.js  package.json`)
    // import("fakepkg");
} catch (e) {
    console.log(e)
}


fs.writeFileSync("../raw-data/gadgets.dynamic-analysis.csv", Array.from(accessed).join("\n"))

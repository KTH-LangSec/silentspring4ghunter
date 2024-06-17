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
poluteAll();

try {
    // based on <https://github.com/KTH-LangSec/server-side-prototype-pollution/tree/ce509983f42810e81be5e036ff9e27670aca2724>
    cp.spawnSync("echo", ["NORMAL EXECUTION"]);
} catch (e) {
    console.log(e)
}

fs.writeFileSync("../raw-data/gadgets.dynamic-analysis.csv", Array.from(accessed).join("\n"))

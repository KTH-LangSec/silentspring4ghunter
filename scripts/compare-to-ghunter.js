const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const ssResultDir = path.resolve(__dirname, "..", "raw-data", "gadgets.static-analysis.tmp");
const ssResultEntries = fs.readdirSync(ssResultDir);
const ssResultOutFiles = ssResultEntries.filter(entry => path.extname(entry) === ".out");

const resultsByProperty = new Map();
let notInChildProcess = 0;

for (const entry of ssResultOutFiles) {
    const property = entry.replace(/\.out$/, "");

    const entryPath = path.resolve(ssResultDir, entry);
    const entryContent = fs.readFileSync(entryPath, { encoding: "utf-8" });

    const lines = entryContent
        .split(/\r?\n\r?/)
        .map(line => line.replace(`"PrototypePollutingGadget",,"warning","`, ""))
        .filter(line => line !== "");

    const resultForProperty = [];
    for (const line of lines) {
        const match = line.match(/^\[\[""([^"]+)""\|""([^"]+)""\]\].+?\[\[""([^"]+)""\|""([^"]+)""\]\]/i);
        if (match === null) {
            console.warn("unexpected:", line);
            process.exit(1);
        }

        const [, entryFnName, entryLocation, sinkFnName, sinkLocation] = match;
        const data = { entryFnName, entryLocation, sinkFnName, sinkLocation };

        let skip = true;

        // only sources we're interested in
        switch (process.argv[2]) {
            case "cp.exec":
                skip = !(entryLocation.startsWith("relative:///child_process.js") && entryFnName === "exec");
                break;
            case "cp.execFile":
                skip = !(entryLocation.startsWith("relative:///child_process.js") && entryFnName === "execFile");
                break;
            case "cp.execFileSync":
                skip = !(entryLocation.startsWith("relative:///child_process.js") && entryFnName === "execFileSync");
                break;
            case "cp.execSync":
                skip = !(entryLocation.startsWith("relative:///child_process.js") && entryFnName === "execSync");
                break;
            case "cp.fork":
                skip = !(entryLocation.startsWith("relative:///child_process.js") && entryFnName === "fork");
                break;
            case "cp.spawn":
                skip = !(entryLocation.startsWith("relative:///child_process.js") && entryFnName === "spawn");
                break;
            case "cp.spawnSync":
                skip = !(entryLocation.startsWith("relative:///child_process.js") && entryFnName === "spawnSync");
                break;
            case "vm.runInNewContext":
                skip = !(entryLocation.startsWith("relative:///vm.js") && entryFnName === "runInNewContext");
                break;
            case "vm.compileFunction":
                skip = !(entryLocation.startsWith("relative:///vm.js") && entryFnName === "compileFunction");
                break;
            case "vm.SyntheticModule":
                skip = !(entryLocation.startsWith("relative:///internal/vm/module.js"));
                break;
            case "require":
                skip = !(entryFnName === "require");
                break;
            case "import":
                skip = !(entryFnName === "import");
                break;
            default:
                throw `unknown ${process.argv[2]}`;
        }

        // but skip certain sinks, like is done for GHunter
        if (
            // Furthermore, we excluded source - sink pairs that could only lead
            // to Denial of Service: 6, 978 sinks related to type checking ...
            //nothing

            // ... and internal utils, ...
            sinkLocation.startsWith('relative:///internal/util/')

            // 752 in async_wrap.queueDestroyAsyncId, 101 in errors.triggerUncaughtException,
            // and 53 in buffer.byteLengthUtf8
            //nothing
        ) {
            skip = true;
        }

        if (!skip) {
            const alreadyThere = resultForProperty.find(prev => prev.entryLocation === entryLocation && prev.sinkLocation === sinkLocation)
            if (!alreadyThere) {
                resultForProperty.push(data);
            }
        } else {
            console.log(`-- entry not for ${process.argv[2]} --`);
            console.log({ property, ...data });
            console.log(`(${line})`);
            console.log();
            notInChildProcess += 1;
        }
    }

    resultsByProperty.set(property, resultForProperty);
}

console.log("\n", "----------------------------------------------------", "\n");

console.log("all props:", resultsByProperty);

console.log("\n", "----------------------------------------------------", "\n");

console.log("Property count:", resultsByProperty.size);
console.log("Candidates:", Array.from(resultsByProperty.values()).reduce((cnt, cur) => cnt + cur.length, 0));

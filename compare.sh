#!/bin/bash

if [[ "$(node --version)" != 'v21.0.0' ]]; then
    echo "Wrong Node.js version (got $(node --version))"
    exit 2
fi

rm -rf db/
rm -rf raw-data/gadgets.static-analysis.tmp

cd benchmark-nodejs/
git reset --hard
git apply ../benchmark-nodejs.patch

cd ../scripts/
npm clean-install

##

echo
echo '=== Producting results for cp.exec... ==='

node gadgets.infer-properties.js
node gadgets.dynamic-analysis-cp-exec.js
node gadgets.static-analysis.js

node compare-to-ghunter.js cp.exec >../ghunter.log

mkdir ../raw-data/exec
mv ../ghunter.log                            ../raw-data/exec/ghunter.log
mv ../raw-data/gadgets.static-analysis.tmp   ../raw-data/exec/gadgets.static-analysis.tmp
cp ../raw-data/gadgets.dynamic-analysis.csv  ../raw-data/exec/gadgets.dynamic-analysis.csv
cp ../raw-data/gadgets.static-analysis.md    ../raw-data/exec/gadgets.static-analysis.md
cp ../raw-data/nodejs-properties.json        ../raw-data/exec/nodejs-properties.json

##

echo
echo '=== Producting results for cp.execFile... ==='

node gadgets.infer-properties.js
node gadgets.dynamic-analysis-cp-exec-file.js
node gadgets.static-analysis.js

node compare-to-ghunter.js cp.execFile >../ghunter.log

mkdir ../raw-data/execFile
mv ../ghunter.log                            ../raw-data/execFile/ghunter.log
mv ../raw-data/gadgets.static-analysis.tmp   ../raw-data/execFile/gadgets.static-analysis.tmp
cp ../raw-data/gadgets.dynamic-analysis.csv  ../raw-data/execFile/gadgets.dynamic-analysis.csv
cp ../raw-data/gadgets.static-analysis.md    ../raw-data/execFile/gadgets.static-analysis.md
cp ../raw-data/nodejs-properties.json        ../raw-data/execFile/nodejs-properties.json

##

echo
echo '=== Producting results for cp.execFileSync... ==='

node gadgets.infer-properties.js
node gadgets.dynamic-analysis-cp-exec-file-sync.js
node gadgets.static-analysis.js

node compare-to-ghunter.js cp.execFileSync >../ghunter.log

mkdir ../raw-data/execFileSync
mv ../ghunter.log                            ../raw-data/execFileSync/ghunter.log
mv ../raw-data/gadgets.static-analysis.tmp   ../raw-data/execFileSync/gadgets.static-analysis.tmp
cp ../raw-data/gadgets.dynamic-analysis.csv  ../raw-data/execFileSync/gadgets.dynamic-analysis.csv
cp ../raw-data/gadgets.static-analysis.md    ../raw-data/execFileSync/gadgets.static-analysis.md
cp ../raw-data/nodejs-properties.json        ../raw-data/execFileSync/nodejs-properties.json

##

echo
echo '=== Producting results for cp.execSync... ==='

node gadgets.infer-properties.js
node gadgets.dynamic-analysis-cp-exec-sync.js
node gadgets.static-analysis.js

node compare-to-ghunter.js cp.execSync >../ghunter.log

mkdir ../raw-data/execSync
mv ../ghunter.log                            ../raw-data/execSync/ghunter.log
mv ../raw-data/gadgets.static-analysis.tmp   ../raw-data/execSync/gadgets.static-analysis.tmp
cp ../raw-data/gadgets.dynamic-analysis.csv  ../raw-data/execSync/gadgets.dynamic-analysis.csv
cp ../raw-data/gadgets.static-analysis.md    ../raw-data/execSync/gadgets.static-analysis.md
cp ../raw-data/nodejs-properties.json        ../raw-data/execSync/nodejs-properties.json

##

echo
echo '=== Producting results for cp.fork... ==='

node gadgets.infer-properties.js
node gadgets.dynamic-analysis-cp-fork.js
node gadgets.static-analysis.js

node compare-to-ghunter.js cp.fork >../ghunter.log

mkdir ../raw-data/fork
mv ../ghunter.log                            ../raw-data/fork/ghunter.log
mv ../raw-data/gadgets.static-analysis.tmp   ../raw-data/fork/gadgets.static-analysis.tmp
cp ../raw-data/gadgets.dynamic-analysis.csv  ../raw-data/fork/gadgets.dynamic-analysis.csv
cp ../raw-data/gadgets.static-analysis.md    ../raw-data/fork/gadgets.static-analysis.md
cp ../raw-data/nodejs-properties.json        ../raw-data/fork/nodejs-properties.json

##

echo
echo '=== Producting results for cp.spawn... ==='

node gadgets.infer-properties.js
node gadgets.dynamic-analysis-cp-spawn.js
node gadgets.static-analysis.js

node compare-to-ghunter.js cp.spawn >../ghunter.log

mkdir ../raw-data/spawn
mv ../ghunter.log                            ../raw-data/spawn/ghunter.log
mv ../raw-data/gadgets.static-analysis.tmp   ../raw-data/spawn/gadgets.static-analysis.tmp
cp ../raw-data/gadgets.dynamic-analysis.csv  ../raw-data/spawn/gadgets.dynamic-analysis.csv
cp ../raw-data/gadgets.static-analysis.md    ../raw-data/spawn/gadgets.static-analysis.md
cp ../raw-data/nodejs-properties.json        ../raw-data/spawn/nodejs-properties.json

##

echo
echo '=== Producting results for cp.spawnSync... ==='

node gadgets.infer-properties.js
node gadgets.dynamic-analysis-cp-spawn-sync.js
node gadgets.static-analysis.js

node compare-to-ghunter.js cp.spawnSync >../ghunter.log

mkdir ../raw-data/spawnSync
mv ../ghunter.log                            ../raw-data/spawnSync/ghunter.log
mv ../raw-data/gadgets.static-analysis.tmp   ../raw-data/spawnSync/gadgets.static-analysis.tmp
cp ../raw-data/gadgets.dynamic-analysis.csv  ../raw-data/spawnSync/gadgets.dynamic-analysis.csv
cp ../raw-data/gadgets.static-analysis.md    ../raw-data/spawnSync/gadgets.static-analysis.md
cp ../raw-data/nodejs-properties.json        ../raw-data/spawnSync/nodejs-properties.json

##

echo
echo '=== Producting results for vm.SyntheticModule... ==='

node gadgets.infer-properties.js
node --experimental-vm-modules gadgets.dynamic-analysis-vm-synthetic-module.js
node gadgets.static-analysis.js

node compare-to-ghunter.js vm.SyntheticModule >../ghunter.log

mkdir ../raw-data/vm.SyntheticModule
mv ../ghunter.log                            ../raw-data/vm.SyntheticModule/ghunter.log
mv ../raw-data/gadgets.static-analysis.tmp   ../raw-data/vm.SyntheticModule/gadgets.static-analysis.tmp
cp ../raw-data/gadgets.dynamic-analysis.csv  ../raw-data/vm.SyntheticModule/gadgets.dynamic-analysis.csv
cp ../raw-data/gadgets.static-analysis.md    ../raw-data/vm.SyntheticModule/gadgets.static-analysis.md
cp ../raw-data/nodejs-properties.json        ../raw-data/vm.SyntheticModule/nodejs-properties.json

##

echo
echo '=== Producting results for import... ==='

node gadgets.infer-properties.js
node gadgets.dynamic-analysis-import.js
node gadgets.static-analysis.js

node compare-to-ghunter.js import >../ghunter.log

mkdir ../raw-data/import
mv ../ghunter.log                            ../raw-data/import/ghunter.log
mv ../raw-data/gadgets.static-analysis.tmp   ../raw-data/import/gadgets.static-analysis.tmp
cp ../raw-data/gadgets.dynamic-analysis.csv  ../raw-data/import/gadgets.dynamic-analysis.csv
cp ../raw-data/gadgets.static-analysis.md    ../raw-data/import/gadgets.static-analysis.md
cp ../raw-data/nodejs-properties.json        ../raw-data/import/nodejs-properties.json

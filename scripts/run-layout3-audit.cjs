const {spawn}=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4180'],{cwd:root,stdio:['ignore','pipe','pipe']});
let started=false;
server.stdout.on('data',b=>{process.stdout.write(b);if(!started&&b.toString().includes('Local:')){started=true;const audit=spawn(process.execPath,['scripts/audit-layout3.cjs'],{cwd:root,env:{...process.env},stdio:'inherit'});audit.on('exit',code=>{server.kill();process.exitCode=code??1;});}});
server.stderr.on('data',b=>process.stderr.write(b));
server.on('exit',code=>{if(!started)process.exitCode=code||1;});
process.on('exit',()=>server.kill());

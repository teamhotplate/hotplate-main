import childProcess from 'child_process';
import ncp from 'ncp';

const args = ["run build"];
const opts = { stdio: "inherit", cwd: "client", shell: true };
const buildProc = childProcess.spawn("npm", args, opts);




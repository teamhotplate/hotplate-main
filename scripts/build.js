import childProcess from 'child_process';
import ncp from 'ncp';

const args = ["run build"];
const opts = { stdio: "inherit", cwd: "client", shell: true };
const buildProc = childProcess.spawn("npm", args, opts);

// buildProc.on('close', (exitCode) => {
// if (exitCode === 0) {
//   // Build completed successfully; copy the files
//   ncp.limit = 16;
//   ncp('./client/build', './public', (err) => {
//     if (err) {
//       return console.error(`Copy of build to public failed: ${err}`);
//     }
//     console.log("Copy of build to public completed successfully.");
//   });
// } else {
//   // Build returned non-zero; log an error and bail
//   return console.error(`Copy of build to public failed: ${err}`);
// }
// })



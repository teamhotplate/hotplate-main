var childProcess = require('child_process');

// Build back-end
var serverBuildArgs = ["src", "-d", "build"];
var serverBuildOpts = { stdio: "inherit", shell: true };
var serverBuildProc = childProcess.spawn("babel", serverBuildArgs, serverBuildOpts);


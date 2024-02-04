import { exec } from "child_process";
setInterval(() => {
    // Run a shell script to pull the latest code from GitHub every 10 seconds
    exec("git pull", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}, 20000);

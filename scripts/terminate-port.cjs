const { exec } = require('child_process');

const port = process.argv[2] || '8080'; // Default to 8080

// For Windows
const command = `netstat -ano | findstr :${port}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }

  const lines = stdout.split('\n');
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length > 4) {
      const pid = parts[parts.length - 1];
      if (pid) {
        console.log(`Terminating process ${pid} on port ${port}`);
        exec(`taskkill /F /PID ${pid}`, (error) => {
          if (error) {
            console.error(`Error terminating process: ${error.message}`);
          } else {
            console.log(`Successfully terminated process ${pid}`);
          }
        });
      }
    }
  }
}); 
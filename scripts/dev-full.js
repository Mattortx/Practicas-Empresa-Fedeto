import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const processes = [
  spawn("node", ["server/index.js"], {
    env: { ...process.env, PORT: process.env.PORT ?? "8787" },
    stdio: "inherit"
  }),
  spawn(npmCommand, ["run", "dev"], {
    env: process.env,
    stdio: "inherit"
  })
];

let shuttingDown = false;

for (const child of processes) {
  child.on("exit", (code) => {
    if (!shuttingDown && code && code !== 0) {
      shutdown(code);
    }
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

function shutdown(code) {
  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }

  process.exit(code);
}

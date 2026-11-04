import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const port = Number(process.env.PORT);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("Faktorial Live must supply a PORT between 1 and 65535.");
}
const server = await createServer({
  root: fileURLToPath(new URL("../", import.meta.url)),
  server: { host: process.env.HOST || "127.0.0.1", port, strictPort: true },
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => {
    await server.close();
    process.exit(0);
  });
}
await server.listen();
server.printUrls();

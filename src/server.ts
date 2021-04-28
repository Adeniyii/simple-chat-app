import * as http from "http";
import * as path from "path";
import { serveStatic, Map } from "./helpers";

let cache: Map = {};

const server = http.createServer((req, res) => {
  let filePath: string;

  if (req.url === "/") {
    filePath = "../public/index.html";
  } else {
    // filePath = "../public" + req.url!;
    filePath = "../public/tailwind.html";
  }

  let absPath = path.resolve(__dirname, filePath);

  serveStatic(res, cache, absPath);
});

server.listen(3000, () => console.log("Listening on port 3000..."));

import * as fs from "fs/promises";
import * as mime from "mime";
import * as http from "http";
import * as path from "path";

export interface Map {
  [key: string]: Buffer;
}

export async function serveStatic(
  response: http.ServerResponse,
  cache: Map,
  absPath: string
) {
  try {
    if (cache[absPath]) {
      sendFile(response, absPath, cache[absPath]);
    } else {
      await fs.access(absPath);
      const data = await fs.readFile(absPath);
      cache[absPath] = data;
      sendFile(response, absPath, data);
    }
  } catch (error) {
    send404(response, error.message);
  }
}

function sendFile(
  response: http.ServerResponse,
  filePath: string,
  fileContent: Buffer
) {
  response.writeHead(200, {
    "Content-Type": mime.getType(path.basename(filePath)) as string,
  });
  response.end(fileContent);
}

function send404(response: http.ServerResponse, message: string) {
  response.writeHead(404, { "Content-Type": "text/plain" });
  response.write(message.split(",")[0]);
  response.end();
}

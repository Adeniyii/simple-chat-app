"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("./helpers");
let cache = {};
const server = http_1.default.createServer((req, res) => {
    let filePath;
    if (req.url === "/") {
        filePath = "public/index.html";
    }
    else {
        filePath = "public" + req.url;
    }
    let absPath = path_1.default.resolve(__dirname, filePath);
    helpers_1.serveStatic(res, cache, absPath);
});
server.listen(3000, () => "Listening on port 3000...");
//# sourceMappingURL=server.js.map
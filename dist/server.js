"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const path = __importStar(require("path"));
const helpers_1 = require("./helpers");
let cache = {};
const server = http.createServer((req, res) => {
    let filePath;
    if (req.url === "/") {
        filePath = "../public/index.html";
    }
    else {
        filePath = "../public/tailwind.html";
    }
    let absPath = path.resolve(__dirname, filePath);
    helpers_1.serveStatic(res, cache, absPath);
});
server.listen(3000, () => console.log("Listening on port 3000..."));
//# sourceMappingURL=server.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveStatic = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const mime_1 = __importDefault(require("mime"));
const path_1 = __importDefault(require("path"));
function send404(response, message) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.write(message);
    response.end();
}
function sendFile(response, filePath, fileContent) {
    response.writeHead(200, {
        "Content-Type": mime_1.default.getType(path_1.default.basename(filePath)),
    });
    response.end(fileContent);
}
const serveStatic = function (response, cache, absPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (cache[absPath]) {
                sendFile(response, absPath, cache[absPath]);
            }
            else {
                yield promises_1.default.access(absPath);
                const data = yield promises_1.default.readFile(absPath);
                cache[absPath] = data;
                sendFile(response, absPath, data);
            }
        }
        catch (error) {
            send404(response, error.message);
        }
    });
};
exports.serveStatic = serveStatic;
//# sourceMappingURL=helpers.js.map
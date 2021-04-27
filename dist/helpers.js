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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveStatic = void 0;
const fs = __importStar(require("fs/promises"));
const mime = __importStar(require("mime"));
const path = __importStar(require("path"));
function serveStatic(response, cache, absPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (cache[absPath]) {
                sendFile(response, absPath, cache[absPath]);
            }
            else {
                yield fs.access(absPath);
                const data = yield fs.readFile(absPath);
                cache[absPath] = data;
                sendFile(response, absPath, data);
            }
        }
        catch (error) {
            send404(response, error.message);
        }
    });
}
exports.serveStatic = serveStatic;
function sendFile(response, filePath, fileContent) {
    response.writeHead(200, {
        "Content-Type": mime.getType(path.basename(filePath)),
    });
    response.end(fileContent);
}
function send404(response, message) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.write(message.split(",")[0]);
    response.end();
}
//# sourceMappingURL=helpers.js.map
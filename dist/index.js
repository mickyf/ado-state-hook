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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var azdev = __importStar(require("azure-devops-node-api"));
var common = __importStar(require("./common"));
var WorkItemTrackingInterfaces_1 = require("azure-devops-node-api/interfaces/WorkItemTrackingInterfaces");
// your collection url
var orgUrl = "https://dev.azure.com/wwimmo-mobile";
var token = process.env.ADO_PAT || ""; // e.g "cbdeb34vzyuk5l4gxc4qfczn3lko3avfkfqyb47etahq6axpcqha"; 
var authHandler = azdev.getPersonalAccessTokenHandler(token);
var connection = new azdev.WebApi(orgUrl, authHandler);
run();
function run() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var projectId, webApi, witApi, coreApiObject, project, teamContext, wi, url, idstr, id, child;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    projectId = common.getProject();
                    return [4 /*yield*/, common.getWebApi()];
                case 1:
                    webApi = _d.sent();
                    return [4 /*yield*/, webApi.getWorkItemTrackingApi()];
                case 2:
                    witApi = _d.sent();
                    return [4 /*yield*/, webApi.getCoreApi()];
                case 3:
                    coreApiObject = _d.sent();
                    return [4 /*yield*/, coreApiObject.getProject(projectId)];
                case 4:
                    project = _d.sent();
                    teamContext = {
                        project: project.name,
                        projectId: project.id,
                        team: (_a = project.defaultTeam) === null || _a === void 0 ? void 0 : _a.name,
                        teamId: (_b = project.defaultTeam) === null || _b === void 0 ? void 0 : _b.id
                    };
                    common.banner('Work Item Tracking Samples');
                    return [4 /*yield*/, witApi.getWorkItem(260, undefined, undefined, WorkItemTrackingInterfaces_1.WorkItemExpand.Relations)];
                case 5:
                    wi = _d.sent();
                    (_c = wi.relations) === null || _c === void 0 ? void 0 : _c.map(function (rel) { return console.dir(rel); });
                    if (!wi.relations) return [3 /*break*/, 7];
                    url = wi.relations[0].url || "";
                    idstr = url.substring(url.lastIndexOf('/') + 1);
                    id = parseInt(idstr);
                    return [4 /*yield*/, witApi.getWorkItem(id, undefined, undefined, WorkItemTrackingInterfaces_1.WorkItemExpand.Relations)];
                case 6:
                    child = _d.sent();
                    console.dir(child);
                    console.log(child.fields);
                    console.log(typeof child.fields);
                    console.log(child.fields && child.fields["System.Parent"]);
                    _d.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.run = run;

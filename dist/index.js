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
Object.defineProperty(exports, "__esModule", { value: true });
const azdev = require("azure-devops-node-api");
const common = require("./common");
const WorkItemTrackingInterfaces_1 = require("azure-devops-node-api/interfaces/WorkItemTrackingInterfaces");
// your collection url
let orgUrl = "https://dev.azure.com/wwimmo-mobile";
let token = process.env.ADO_PAT || ""; // e.g "cbdeb34vzyuk5l4gxc4qfczn3lko3avfkfqyb47etahq6axpcqha"; 
let authHandler = azdev.getPersonalAccessTokenHandler(token);
let connection = new azdev.WebApi(orgUrl, authHandler);
run();
function run() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const projectId = common.getProject();
        const webApi = yield common.getWebApi();
        const witApi = yield webApi.getWorkItemTrackingApi();
        const coreApiObject = yield webApi.getCoreApi();
        const project = yield coreApiObject.getProject(projectId);
        const teamContext = {
            project: project.name,
            projectId: project.id,
            team: (_a = project.defaultTeam) === null || _a === void 0 ? void 0 : _a.name,
            teamId: (_b = project.defaultTeam) === null || _b === void 0 ? void 0 : _b.id
        };
        common.banner('Work Item Tracking Samples');
        //common.heading('Overview of recent activity');
        //console.log('Work data in progress', await witApi.getAccountMyWorkData(QueryOption.Doing));
        //console.log('Recent Activity:', await witApi.getRecentActivityData());
        const wi = yield witApi.getWorkItem(260, undefined, undefined, WorkItemTrackingInterfaces_1.WorkItemExpand.Relations);
        (_c = wi.relations) === null || _c === void 0 ? void 0 : _c.map(rel => console.dir(rel));
        if (wi.relations) {
            const url = wi.relations[0].url || "";
            const idstr = url.substring(url.lastIndexOf('/') + 1);
            const id = parseInt(idstr);
            const child = yield witApi.getWorkItem(id, undefined, undefined, WorkItemTrackingInterfaces_1.WorkItemExpand.Relations);
            console.dir(child);
            console.log(child.fields);
            console.log(typeof child.fields);
            console.log(child.fields && child.fields["System.Parent"]);
            //child.fields?.map((field: any) => field === "System.Parent" ? console.log(field) : undefined)
        }
    });
}
exports.run = run;
//# sourceMappingURL=index.js.map
import * as azdev from "azure-devops-node-api";
import * as common from './common';
import * as nodeApi from 'azure-devops-node-api';

import * as ba from "azure-devops-node-api/BuildApi";
import { WorkItemTrackingApi, IWorkItemTrackingApi } from "azure-devops-node-api/WorkItemTrackingApi";
import { CoreApi } from "azure-devops-node-api/CoreApi";
import { TeamProject, TeamContext } from "azure-devops-node-api/interfaces/CoreInterfaces";
import { QueryOption, WorkItemExpand } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";

// your collection url
let orgUrl = "https://dev.azure.com/wwimmo-mobile";

let token: string = process.env.ADO_PAT || ""; // e.g "cbdeb34vzyuk5l4gxc4qfczn3lko3avfkfqyb47etahq6axpcqha"; 

let authHandler = azdev.getPersonalAccessTokenHandler(token);
let connection = new azdev.WebApi(orgUrl, authHandler);

run()

export async function run() {
    const projectId: string = common.getProject();
    const webApi: nodeApi.WebApi = await common.getWebApi();
    const witApi: IWorkItemTrackingApi = await webApi.getWorkItemTrackingApi();
    const coreApiObject: CoreApi = await webApi.getCoreApi();
    const project: TeamProject = await coreApiObject.getProject(projectId);
    const teamContext: TeamContext = {
        project: project.name,
        projectId: project.id,
        team: project.defaultTeam?.name,
        teamId: project.defaultTeam?.id
    };
    common.banner('Work Item Tracking Samples');

    //common.heading('Overview of recent activity');
    //console.log('Work data in progress', await witApi.getAccountMyWorkData(QueryOption.Doing));
    //console.log('Recent Activity:', await witApi.getRecentActivityData());
    const wi = await witApi.getWorkItem(260, undefined, undefined, WorkItemExpand.Relations);

    wi.relations?.map(rel => console.dir(rel))
    if (wi.relations) {
        const url = wi.relations[0].url || "";
        const idstr = url.substring(url.lastIndexOf('/') + 1);
        const id = parseInt(idstr);
        const child = await witApi.getWorkItem(id, undefined, undefined, WorkItemExpand.Relations);
        console.dir(child);
        console.log(child.fields)
        console.log(typeof child.fields)
        console.log(child.fields && child.fields["System.Parent"]);
        //child.fields?.map((field: any) => field === "System.Parent" ? console.log(field) : undefined)
    }

    //console.log('Recent Activity:', wi);
    //console.log('Recent Mentions:', await witApi.getRecentMentions());
}
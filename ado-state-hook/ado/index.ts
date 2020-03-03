import * as common from "./common";
import * as nodeApi from "azure-devops-node-api";
import { JsonPatchDocument } from "azure-devops-node-api/interfaces/Common/VSSInterfaces";
import { IWorkItemTrackingApi } from "azure-devops-node-api/WorkItemTrackingApi";
import { WorkItemExpand, WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";

enum WI_TYPES {
    epic = 1,
    issue = 2,
    task = 3
}

enum WI_STATES {
    todo = 1,
    doing = 2,
    done = 3
}

export async function updateParentWorkItem(wiid: number) {
    const webApi: nodeApi.WebApi = await common.getWebApi();
    const witApi: IWorkItemTrackingApi = await webApi.getWorkItemTrackingApi();

    const getType = (wi: WorkItem) => {
        const type = wi.fields["System.WorkItemType"];
        switch (type) {
            case "Epic":
                return WI_TYPES.epic;
            case "Issue":
                return WI_TYPES.issue;
            case "Task":
                return WI_TYPES.task;
            default:
                break;
        }
    };

    const getState = (wi: WorkItem) => {
        switch (wi.fields["System.State"]) {
            case "To Do":
                return WI_STATES.todo;
            case "Doing":
                return WI_STATES.doing;
            case "Done":
                return WI_STATES.done;
            default:
                break;
        }
    };

    const getADOStateByState = (state: WI_STATES) => {
        switch (state) {
            case WI_STATES.todo:
                return "To Do";
            case WI_STATES.doing:
                return "Doing";
            case WI_STATES.done:
                return "Done";
            default:
                break;
        }
    };

    const allChildsDone = async (wi: WorkItem) => {
        if (getType(wi) !== WI_TYPES.task) {
            const childs = wi.relations.filter((rel) => rel.rel === "System.LinkTypes.Hierarchy-Forward");
            console.log(`checking ${childs.length} childs for done state`);
            if (childs.length > 0) {
                const ids = childs.map((child) => {
                    const idstr = child.url.substring(child.url.lastIndexOf("/") + 1);
                    return parseInt(idstr);
                });
                const workitems = await witApi.getWorkItems(ids);
                if (workitems.some((child) => {
                    const state = getState(child);
                    if (state !== WI_STATES.done) {
                        return true;
                    }
                })) {
                    return false
                }
                return true;
            } else {
                return false;
            }
        }
        return false;
    };

    const allChildsTodo = async (wi: WorkItem) => {
        if (getType(wi) !== WI_TYPES.task) {
            const childs = wi.relations.filter((rel) => rel.rel === "System.LinkTypes.Hierarchy-Forward");
            console.log(`checking ${childs.length} childs for todo state`);
            if (childs.length > 0) {
                const ids = childs.map((child) => {
                    const idstr = child.url.substring(child.url.lastIndexOf("/") + 1);
                    return parseInt(idstr);
                });
                const workitems = await witApi.getWorkItems(ids);
                if (workitems.some((child) => {
                    const state = getState(child);
                    if (state !== WI_STATES.todo) {
                        return true;
                    }
                })) {
                    return false
                }
                return true;
            } else {
                return false;
            }
        }
        return false;
    };

    const getParent = async (wi: WorkItem): Promise<WorkItem> => {
        const url = wi.relations.filter((rel) => rel.rel === "System.LinkTypes.Hierarchy-Reverse")[0].url || "";
        const idstr = url.substring(url.lastIndexOf("/") + 1);
        const parentid = parseInt(idstr);
        const parent = await witApi.getWorkItem(parentid, undefined, undefined, WorkItemExpand.Relations);
        return parent;
    };

    const setState = async (wi: WorkItem, state: WI_STATES) => {
        const actualState = getState(wi);
        if (actualState === state) {
            console.log("State already set!");
            return;
        } else {
            const document: JsonPatchDocument = [
                { op: "add", path: "/fields/System.State", value: getADOStateByState(state) }
            ];
            const result = await witApi.updateWorkItem(undefined, document, wi.id);
            console.log("Result State: " + getState(result));
        }
    };

    common.banner("checking if all childs are done");
    let wi = await witApi.getWorkItem(wiid, undefined, undefined, WorkItemExpand.Relations);
    if (wi) {
        let state = getState(wi);
        let type = getType(wi);
        console.log(`input type is: ${wi.fields["System.WorkItemType"]}`);
        console.log(`input state is: ${wi.fields["System.State"]}`);

        if (type === WI_TYPES.issue) {
            wi = await getParent(wi);
            state = getState(wi);
            type = getType(wi);
        } else if (type === WI_TYPES.task) {
            wi = await getParent(wi);
            state = getState(wi);
            type = getType(wi);
        }

        if (await allChildsDone(wi)) {
            console.log("everything is done, so the parent should also be done");
            setState(wi, WI_STATES.done);
        } else {
            console.log("not everything is done, so the parent should not be done");
            let childstodo = false;

            if (type !== WI_TYPES.task) {
                childstodo = await allChildsTodo(wi);
            }

            if (childstodo) {
                console.log("nothing started, so the parent should be todo");
                setState(wi, WI_STATES.todo);
            } else {
                console.log("something started, so the parent should be doing");
                setState(wi, WI_STATES.doing);
            }
        }
    }
}

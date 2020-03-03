import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { updateParentWorkItem } from "./ado";

const httpTrigger: AzureFunction = async function(context: Context, req: HttpRequest): Promise<void> {
    context.log("HTTP trigger function processed a request.");
    const name = req.query.name || (req.body && req.body.name);
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    try {
        if (req.body?.resource?.workItemId !== undefined) {
            const wiid = parseInt(req.body.resource.workItemId);
            if (wiid > 0) {
                await updateParentWorkItem(wiid);
                context.res = {
                    status: 200,
                    body: "OK"
                };
            } else {
                context.res = {
                    status: 204,
                    body: "No workitemid supplied"
                };
            }
        } else {
            context.res = {
                status: 400,
                body: "no workitemid supplied"
            };
        }
    } catch (error) {
        context.res = {
            status: 500,
            body: "Error: " + error.message
        };
    }
};

export default httpTrigger;

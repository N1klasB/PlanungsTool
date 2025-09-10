const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    console.log("Incoming event:", JSON.stringify(event));

    const body = JSON.parse(event.body || "{}");

    const userName = event.requestContext?.authorizer?.claims?.["cognito:username"];

    if (!userName) {
      console.log("Unauthorized access attempt.");
      return {
        statusCode: 403,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    const taskIds = body.taskIds || [];
    const projectIds = body.projectIds || [];

    console.log("Task IDs to delete:", taskIds);
    console.log("Project IDs to delete:", projectIds);

    const deleteRequests = [
      ...taskIds.map((id) => ({ id, type: "task" })),
      ...projectIds.map((id) => ({ id, type: "project" })),
    ];

    let deletedCount = 0;

    for (const entry of deleteRequests) {
      console.log(`Deleting ${entry.type} with id ${entry.id} for user ${userName}`);
      await docClient.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: {
            userName: userName,
            id: entry.id,
          },
        })
      );
      deletedCount++;
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: `Deleted ${deletedCount} item(s).`,
      }),
    };
  } catch (err) {
    console.error("Error during delete:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Server error." }),
    };
  }
};

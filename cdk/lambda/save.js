const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    const userName =
      event.requestContext?.authorizer?.claims?.["cognito:username"];

    if (!userName) {
      return {
        statusCode: 403,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    const tasks = body.tasks || [];
    const projects = body.projects || [];
    const now = new Date().toISOString();

    const putRequests = [
      ...tasks.map((task) => ({
        userName: userName,
        id: task.taskId,
        type: "task",
        ...task,
        timestamp: now,
      })),
      ...projects.map((project) => ({
        userName: userName,
        id: project.projectId,
        type: "project",
        ...project,
        timestamp: now,
      })),
    ];

    for (const item of putRequests) {
      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: item,
        })
      );
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Save successful" }),
    };
  } catch (err) {
    console.error("Error:", err);
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

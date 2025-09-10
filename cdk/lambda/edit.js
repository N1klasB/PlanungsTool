const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

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

    const updates = [];

    for (const task of tasks) {
      const key = {
        userName: userName,
        id: task.taskId,
      };

      const updateFields = { ...task, timestamp: now };
      delete updateFields.taskId;
      delete updateFields.userName;
      delete updateFields.id;

      const expressions = Object.keys(updateFields).map(
        (field, idx) => `#f${idx} = :v${idx}`
      );
      const expressionNames = {};
      const expressionValues = {};
      Object.keys(updateFields).forEach((field, idx) => {
        expressionNames[`#f${idx}`] = field;
        expressionValues[`:v${idx}`] = updateFields[field];
      });

      updates.push(
        docClient.send(
          new UpdateCommand({
            TableName: TABLE_NAME,
            Key: key,
            UpdateExpression: `SET ${expressions.join(", ")}`,
            ExpressionAttributeNames: expressionNames,
            ExpressionAttributeValues: expressionValues,
          })
        )
      );
    }

    for (const project of projects) {
      const key = {
        userName: userName,
        id: project.projectId,
      };

      const updateFields = { ...project, timestamp: now };
      delete updateFields.projectId;
      delete updateFields.userName;
      delete updateFields.id;

      const expressions = Object.keys(updateFields).map(
        (field, idx) => `#f${idx} = :v${idx}`
      );
      const expressionNames = {};
      const expressionValues = {};
      Object.keys(updateFields).forEach((field, idx) => {
        expressionNames[`#f${idx}`] = field;
        expressionValues[`:v${idx}`] = updateFields[field];
      });

      updates.push(
        docClient.send(
          new UpdateCommand({
            TableName: TABLE_NAME,
            Key: key,
            UpdateExpression: `SET ${expressions.join(", ")}`,
            ExpressionAttributeNames: expressionNames,
            ExpressionAttributeValues: expressionValues,
          })
        )
      );
    }

    await Promise.all(updates);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Update successful" }),
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

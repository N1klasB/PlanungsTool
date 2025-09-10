const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    const userName = event.requestContext?.authorizer?.claims?.["cognito:username"];

    if (!userName) {
      return {
        statusCode: 403,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "userName = :userName",
        ExpressionAttributeValues: {
          ":userName": userName,
        },
      })
    );

    const items = result.Items || [];

    const tasks = items.filter((item) => item.type === "task");
    const projects = items.filter((item) => item.type === "project");

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ tasks, projects, message: "Load successful" }),
    };
  } catch (err) {
    console.error("Error loading items:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Server error." }),
    };
  }
};

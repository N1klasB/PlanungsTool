const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});

exports.handler = async (event) => {
  const sessionId = event.queryStringParameters?.id;

  try {
    const response = await client.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "id = :sid",
        FilterExpression: "#type = :t",
        ExpressionAttributeNames: {
          "#type": "type",
        },
        ExpressionAttributeValues: {
          ":sid": { S: sessionId },
          ":t": { S: "task" },
        },
      })
    );

    const now = new Date();
    const oneDayLater = new Date(now);
    oneDayLater.setDate(now.getDate() + 1);

    const items = response.Items || [];

    const upcomingTasks = items.filter((task) => {
      if (!task.deadline || !task.deadline.S) return false;
      const deadlineDate = new Date(task.deadline.S);
      return deadlineDate >= now && deadlineDate <= oneDayLater;
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ tasks: upcomingTasks }),
    };
  } catch (err) {
    console.error("Query error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

import { CloudFormationClient, DescribeStacksCommand } from "@aws-sdk/client-cloudformation";
import * as fs from "fs";
import * as path from "path";

const STACK_NAME = "PlanungsAssistenzTool2Stack";
const OUTPUT_FILE_PATH = path.resolve(__dirname, "frontend/src/config.ts");

async function generateConfig() {
  const client = new CloudFormationClient({ region: "eu-central-1" });

  const command = new DescribeStacksCommand({ StackName: STACK_NAME });

  try {
    const response = await client.send(command);

    const outputs = response.Stacks?.[0].Outputs || [];

    const configObj = {};

    outputs.forEach(({ OutputKey, OutputValue }) => {
      const key = OutputKey.toUpperCase();
      configObj[key] = OutputValue;
    });

    const fileContent = `export const config = ${JSON.stringify(configObj, null, 2)};\n`;

    fs.writeFileSync(OUTPUT_FILE_PATH, fileContent);

    console.log(`Config wurde erfolgreich in ${OUTPUT_FILE_PATH} geschrieben.`);
  } catch (error) {
    console.error("Fehler beim Auslesen des Stacks oder Schreiben der Config:", error);
  }
}

generateConfig();

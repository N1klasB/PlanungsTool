#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { PlanungsAssistenzTool2Stack } from "../lib/planungs-assistenz-tool2-stack";

const app = new cdk.App();
new PlanungsAssistenzTool2Stack(app, "PlanungsAssistenzToolStack", {});

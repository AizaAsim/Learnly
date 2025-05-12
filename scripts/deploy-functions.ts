/* eslint-disable no-console */
import { exec } from "child_process";
import { readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

/**
 * This script deploys all the functions in the functions/src directory
 * in batches of 10 functions at a time. It waits for 30 seconds between
 * each batch to avoid hitting the Firebase deployment limits.
 */

// ** Helper Functions **

/**
 * Get all the function names from the src directory
 * @param srcDir - The directory where the functions are located
 * @param targets - The subdirectories in the src directory
 * @returns An array of function names
 */
const parseFunctionNames = (srcDir: string, targets: string[]) => {
  const targetDirs = targets.map((dir) => join(srcDir, dir));
  const filePathArray = targetDirs.flatMap(
    (dir) => readdirSync(dir, { recursive: true }) as string[]
  );
  return filePathArray
    .filter((file) => !file.includes("index.ts") && file.endsWith(".ts"))
    .map((file) => file.split(".ts")[0].replace("/", "-"));
};

/**
 * Deploys a batch of functions
 * @param start - The starting index of the batch
 * @param end - The ending index of the batch
 * @returns A promise that resolves when the batch is deployed
 */
const deployBatch = (
  targetDirs: string[],
  start: number,
  end: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const batch = targetDirs.slice(start, end).join(",functions:");
    exec(
      `firebase deploy --only functions:${batch}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(
            "\x1b[31m%s\x1b[0m",
            `Error deploying functions: ${stderr}`
          );
          reject(error);
        } else {
          console.log(
            "\x1b[32m%s\x1b[0m",
            `Successfully deployed functions!!!`
          );
          resolve();
        }
      }
    );
  });
};

// ** Main Function **

type DeployOptions = {
  batchSize: number;
  waitTime: number;
};

/**
 * Deploys all the functions in batches
 * @param functionNames - An array of function names
 * @param opts - The deployment options
 */
const deployFunctions = async (
  functionNames: string[],
  opts: DeployOptions
) => {
  const { batchSize, waitTime } = opts;
  const batches = Math.ceil(functionNames.length / batchSize);
  console.log("\x1b[36m%s\x1b[0m", "\n--------------------\n");
  console.log("\x1b[36m%s\x1b[0m", "\nDeployment Information:\n");
  console.log("\x1b[36m%s\x1b[0m", `Total functions: ${functionNames.length}`);
  console.log("\x1b[36m%s\x1b[0m", `Max Batch Size: ${batchSize}`);
  console.log("\x1b[36m%s\x1b[0m", `Batch Count: ${batches}`);
  console.log("\x1b[36m%s\x1b[0m", "\n--------------------\n");

  console.time("Deployment Timer");
  for (let i = 0; i < batches; i++) {
    console.time("Batch Timer");
    const start = i * batchSize;
    const end = Math.min(start + batchSize, functionNames.length);
    try {
      console.log(
        "\x1b[33m%s\x1b[0m",
        `\nDeploying Batch ${i + 1} of ${batches}:\n`
      );
      console.log(` - ${functionNames.slice(start, end).join("\n - ")}`);
      await deployBatch(functionNames, start, end);
      console.timeEnd("Batch Timer");
      console.log(
        "\x1b[31m%s\x1b[0m",
        `Waiting for ${waitTime / 1000} seconds before deploying the next batch...\n\n`
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", `Failed to deploy batch ${i}`);
      console.error(error);
      process.exit(1);
    }
  }
  console.timeEnd("Deployment Timer");
  console.log("All functions deployed successfully");
};

// ** Run Deployment Script **

const rootDir = join(fileURLToPath(import.meta.url), "../../..");
const functionsDir = join(rootDir, "functions");

// ** 1. Parse function names from the src directory
const functionsSrcDir = join(functionsDir, "src");

// These are the subdirectories in the functions/src directory
const targets = ["callable", "http", "pubsub-triggers", "triggers"];
const functions = parseFunctionNames(functionsSrcDir, targets);

// ** 2. Add Webhooks to the list of functions

// Webhooks have a different export convention so we need to add them manually
const webhookNames = [
  "webhooks-mux",
  "webhooks-stripe",
  "webhooks-connectedStripe",
];
functions.push(...webhookNames);

// ** 3. Deploy the functions in batches
deployFunctions(functions, {
  batchSize: 25,
  waitTime: 15000,
}).catch((error) => {
  console.error("\x1b[31m%s\x1b[0m", "Failed to deploy functions");
  console.error(error);
  process.exit(1);
});

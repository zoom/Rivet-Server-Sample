import * as util from 'util';
import { UsersS2SAuthClient, ConsoleLogger, AwsLambdaReceiver } from "@zoom/rivet/users";
import type { APIGatewayProxyEventV2, LambdaFunctionURLResult, Context, Handler, Callback, LambdaFunctionURLHandler } from 'aws-lambda';
// import express from 'express';
// import dotenv from 'dotenv';

// const app: any = express();
// app.use(express.json());
// // dotenv.config({path: './.env'});
// dotenv.config();

// const startServer = async () : Promise<LambdaFunctionURLHandler> => {
//     // Rivet SDK Logger
//     const logger = new ConsoleLogger();

//     const usersS2SOAuthClient = new UsersS2SAuthClient({
//         clientId: <string>process.env.StS_CLIENT_ID,
//         clientSecret: <string>process.env.StS_CLIENT_SECRET,
//         webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
//         accountId: <string>process.env.ACCOUNT_ID,
//         receiver: new AwsLambdaReceiver({
//             webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN
//         }),
//     });

//     console.log('Serverless running');

//     let handler = await usersS2SOAuthClient.start();

//     //events
//     usersS2SOAuthClient.webEventConsumer.event("user.created", (response: any)=>{
//         logger.info(['Event Received', response.payload]);
//     });
//     usersS2SOAuthClient.webEventConsumer.event("user.deleted", (response: any)=>{
//         logger.info(['Event Received', response.payload]);
//     });
//     usersS2SOAuthClient.webEventConsumer.event("user.updated", (response: any)=>{
//         logger.info(['Event Received', response.payload]);
//     });

//     return handler;
// };

// export const handler: Handler = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback<LambdaFunctionURLResult<never>>) => {
//     const lambdaHandler : LambdaFunctionURLHandler = await startServer();
//     return lambdaHandler(event, context, callback);
// };

export const handler = async (event: APIGatewayProxyEventV2, context: Context, callback: Callback<LambdaFunctionURLResult<never>>) => {
    console.log("Hello World");
};
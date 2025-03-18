import { PhoneS2SAuthClient, ConsoleLogger } from "@zoom/rivet/phone";
import express from 'express';
import dotenv from 'dotenv';

const app: express.Application = express();
app.use(express.json());
dotenv.config();
const exPort: number = parseInt(process.argv[2] || <string>process.env.PHONE_SERVER_PORT);

const startServer = async () => {
    // Rivet SDK Logger
    const logger = new ConsoleLogger();

    //phone API Auth
    const phoneS2SOAuthClient = new PhoneS2SAuthClient({
        clientId: <string>process.env.StS_CLIENT_ID,
        clientSecret: <string>process.env.StS_CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
        accountId: <string>process.env.ACCOUNT_ID,
        port: exPort + 2
    });

    await phoneS2SOAuthClient.start();
    
    const eventHandler = (response: any)=>{
        logger.info(['Event Received', response.payload]);
    }
    //events
    phoneS2SOAuthClient.webEventConsumer.event( "phone.voicemail_received", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.sms_sent", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.voicemail_deleted", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_missed", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_ringing", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_ended", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_ended", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_mute", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_ended", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_hold", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_connected", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.sms_sent_failed", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_ringing", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_answered", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_unmute", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_rejected", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_unmute", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.sms_received", eventHandler);
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_mute", eventHandler);
    
    //endpoints
    app.get('/', (req: express.Request, res: express.Response)=>{
        res.status(200).send('phone API Server Running!')
    });

    app.get('/getcalllogs', async (req: express.Request, res: express.Response)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }

        let request_data = req.body;
        let query = ('query' in request_data) ? request_data.query : {};

        try {
          let responseData: object = await phoneS2SOAuthClient.endpoints.callLogs.getAccountsCallLogs({ query });
          logger.info(['call logs retrieved', responseData]);
          res.status(200).send({success: 'call logs retrieved', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.get('/listphonenumbers', async (req: express.Request, res: express.Response)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }

        let request_data = req.body;
        let query = ('query' in request_data) ? request_data.query : {};

        try {
          let responseData: object = await phoneS2SOAuthClient.endpoints.phoneNumbers.listPhoneNumbers({ query });
          logger.info(['phone numbers retrieved', responseData]);
          res.status(200).send({success: 'phone numbers retrieved', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.get('/listcallingplans', async (req: express.Request, res: express.Response)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }

        try {
          let responseData: object = await phoneS2SOAuthClient.endpoints.phonePlans.listCallingPlans({ });
          logger.info(['calling plans retrieved', responseData]);
          res.status(200).send({success: 'calling plans retrieved'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
};

if (typeof exPort === 'number' && exPort > 1023 && exPort < 65536) {
    startServer();
    
    app.listen(exPort, () => {
        console.log(`Zoom Rivet Phone Server Started on port ${exPort}`);
    });
  } else {
      console.log("Please use port range 1024-65535");
}
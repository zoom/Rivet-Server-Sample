import { PhoneOAuthClient, ConsoleLogger } from "@zoom/rivet/phone";
import express from 'express';
import dotenv from 'dotenv';

const app: express.Application = express();
app.use(express.json());
dotenv.config();
const exPort: number = parseInt(process.argv[2] || <string>process.env.PHONE_SERVER_PORT);

const startServer = async () => {
    let installerOptions = {
        redirectUri: <string>process.env.REDIRECT_URI,
        stateStore: <string>process.env.STATE_STORE
    };

    // Rivet SDK Logger
    const logger = new ConsoleLogger();

    //phone API Auth
    const phoneOAuthClient = new PhoneOAuthClient({
        clientId: <string>process.env.CLIENT_ID,
        clientSecret: <string>process.env.CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.WEBHOOK_SECRET_TOKEN,
        installerOptions: installerOptions,
        port: exPort + 1
    });

    await phoneOAuthClient.start();
    
    const eventHandler = (response: any)=>{
        logger.info(['Event Received', response.payload]);
    }
    //events
    phoneOAuthClient.webEventConsumer.event( "phone.voicemail_received", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.sms_sent", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.voicemail_deleted", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.callee_missed", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.caller_ringing", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.caller_ended", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.callee_ended", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.callee_mute", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.caller_ended", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.caller_hold", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.caller_connected", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.sms_sent_failed", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.callee_ringing", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.callee_answered", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.caller_unmute", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.callee_rejected", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.callee_unmute", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.sms_received", eventHandler);
    phoneOAuthClient.webEventConsumer.event("phone.caller_mute", eventHandler);
    
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
          let responseData: object = await phoneOAuthClient.endpoints.callLogs.getAccountsCallLogs({ query });
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
          let responseData: object = await phoneOAuthClient.endpoints.phoneNumbers.listPhoneNumbers({ query });
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
          let responseData: object = await phoneOAuthClient.endpoints.phonePlans.listCallingPlans({ });
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
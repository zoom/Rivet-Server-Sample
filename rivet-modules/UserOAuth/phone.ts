import { PhoneOAuthClient, ConsoleLogger } from "@zoom/rivet/phone";
import express from 'express';
import dotenv from 'dotenv';

const app: any = express();
app.use(express.json());
dotenv.config();

const exPort: number = parseInt(process.argv[2] || <string>process.env.PHONE_SERVER_PORT);

const startServer = async () => {

    let installerOptions = {
        redirectUri: <string>process.env.REDIRECT_URI,
        // redirectUriPath: <string>process.env.REDIRECT_URI_PATH,
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

    //events
    phoneOAuthClient.webEventConsumer.event( "phone.voicemail_received", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.sms_sent", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.voicemail_deleted", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.callee_missed", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.caller_ringing", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.caller_ended", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.callee_ended", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.callee_mute", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.caller_ended", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.caller_hold", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.caller_connected", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.sms_sent_failed", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.callee_ringing", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.callee_answered", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.caller_unmute", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.callee_rejected", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.callee_unmute", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.sms_received", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneOAuthClient.webEventConsumer.event("phone.caller_mute", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    
    //endpoints
    app.get('/', (req: any, res: any)=>{
        res.status(200).send('phone API Server Running!')
    });

    app.get('/getcalllogs', async (req: any, res: any)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }

        let request_data = req.body;
        let query = ('query' in request_data) ? request_data.query : {};

        try {
          let responseData: any = await phoneOAuthClient.endpoints.callLogs.getAccountsCallLogs({ query });
          logger.info(['call logs retrieved', responseData]);
          res.status(200).send({success: 'call logs retrieved', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.get('/listphonenumbers', async (req: any, res: any)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }

        let request_data = req.body;
        let query = ('query' in request_data) ? request_data.query : {};

        try {
          let responseData: any = await phoneOAuthClient.endpoints.phoneNumbers.listPhoneNumbers({ query });
          logger.info(['phone numbers retrieved', responseData]);
          res.status(200).send({success: 'phone numbers retrieved', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.get('/listcallingplans', async (req: any, res: any)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }

        try {
          let responseData: any = await phoneOAuthClient.endpoints.phonePlans.listCallingPlans({ });
          logger.info(['calling plans retrieved', responseData]);
          res.status(200).send({success: 'calling plans retrieved'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
};

startServer();

if (typeof exPort === 'number' && exPort > 1023 && exPort < 65536) {
    startServer();
    
    app.listen(exPort, () => {
        console.log(`Zoom Rivet Phone Server Started on port ${exPort}`);
    });
  } else {
      console.log("Please use port range 1024-65535");
}
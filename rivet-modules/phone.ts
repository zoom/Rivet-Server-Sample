import { PhoneOAuthClient, PhoneS2SAuthClient, ConsoleLogger } from "@zoom/rivet/phone";
import express from 'express';
import dotenv from 'dotenv';

const exPort: number = parseInt(<string>process.env.PHONE_SERVER_PORT);
const app: any = express();
app.use(express.json());
dotenv.config();

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
    
    const phoneS2SOAuthClient = new PhoneS2SAuthClient({
        clientId: <string>process.env.StS_CLIENT_ID,
        clientSecret: <string>process.env.StS_CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
        accountId: <string>process.env.ACCOUNT_ID,
        port: exPort + 2
    });

    await phoneOAuthClient.start();
    await phoneS2SOAuthClient.start();

    /**
     * For the following events and endpoints, you can switch out phoneS2SOAuthClient for phoneOAuthClient 
     * if user OAuth is the authentication of choice.
     */

    //events
    phoneS2SOAuthClient.webEventConsumer.event( "phone.voicemail_received", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.sms_sent", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.voicemail_deleted", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_missed", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_ringing", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_ended", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_ended", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_mute", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_ended", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_hold", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_connected", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.sms_sent_failed", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_ringing", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_answered", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_unmute", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_rejected", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.callee_unmute", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.sms_received", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    phoneS2SOAuthClient.webEventConsumer.event("phone.caller_mute", (response: any)=>{
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
          let responseData: any = await phoneS2SOAuthClient.endpoints.callLogs.getAccountsCallLogs({ query });
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
          let responseData: any = await phoneS2SOAuthClient.endpoints.phoneNumbers.listPhoneNumbers({ query });
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
          let responseData: any = await phoneS2SOAuthClient.endpoints.phonePlans.listCallingPlans({ });
          logger.info(['calling plans retrieved', responseData]);
          res.status(200).send({success: 'calling plans retrieved'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
};

startServer();

app.listen(exPort, () => {
    console.log(`Zoom Rivet Phone Server Started on port ${exPort}`);
    // open('http://localhost:5021/zoom/oauth/install');
});
import { MeetingsS2SAuthClient, ConsoleLogger } from "@zoom/rivet/meetings";
import express from 'express';
import dotenv from 'dotenv';

const app: any = express();
app.use(express.json());
dotenv.config();

const exPort: number = parseInt(process.argv[2] || <string>process.env.MEETINGS_SERVER_PORT);

const startServer = async () => {
    // Rivet SDK Logger
    const logger = new ConsoleLogger();

    //meetings API Auth
    const meetingsS2SOAuthClient = new MeetingsS2SAuthClient({
        clientId: <string>process.env.StS_CLIENT_ID,
        clientSecret: <string>process.env.StS_CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
        accountId: <string>process.env.ACCOUNT_ID,
        port: exPort + 2
    });

    await meetingsS2SOAuthClient.start();

    /**
     * For the following events and endpoints, you can switch out meetingsS2SOAuthClient for meetingsOAuthClient 
     * if user OAuth is the authentication of choice.
     */

    //events
    meetingsS2SOAuthClient.webEventConsumer.event("meeting.created", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    meetingsS2SOAuthClient.webEventConsumer.event("meeting.deleted", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    meetingsS2SOAuthClient.webEventConsumer.event("meeting.updated", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    
    //endpoints
    app.get('/', (req: any, res: any)=>{
        res.status(200).send('Meetings API Server Running!')
    });

    app.get('/getmeeting', async (req: any, res: any)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }
        if (!('path' in req.body)) {
            res.status(400).send({test_server_error: "Request Body must include 'path' key"});
            return;
        }

        let request_data = req.body;
        let path = request_data.path;
        let query = ('query' in request_data) ? request_data.query : {};

        try {
          let responseData: any = await meetingsS2SOAuthClient.endpoints.meetings.getMeeting({ path, query });
          logger.info(['meeting retrieved', responseData]);
          res.status(200).send({success: 'meeting retrieved', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.post('/createmeeting', async (req: any, res: any)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }
        if (!('path' in req.body)) {
            res.status(400).send({test_server_error: "Request Body must include 'path' key"});
            return;
        }

        let request_data = req.body;
        let body = ('body' in request_data) ? request_data.body : {};
        let path = request_data.path;

        try {
          let responseData: any = await meetingsS2SOAuthClient.endpoints.meetings.createMeeting({ body, path });
          logger.info(['meeting created', responseData]);
          res.status(200).send({success: 'meeting created', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.delete('/deletemeeting', async (req: any, res: any)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }
        if (!('path' in req.body)) {
            res.status(400).send({test_server_error: "Request Body must include 'path' key"});
            return;
        }

        let request_data = req.body;
        let path = request_data.path;
        let query = ('query' in request_data) ? request_data.query : {};

        try {
          let responseData: any = await meetingsS2SOAuthClient.endpoints.meetings.deleteMeeting({ path, query });
          logger.info(['meeting deleted', responseData]);
          res.status(200).send({success: 'meeting deleted'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.patch('/updatemeeting', async (req: any, res: any)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }
        if (!('path' in req.body)) {
            res.status(400).send({test_server_error: "Request Body must include 'path' key"});
            return;
        }

        let request_data = req.body;
        let path = request_data.path;
        let body = ('body' in request_data) ? request_data.body : {};
        let query = ('query' in request_data) ? request_data.query : {};

        try {
          let responseData: any = await meetingsS2SOAuthClient.endpoints.meetings.updateMeeting({ body, path, query });
          logger.info(['meeting updated', responseData]);
          res.status(200).send({success: 'meeting updated'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
};

if (typeof exPort === 'number' && exPort > 1023 && exPort < 65536) {
    startServer();
    
    app.listen(exPort, () => {
        console.log(`Zoom Rivet Meetings Server Started on port ${exPort}`);
    });
  } else {
      console.log("Please use port range 1024-65535");
}
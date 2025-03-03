import {VideoSdkClient, ConsoleLogger } from "@zoom/rivet/videosdk";
import express from 'express';
import dotenv from 'dotenv';
import KJUR from 'jsrsasign';

const exPort: number = parseInt(<string>process.env.VIDEOSDK_SERVER_PORT);
const app: any = express();
app.use(express.json());
dotenv.config();

const startServer = async () => {
    // Rivet SDK Logger
    const logger = new ConsoleLogger();

    //sessions API Auth
    const videosdkClient = new VideoSdkClient({
        clientId: <string>process.env.ZOOM_VSDK_API_KEY,
        clientSecret: <string>process.env.ZOOM_VSDK_API_SECRET,
        webhooksSecretToken: <string>process.env.ZOOM_VSDK_WEBHOOK_SECRET_TOKEN,
        port: exPort + 1
    });

    await videosdkClient.start();

    //events
    videosdkClient.webEventConsumer.event("session.started", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    videosdkClient.webEventConsumer.event("session.user_joined", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    videosdkClient.webEventConsumer.event("session.user_left", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    videosdkClient.webEventConsumer.event("session.ended", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    
    //endpoints
    app.get('/', (req: any, res: any)=>{
        res.status(200).send('Video SDK API Server Running!')
    });

    app.get('/listsession', async (req: any, res: any)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }
        if (!('query' in req.body)) {
            res.status(400).send({test_server_error: "Request Body must include 'query' key"});
            return;
        }

        let request_data = req.body;
        let query = request_data.query;

        try {
          let responseData: any = await videosdkClient.endpoints.sessions.listSessions({ query });
          logger.info(['sessions retrieved', responseData]);
          res.status(200).send({success: 'sessions retrieved', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.post('/createsession', async (req: any, res: any)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }
        if (!('body' in req.body)) {
            res.status(400).send({test_server_error: "Request Body must include 'body' key"});
            return;
        }

        let request_data = req.body;
        let body = request_data.body;

        try {
          let responseData: any = await videosdkClient.endpoints.sessions.createSession({ body });
          logger.info(['session created', responseData]);
          res.status(200).send({success: 'session created', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.delete('/deletesession', async (req: any, res: any)=>{
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

        try {
          let responseData: any = await videosdkClient.endpoints.sessions.deleteSession({ path });
          logger.info(['session deleted', responseData]);
          res.status(200).send({success: 'session deleted'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.patch('/useinsessioneventscontrols', async (req: any, res: any)=>{
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

        try {
          let responseData: any = await videosdkClient.endpoints.sessions.useInSessionEventsControls({ body, path});
          logger.info(['control executed', responseData]);
          res.status(200).send({success: 'control executed'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
};

startServer();

app.listen(exPort, () => {
    console.log(`Zoom Rivet Video SDK API Server Started on port ${exPort}`);
    // open('http://localhost:5021/zoom/oauth/install');
});
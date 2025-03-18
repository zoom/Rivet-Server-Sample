import {VideoSdkClient, ConsoleLogger } from "@zoom/rivet/videosdk";
import express from 'express';
import dotenv from 'dotenv';


const app: express.Application = express();
app.use(express.json());
dotenv.config();

const exPort: number = parseInt(process.argv[2] || <string>process.env.VIDEOSDK_SERVER_PORT);

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

    const eventHandler = (response: any)=>{
        logger.info(['Event Received', response.payload]);
    }
    //events
    videosdkClient.webEventConsumer.event("session.started", eventHandler);
    videosdkClient.webEventConsumer.event("session.user_joined", eventHandler);
    videosdkClient.webEventConsumer.event("session.user_left", eventHandler);
    videosdkClient.webEventConsumer.event("session.ended", eventHandler);
    
    //endpoints
    app.get('/', (req: express.Request, res: express.Response)=>{
        res.status(200).send('Video SDK API Server Running!')
    });

    app.get('/listsession', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await videosdkClient.endpoints.sessions.listSessions({ query });
          logger.info(['sessions retrieved', responseData]);
          res.status(200).send({success: 'sessions retrieved', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.post('/createsession', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await videosdkClient.endpoints.sessions.createSession({ body });
          logger.info(['session created', responseData]);
          res.status(200).send({success: 'session created', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.delete('/deletesession', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await videosdkClient.endpoints.sessions.deleteSession({ path });
          logger.info(['session deleted', responseData]);
          res.status(200).send({success: 'session deleted'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.patch('/useinsessioneventscontrols', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await videosdkClient.endpoints.sessions.useInSessionEventsControls({ body, path});
          logger.info(['control executed', responseData]);
          res.status(200).send({success: 'control executed'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
};

if (typeof exPort === 'number' && exPort > 1023 && exPort < 65536) {
    startServer();
    
    app.listen(exPort, () => {
        console.log(`Zoom Rivet Video SDK API Server Started on port ${exPort}`);
    });
  } else {
      console.log("Please use port range 1024-65535");
}
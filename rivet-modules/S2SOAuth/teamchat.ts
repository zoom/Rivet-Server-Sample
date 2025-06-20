import { TeamChatS2SAuthClient, ConsoleLogger } from "@zoom/rivet/teamchat";
import express from 'express';
import dotenv from 'dotenv';

const app: express.Application = express();
app.use(express.json());
dotenv.config();

const exPort: number = parseInt(process.argv[2] || <string>process.env.TEAMCHAT_SERVER_PORT);

const startServer = async () => {
    // Rivet SDK Logger
    const logger = new ConsoleLogger();

    //teamChat API Auth
    const teamChatS2SOAuthClient = new TeamChatS2SAuthClient({
        clientId: <string>process.env.StS_CLIENT_ID,
        clientSecret: <string>process.env.StS_CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
        accountId: <string>process.env.ACCOUNT_ID,
        port: exPort + 1
    });

    await teamChatS2SOAuthClient.start();

    const eventHandler = (response: any)=>{
        logger.info(['Event Received', response.payload]);
    }
    //events
    teamChatS2SOAuthClient.webEventConsumer.event("chat_channel.created", eventHandler);
    teamChatS2SOAuthClient.webEventConsumer.event("chat_channel.deleted", eventHandler);
    teamChatS2SOAuthClient.webEventConsumer.event("chat_channel.updated", eventHandler);
    teamChatS2SOAuthClient.webEventConsumer.event("chat_channel.member_joined", eventHandler);
    teamChatS2SOAuthClient.webEventConsumer.event("chat_channel.member_left", eventHandler);
    teamChatS2SOAuthClient.webEventConsumer.event("chat_message.sent", eventHandler);
    
    //endpoints
    app.get('/', (req: express.Request, res: express.Response)=>{
        res.status(200).send('teamChat API Server Running!')
    });

    //chat channels
    app.get('/getchannel', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await teamChatS2SOAuthClient.endpoints.chatChannels.getChannel({ path });
          logger.info(['teamchat retrieved', responseData]);
          res.status(200).send({success: 'teamchat retrieved', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.post('/createchannel', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await teamChatS2SOAuthClient.endpoints.chatChannels.createChannel({ body, path });
          logger.info(['channel created', responseData]);
          res.status(200).send({success: 'channel created', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.delete('/deletechannel', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await teamChatS2SOAuthClient.endpoints.chatChannels.deleteChannel({ path });
          logger.info(['channel deleted', responseData]);
          res.status(200).send({success: 'channel deleted'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.patch('/updatechannel', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await teamChatS2SOAuthClient.endpoints.chatChannels.updateChannel({ body, path });
          logger.info(['channel updated', responseData]);
          res.status(200).send({success: 'channel updated'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    //chat messages
    app.get('/retrievethread', async (req: express.Request, res: express.Response)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }
        if (!('path' in req.body) || !('query' in req.body)) {
            res.status(400).send({test_server_error: "Request Body must include 'path' and 'query' key"});
            return;
        }

        let request_data = req.body;
        let path = request_data.path;
        let query = request_data.query;

        try {
          let responseData: object = await teamChatS2SOAuthClient.endpoints.chatMessages.retrieveThread({ path, query });
          logger.info(['thread retreived', responseData]);
          res.status(200).send({success: 'thread retreived'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.post('/sendchatmessage', async (req: express.Request, res: express.Response)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }
        if (!('path' in req.body) || !('body' in req.body)) {
            res.status(400).send({test_server_error: "Request Body must include 'path' and 'body' key"});
            return;
        }

        let request_data = req.body;
        let path = request_data.path;
        let body = request_data.body;

        try {
          let responseData: object = await teamChatS2SOAuthClient.endpoints.chatMessages.sendChatMessage({ body, path });
          logger.info(['message sent', responseData]);
          res.status(200).send({success: 'message sent'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.patch('/updatechatmessage', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await teamChatS2SOAuthClient.endpoints.chatMessages.updateMessage({ body, path });
          logger.info(['teamchat updated', responseData]);
          res.status(200).send({success: 'teamchat updated'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.patch('/deletemessage', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await teamChatS2SOAuthClient.endpoints.chatMessages.deleteMessage({ path, query });
          logger.info(['message updated', responseData]);
          res.status(200).send({success: 'message updated'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
};

if (typeof exPort === 'number' && exPort > 1023 && exPort < 65536) {
    startServer();
    
    app.listen(exPort, () => {
        console.log(`Zoom Rivet Team Chat Server Started on port ${exPort}`);
    });
  } else {
      console.log("Please use port range 1024-65535");
}
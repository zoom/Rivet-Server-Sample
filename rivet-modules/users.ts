import { UsersOAuthClient, UsersS2SAuthClient, ConsoleLogger, HttpReceiver } from "@zoom/rivet/users";
import express from 'express';
import dotenv from 'dotenv';

const exPort: number = 5010;
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

    //Users API Auth
    const usersOAuthClient = new UsersOAuthClient({
        clientId: <string>process.env.CLIENT_ID,
        clientSecret: <string>process.env.CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.WEBHOOK_SECRET_TOKEN,
        installerOptions: installerOptions,
        port: 5011
    });
    
    const usersS2SOAuthClient = new UsersS2SAuthClient({
        clientId: <string>process.env.StS_CLIENT_ID,
        clientSecret: <string>process.env.StS_CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
        accountId: <string>process.env.ACCOUNT_ID,
        port: 5012
    });

    await usersOAuthClient.start();
    await usersS2SOAuthClient.start();

    usersS2SOAuthClient.webEventConsumer.event("user.created", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    usersS2SOAuthClient.webEventConsumer.event("user.deleted", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    usersS2SOAuthClient.webEventConsumer.event("user.updated", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    
    app.get('/', (req: any, res: any)=>{
        res.status(200).send('User Server Running!')
    });

    app.get('/getuser', async (req: any, res: any)=>{
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({test_server_error: 'Request Body cannot be empty'});
            return;
        }
        if (!('body' in req.body)) {
            res.status(400).send({test_server_error: "Request Body must include 'path' key"});
            return;
        }

        let request_data = req.body;
        let path = request_data.path;

        try {
          let responseData: any = await usersS2SOAuthClient.endpoints.users.getUser({ path });
          logger.info(['user retrieved', responseData]);
          res.status(200).send({success: 'user retrieved', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.post('/createuser', async (req: any, res: any)=>{
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
          let responseData: any = await usersS2SOAuthClient.endpoints.users.createUsers({ body });
          logger.info(['user created', responseData]);
          res.status(200).send({success: 'user created', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.delete('/deleteuser', async (req: any, res: any)=>{
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
          let responseData: any = await usersS2SOAuthClient.endpoints.users.deleteUser({ path, query });
          logger.info(['user deleted', responseData]);
          res.status(200).send({success: 'user deleted'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.patch('/updateuser', async (req: any, res: any)=>{
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
          let responseData: any = await usersS2SOAuthClient.endpoints.users.updateUser({ body, path, query });
          logger.info(['user updated', responseData]);
          res.status(200).send({success: 'user updated'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
};

startServer();

app.listen(exPort, () => {
    console.log(`Zoom Rivet Users Server Started on port ${exPort}`);
    // open('http://localhost:5011/zoom/oauth/install');
});
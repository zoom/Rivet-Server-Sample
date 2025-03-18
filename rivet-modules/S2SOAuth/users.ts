import { UsersS2SAuthClient, ConsoleLogger } from "@zoom/rivet/users";
import express from 'express';
import dotenv from 'dotenv';

const app: express.Application = express();
app.use(express.json());
dotenv.config();

const exPort: number = parseInt(process.argv[2] || <string>process.env.USERS_SERVER_PORT);


const startServer = async () => {
    // Rivet SDK Logger
    const logger = new ConsoleLogger();

    //Users API Auth
    const usersS2SOAuthClient = new UsersS2SAuthClient({
        clientId: <string>process.env.StS_CLIENT_ID,
        clientSecret: <string>process.env.StS_CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
        accountId: <string>process.env.ACCOUNT_ID,
        port: exPort + 1
    });

    await usersS2SOAuthClient.start();

    const eventHandler = (response: any)=>{
        logger.info(['Event Received', response.payload]);
    }
    //events
    usersS2SOAuthClient.webEventConsumer.event("user.created", eventHandler);
    usersS2SOAuthClient.webEventConsumer.event("user.deleted", eventHandler);
    usersS2SOAuthClient.webEventConsumer.event("user.updated", eventHandler);
    
    //endpoints
    app.get('/', (req: express.Request, res: express.Response)=>{
        res.status(200).send('Users API Server Running!')
    });

    app.get('/getuser', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await usersS2SOAuthClient.endpoints.users.getUser({ path, query });
          logger.info(['user retrieved', responseData]);
          res.status(200).send({success: 'user retrieved', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.post('/createuser', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await usersS2SOAuthClient.endpoints.users.createUsers({ body });
          console.log("HELLLLLOOOOOOO",typeof responseData);
          logger.info(['user created', responseData]);
          res.status(200).send({success: 'user created', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.delete('/deleteuser', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await usersS2SOAuthClient.endpoints.users.deleteUser({ path, query });
          logger.info(['user deleted', responseData]);
          res.status(200).send({success: 'user deleted'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.patch('/updateuser', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await usersS2SOAuthClient.endpoints.users.updateUser({ body, path, query });
          logger.info(['user updated', responseData]);
          res.status(200).send({success: 'user updated'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
};

if (typeof exPort === 'number' && exPort > 1023 && exPort < 65536) {
  startServer();
  
  app.listen(exPort, () => {
      console.log(`Zoom Rivet Users Server Started on port ${exPort}`);
  });
} else {
    console.log("Please use port range 1024-65535");
}
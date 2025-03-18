import { AccountsOAuthClient, ConsoleLogger } from "@zoom/rivet/accounts";
import express from 'express';
import dotenv from 'dotenv';

const app: express.Application = express();
app.use(express.json());
dotenv.config();

const exPort: number = parseInt(process.argv[2] || <string>process.env.ACCOUNTS_SERVER_PORT);

const startServer = async () => {

    let installerOptions = {
        redirectUri: <string>process.env.REDIRECT_URI,
        stateStore: <string>process.env.STATE_STORE
    };

    // Rivet SDK Logger
    const logger = new ConsoleLogger();

    //accounts API Auth
    const accountsOAuthClient = new AccountsOAuthClient({
        clientId: <string>process.env.CLIENT_ID,
        clientSecret: <string>process.env.CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.WEBHOOK_SECRET_TOKEN,
        installerOptions: installerOptions,
        port: exPort + 1
    });
    
    await accountsOAuthClient.start();

    const eventHandler = (response: any)=>{
        logger.info(['Event Received', response.payload]);
    }
    //events
    accountsOAuthClient.webEventConsumer.event("account.settings_updated", eventHandler);
    
    //endpoints
    app.get('/', (req: express.Request, res: express.Response)=>{
        res.status(200).send('Accounts API Server Running!')
    });

    app.get('/getaccountsettings', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await accountsOAuthClient.endpoints.accounts.getAccountSettings({ path, query });
          logger.info(['account retrieved', responseData]);
          res.status(200).send({success: 'account retrieved', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.patch('/updateaccountsettings', async (req: express.Request, res: express.Response)=>{
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
          let responseData: object = await accountsOAuthClient.endpoints.accounts.updateAccountSettings({ body, path, query });
          logger.info(['account updated', responseData]);
          res.status(200).send({success: 'account updated'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
};

if (typeof exPort === 'number' && exPort > 1023 && exPort < 65536) {
    startServer();
    
    app.listen(exPort, () => {
        console.log(`Zoom Rivet Accounts UserOAuth Server Started on port ${exPort}`);
    });
  } else {
      console.log("Please use port range 1024-65535");
}
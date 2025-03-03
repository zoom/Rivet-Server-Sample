import { AccountsOAuthClient, AccountsS2SAuthClient, ConsoleLogger } from "@zoom/rivet/accounts";
import express from 'express';
import dotenv from 'dotenv';

const exPort: number = parseInt(<string>process.env.ACCOUNTS_SERVER_PORT);
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

    //accounts API Auth
    const accountsOAuthClient = new AccountsOAuthClient({
        clientId: <string>process.env.CLIENT_ID,
        clientSecret: <string>process.env.CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.WEBHOOK_SECRET_TOKEN,
        installerOptions: installerOptions,
        port: exPort + 1
    });
    
    const accountsS2SOAuthClient = new AccountsS2SAuthClient({
        clientId: <string>process.env.StS_CLIENT_ID,
        clientSecret: <string>process.env.StS_CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
        accountId: <string>process.env.ACCOUNT_ID,
        port: exPort + 2
    });

    await accountsOAuthClient.start();
    await accountsS2SOAuthClient.start();

    /**
     * For the following events and endpoints, you can switch out accountsS2SOAuthClient for accountsOAuthClient 
     * if user OAuth is the authentication of choice.
     */

    //events
    accountsS2SOAuthClient.webEventConsumer.event("account.settings_updated", (response: any)=>{
        logger.info(['Event Received', response.payload]);
    });
    
    //endpoints
    app.get('/', (req: any, res: any)=>{
        res.status(200).send('Accounts API Server Running!')
    });

    app.get('/getaccountsettings', async (req: any, res: any)=>{
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
          let responseData: any = await accountsS2SOAuthClient.endpoints.accounts.getAccountSettings({ path, query });
          logger.info(['account retrieved', responseData]);
          res.status(200).send({success: 'account retrieved', response: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.patch('/updateaccountsettings', async (req: any, res: any)=>{
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
          let responseData: any = await accountsS2SOAuthClient.endpoints.accounts.updateAccountSettings({ body, path, query });
          logger.info(['account updated', responseData]);
          res.status(200).send({success: 'account updated'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
};

startServer();

app.listen(exPort, () => {
    console.log(`Zoom Rivet accounts Server Started on port ${exPort}`);
    // open('http://localhost:5021/zoom/oauth/install');
});
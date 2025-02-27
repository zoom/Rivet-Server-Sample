import { AccountsOAuthClient, AccountsS2SAuthClient } from "@zoom/rivet/accounts";
import dotenv from 'dotenv';

dotenv.config();

(async () => {

    let UsersCreateUsersRequestBody = {
        action: 'create',
        user_info: {
            email: "test@tico-test.com",
            type: 2,
        }
    };

    let installerOptions = {
        redirectUri: <string>process.env.REDIRECT_URI,
        redirectUriPath: <string>process.env.REDIRECT_URI_PATH,
        stateStore: <string>process.env.STATE_STORE
    };

    //Accounts API Auth
    const accountsOAuthClient = new AccountsOAuthClient({
        clientId: <string>process.env.CLIENT_ID,
        clientSecret: <string>process.env.CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.WEBHOOK_SECRET_TOKEN,
        installerOptions: installerOptions,
        port: 5012
    });
    

    const accountsS2SOAuthClient = new AccountsS2SAuthClient({
        clientId: <string>process.env.StS_CLIENT_ID,
        clientSecret: <string>process.env.StS_CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
        accountId: <string>process.env.ACCOUNT_ID,
        port: 5013
    });

    const accountsOAuthClient_server = await accountsOAuthClient.start();
    const accountsS2SOAuthClient_server = await accountsS2SOAuthClient.start();

    console.log(`Zoom Rivet Accounts Server Started`);
    
    // UsersEndpoints.users.createUsers(UsersCreateUsersRequestBody).then((response) => {
    //     console.log('user', response.data);
    //     });
})();
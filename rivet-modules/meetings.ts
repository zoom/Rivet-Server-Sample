import { MeetingsOAuthClient, MeetingsS2SAuthClient} from "@zoom/rivet/meetings";
import dotenv from 'dotenv';

dotenv.config();

(async () => {

    let installerOptions = {
        redirectUri: <string>process.env.REDIRECT_URI,
        redirectUriPath: <string>process.env.REDIRECT_URI_PATH,
        stateStore: <string>process.env.STATE_STORE
    };

    //Meetings API Auth
    const meetingsOAuthClient = new MeetingsOAuthClient({
        clientId: <string>process.env.CLIENT_ID,
        clientSecret: <string>process.env.CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.WEBHOOK_SECRET_TOKEN,
        installerOptions: installerOptions,
        port: 5014
    });

    const meetingsS2SOAuthClient = new MeetingsS2SAuthClient({
        clientId: <string>process.env.StS_CLIENT_ID,
        clientSecret: <string>process.env.StS_CLIENT_SECRET,
        webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
        accountId: <string>process.env.ACCOUNT_ID,
        port: 5015
    });

    const meetingsOAuthClient_server = await meetingsOAuthClient.start();
    const meetingsS2SOAuthClient_server = await meetingsS2SOAuthClient.start();

    console.log(`Zoom Rivet Meetings Server Started`);
    
    // UsersEndpoints.users.createUsers(UsersCreateUsersRequestBody).then((response) => {
    //     console.log('user', response.data);
    //     });
})();
This is a Sample App that showcases the power of the Zoom Rivet SDK by offering a one-click, quick start Express backend server. This server includes each Rivet module except the chatbot module ([Sample App for Rivet Chatbot here](https://github.com/zoom/rivet-javascript-sample))

The [Zoom Rivet SDK](https://developers.zoom.us/docs/rivet/javascript/) is a framework that accelerates server-side app development for Zoom's developer products. 
Compatible with JavaScript and TypeScript, this comprehensive tool enables developers to create integrations more quickly and spend more time on core business logic.

Use of this Sample App is subject to our [Terms of Use](https://www.zoom.com/en/trust/terms/).

## Installation

Clone this repo into your local enviroment:
```
$ git clone https://github.com/zoom/Rivet-Server-Sample.git
```

Once cloned, cd into the directory and install the npm packages: 
```
$ npm install
```

## Configuration
You will need to build a [Server-to-Server](https://developers.zoom.us/docs/internal-apps/create/) OAuth app and/or a [User Authorization OAuth app](https://developers.zoom.us/docs/integrations/create/) on the Zoom Marketplace. From there, you will receive the following credentials:
- Server-to-Server (S2SOAuth) Client ID and Client Secret, S2S Webhook Secret Token, and your Account ID
- User Authorization OAuth (UserOAuth) Client ID and Client and a Webhook Secret Token

If you want to use Video SDK APIs, you will need an active [Zoom Video SDK account](https://developers.zoom.us/docs/video-sdk/get-credentials/) which will provide you with a Video SDK Key and Secret and a Webhook Secret Token.

Insert these credentials into the respective fields in the `.env-sample` file and rename the file to `.env`.

> :warning: **Do not store credentials in plain text on production environments**

Next, specify a secure state store value for Rivet to use in the OAuth flow.

Finally, specify a default port for each Rivet module to use in case no port is given in the run command. The sample app uses 2 ports, given_port and given_port+1, when it is running.

You are now ready to use the Rivet Sample App!

## Usage

In the project, there is a bash script `run.sh` that is used to run the modules. The commands and options are as follows
```bash
./run.sh [options]
 -o, --oauth  (required) [UserOAuth, S2SOAuth]
 
 -m, --module (required) [users, meetings, accounts, teamchat(S2SOAuth only), phone, videosdk_api(S2SOAuth only)]
 
 -p, --port              [1024-65535]
 
 -c, --color             [black, red, green, yellow, blue,
                          magenta, cyan, white, gray,
                          any hex values for colors (e.g. #23de43) or auto for
                          an automatically picked color]
```

If you are thrown a permissions error when running the bash script. You can use `chmod` to adjust like so:
```
$ chmod 700 run.sh
```

Once the server is running, it will listen on the specified port and you can now make REST API to the corresponding module endpoints. 
For some endpoints, you will need to provide request body, params, query according to the [Rivet SDK Reference Docs](https://zoom.github.io/rivet-javascript/modules.html). For the request body, you can reference the [Zoom API Endpoint](https://developers.zoom.us/docs/api/) that Rivet calls to. 

For example, assuming you run the S2SOAuth meetings module like so: `./run.sh -o S2SOAuth -m meetings -p 8888 -c blue`

here is an API call to the Rivet Sample app that makes an update to a meeting. 

```
curl --location --request PATCH 'http://localhost:8888/updatemeeting' \
--header 'Content-Type: application/json' \
--data '{                        <---- reference Rivet SDK docs for path, query, and body requirements
    "path": {
        "meetingId": "0000000000"
    },
    "query": {
        "occurrence_id": "111111111"
    },
    "body": {                    <--- reference Zoom REST API docs for correct Request Body
        "agenda": "My Meeting", 
        "duration": 60,
        "password": "newPassword",
        "start_time": "2025-03-27T07:29:29Z",
        "template_id": "5Cj3ceXoStO6TGOVvIOVPA==",
        "timezone": "America/Los_Angeles",
        "topic": "My Meeting",
        "type": 2
    }
}'
```

## Webhooks
The Server also listens for Zoom Events. You can subscribe to events on the Zoom Marketplace by going to the Server-to-Server you created, click the feature tab, select Event Subscriptions and select the events you want to subscribe to. In development, you will need to use ngrok or a similar service to open up your localhost for online communication with Zoom Web. For Rivet, you must append `/zoom/events` to the Endpoint URL like so:

<img width="755" alt="Image" src="https://github.com/user-attachments/assets/37d4ff2a-5c39-41da-a7a4-36eb0086f93c" />



**Please note the Endpoint URL will need to point to the port being used by the module NOT the Express server port provided in the .env file. For example, if the Users Express server port is 5010 in the .env file, the Users Module Endpoint URL will point to 5011 for Users events.

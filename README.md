The [Zoom Rivet SDK](https://developers.zoom.us/docs/rivet/javascript/) is a framework that accelerates server-side app development for Zoom's developer products. 
Compatible with JavaScript and TypeScript, this comprehensive tool enables developers to create integrations more quickly and spend more time on core business logic.

This Sample App showcases the power of Rivet by offering a one-click, quick start backend server. This server includes each Rivet module except the chatbot module ([Sample App for Rivet Chatbot here](https://github.com/zoom/rivet-javascript-sample))

Use of Zoom Rivet SDK is subject to our [Terms of Use](https://www.zoom.com/en/trust/terms/).

## Installation

Clone this repo into your local enviroment:
```
$ git clone https://github.com/Ticorrian-Heard/zoom-rivet-server.git
```

Once cloned, cd into the directory and install the npm packages: 
```
$ npm install
```

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

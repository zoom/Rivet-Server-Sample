#!/bin/bash
auth=
module=
port=
color="auto"

function help {
 echo "./run.sh [options]
 -o, --oauth  (required) [UserOAuth, S2SOAuth]
 
 -m, --module (required) [users, meetings, accounts, teamchat(S2SOAuth only), phone, videosdk_api(S2SOAuth only)]]
 
 -p, --port              [1024-65535]
 
 -c, --color             [black, red, green, yellow, blue,
                          magenta, cyan, white, gray,
                          any hex values for colors (e.g. #23de43) or auto for
                          an automatically picked color]" >&2
}

while (( $# > 0 )) ; do
  case $1 in
    -o|--oauth) [[ "$2" == "UserOAuth" || "$2" == "S2SOAuth" ]] && auth="$2" || (help && exit 1) ;;

    -m|--module) [[ "$2" == "users" || "$2" == "meetings" || "$2" == "accounts" || "$2" == "phone" || "$2" == "teamchat" || "$2" == "videosdk_api" ]] && 
                 module="$2" || 
                 (help && exit 1) ;;
    
    -p|--port)  [[ "$2" =~ ^[0-9]+$ ]] && port="$2" ;;

    -c|--color) [[ ! -z "$2" && ("$2" != "-" && "$2" != "--") ]] && color="$2" ;;

    --) shift; break ;;
    -*) printf >&2 'Unknown option %s\n' "$1" ; exit 1 ;;
  esac
  shift
done

# echo $auth $module $port $color

concurrently -p "[{name}]" \
             -n "$auth $module" \
             -c "$color" \
             "npx tsx rivet-modules/$auth/$module.ts $port"
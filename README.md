# Contacts App

  ## Prerequisites

    node version >= v24.8.0
    npm version >= 11.6.0
    Docker version 28.4.0, build d8eb465
    Docker Compose version v2.39.4-desktop.1 you MUST have the docker compose command available


  ## LocalStack Setup

  ## 1. setup Contact project tools

  in your .bashrc or .zshrc

  set these

    export CONTACTS_HOME="<location of the projects root directory on your machine>"
    source $CONTACTS_HOME/tools/contacts-tools-sourceme.sh

make sure to reload your terminal after change the rc file to have .sh file sourced. 

I use zsh as my shell so there may be some issues running on bash as I have not tested. 

## 2. build the docker stack and run migrations using the command

```bash
contacts build stack --migrate
``` 

## 3. Up the stack

you can up and down the stack or individual services using the commands 

```bash
contacts stack up
```
and 
```bash
contacts stack down
```

the api is listening on port 3000 and can be accessed at http://localhost:3000/

the React web-app is listening on port 4173 and can be accessed at http://localhost:4173/


a postman collection outlining the routes can be found at 
https://galactic-meteor-343859.postman.co/workspace/ContactsApp~8cb00807-89fe-443c-9529-9555067926fb/collection/29573490-97845f10-cbf2-440d-bec0-e48f31d38fbc?action=share&creator=29573490



  
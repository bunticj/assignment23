# Rock, paper, scissors



### Project structure

backend : API service and MariaDB database

init: Database and tables initialization file

socket_server: Game logic and multiplayer system

docker-compose: Orchestrator for all services

### Project run
```
docker-compose up -d
```

### Socket_server 

To play the game, use Postman SocketIO Request or any other socket client.Events should be in JSON format.
Subscribe to the event "message".Messages will contain message data and message types.
- src/game/enums/MessageType
- src/game/models/*


Connect:
```
 ws://localhost:3001?authorization=yourTokenGeneratedOnLogin
```

Join room event will create a new room, or join to existing as a reconnect or player2.
Game id is obtained from the API server after creating a game
```
{ gameId: string; }

```

Send pick event will create a new room, or join to existing game.
Pick type is actually enum representing rock,paper or scissors
-  src/game/enums/PickType
```
{ gameId: number; }

```

Some of the important directories and files in this service:
#### Socket layer:
- src/socket/SocketServer  => handles incoming socket connections
- src/socket/SocketController => handles listeners and socket events after authentication
- src/socket/SocketPlayerManager => handles socket(player) states 

#### Game layer:
- src/game/services/GameService  => acts like a mediator between the user and game, communicates with socket controller and game instance
- src/game/services/MessageService => sends match messages to player
- src/game/services/SchedulerService => basically a setTimeOut service, but this way is easy to maintain 
- src/game/GameInstance => Holds the match data, communicates with GameService and starts some game systems 
- src/game/GameSystem => Handles start/end of round, calculate scores, basically the game logic itself

#### Other:
- There are more files and directories inside this part of project,but they are mostly self explanatory




### Backend 
Routes
Headers for all routes: 
```
req.headers: 
Content-Type : application/json
Authorization: tokenValue
*unprotected routes are : baseURL/register,  baseURL/login
```

#### User related routes

```
Register user :
POST  baseURL/register 
req.body :{
    full_name : String,
    email : String,
    password : String,
    
} 
res.body : {
    token : String
}
```
```
Login user :
POST  baseURL/login 
req.body :{
    email : String,
    password : String
} 
res.body : {
    token : String
}
```
```
Check auth token :
GET baseURL/me
res.body : {
    user_id: String,
    email : String
}

```
#### Game related routes
 "game_state" property is actually enum:
- socket_server/src/game/enums/GameStateType

```
Get single game :
GET  baseURL/game/:game_id 

res.body : {
    game_id:Number;
    game_state : Number,
    player1: Number;
    player2?: Number;
    started_at?: Number;
    finished_at?: Number
    winner?: Number;  
}
```


```
Create new game :
POST  baseURL/game 
req.body :{
    player1 : Number,
    game_state : Number,
    
} 
res.body : {
    game_id : String
}
```

```
Update game (sent by socket_server on game updates) :
PATCH  baseURL/game 
req.body :{
    game_id:Number;
    game_state : Number,
    player1: Number;
    player2?: Number;
    started_at?: Number;
    finished_at?: Number
    winner?: number;   
} 
res.body : {
    message : String
}
```

Some of the important directories and files in this service:
#### Controllers:
- application/controllers/User  => handles user api logic
- application/controllers/Game  => handles game api logic

#### Models:
- application/models/User  => handles user database logic
- application/models/Game  => handles game database logic

#### Libraries:
- application/libraries/Jwt_lib  => handles jwt token authentication
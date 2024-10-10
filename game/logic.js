const { forIn } = require("lodash");
const { username } = require("../models/userDefaults");
const { login } = require("../controllers/authControllers");

let sio

// Create a sockets list to hold all sockets
// key => socket.id 
// value => socket object of socket with the key as it id
let SOCKET_LIST = {};

let allHosts = []
let allAvailableHosts = []
let allJoiners = []
let activePlayers = []
let inacivePlayers = []

let allPlayers = []

let ROOM_FULL = false

class Player {
    constructor(id, socket, info) {
        this.id = socket.id
        this.userId = id
        this.info = info
        this.gameNavigationPos = ""
        this.game = {
            type: null, difficulty: null,
            connected: false, ready: false,
            host: false, join: false, roomId: null, 
            roomFull: false,
            opponent: {
                id: "", info: {
                    username: "",
                    image: ""
                }
            },
            wins : 0, losses : 0,
            won : false, lose : false,
            guesses : [],
            moves : null, time : null,
            powerUps : {
                timeFreezer : {active: false, duration: 5},
                timeBooster : {active: false, duration: 5},
                moveBooster : {active: false, duration: 5},
                detectiveMode : {active: false, duration: 5},
                wizardMode : {active: false, duration: 5}
            }
        }

        Player.list[(this.id).toString()] = this;
        
        return this
    }   
   







    deletePlayer () {
        allPlayers = allPlayers.filter(plyer => plyer.id !== this.id)
    }

    resetPowerUps () {
        this.game.powerUps = {
            timeFreezer : {active: false, duration: 5},
            timeBooster : {active: false, duration: 5},
            moveBooster : {active: false, duration: 5},
            detectiveMode : {active: false, duration: 5},
            wizardMode : {active: false, duration: 5}
        }
    }

    resetAll () {
        this.game = {
            type: null, difficulty: null,
            connected: false, ready: false,
            host: false, join: false,
            roomId: "", opponent: "",
            wins : 0, losses : 0,
            won : false, lose : false,
            guesses : [],
            moves : null, time : null,
            powerUps : {
                timeFreezer : {active: false, duration: 5},
                timeBooster : {active: false, duration: 5},
                moveBooster : {active: false, duration: 5},
                detectiveMode : {active: false, duration: 5},
                wizardMode : {active: false, duration: 5}
            }
        }
    }
}
Player.list = {};

Player.onConnect = function (id, pSocket, info) {
    let playerExist = false
    for (const key in Player.list) {
        if (Object.prototype.hasOwnProperty.call(Player.list, key)) {
            const plyr = Player.list[key];
            if (plyr.userId === id){
                Player.onDisconnect(plyr.id)
                delete SOCKET_LIST[plyr.id];
            } 
        }
    }
    if (Object.prototype.hasOwnProperty.call(Player.list, pSocket.id)) {
        Player.onDisconnect(pSocket.id)
        delete SOCKET_LIST[pSocket.id];
    }
    // if (playerExist) {
    //     // pSocket.emit("playerCreationError", {error : "Player Exist Already !!"})  
    //     pSocket.emit("playerAlreadyCreated", {playerInfo : player.info})       
    // }
    // else{

    // Add Socket To SOCKET_LIST 
    SOCKET_LIST[pSocket.id] = pSocket;

    // Create a new instance of a player
    const player = new Player(id, pSocket, info);
    pSocket.emit("playerCreated", {playerInfo : "PLAYER CREATED"})        
    

    return player
    // }

    // pSocket.on('keyPress', function (data) {

    // });
}

Player.onDisconnect = function (socketId) {
    console.log("About to delete : ", socketId);
    
    delete Player.list[socketId];
}

Player.update = function () {
    let pack = [];
    // for (let i in Player.list) {
    //     let player = Player.list[i];
    //     player.update();
    //     pack.push({x: player.x, y:player.y, number:player.number})
    // }
    // return pack;
}

// setInterval(() => {
//     console.log("==========================");
//     console.log("Player : ", player ? player.id: null);
//     console.log("Opponent : ", player ? player.game.opponent.id : null);
//     console.log("==========================");
// }, 60000);


const initializeGame = (io, client) => {
    sio = io
    let playerSocket = client
    let player = null

    // Create a new Player class for user
    const createNewPlayer = ({id, info}) => {
        console.log("creating a new player");

        // Create a Player for the new Socket
        player = Player.onConnect(id, playerSocket, info);
    }

    // Verifies and adds a player to a room
    const addToRoom = async (hostOrJoin, roomId, gameProperties) => {

        let connectedSockets = io.sockets.adapter.rooms.get(roomId)
        let socketRooms = Array.from(playerSocket.rooms.values()).filter((room) => room !== playerSocket.id)
        
        if (hostOrJoin === "host"){
            if (connectedSockets && connectedSockets.size > 0) {
                console.log("RoomId as been used, Please choose another room Id to host");
                playerSocket.emit("roomHostError", {
                    error: "RoomId as been used, Please choose another room Id to host"
                })
                return null
            }
        }

        // if (socketRooms.length > 0 || connectedSockets && connectedSockets.size === 2){
        if (connectedSockets && connectedSockets.size === 2){
            console.log("Room Join Error !!");
            
            playerSocket.emit("roomJoinError", {
                error: hostOrJoin === 
                    "host" ? "RoomId as been used, Please choose another room Id to host"
                    : "Room is full, Please choose another room to play"
                })
        }else {
            // Add the player to the chosen room
            playerSocket.join(roomId)
            player.game.connected = true
            player.game.roomId = roomId 
            player.game.difficulty = gameProperties.difficulty

            if (hostOrJoin === "host") {
                allHosts.push({hostId: playerSocket.id, 
                    roomId, 
                    diff: player.game.difficulty,
                    image: player.info.image})
                
                player.game.host = true
                player.game.join = false
                console.log(`${player.info.username} (${player.id}) Created Room: `, roomId);
            
                io.emit("roomCreated", {roomId})

            } else if (hostOrJoin === "join"){
                allJoiners.push({JoinerId: playerSocket.id, roomId})
                player.game.host = false
                player.game.join = true
                console.log(`${player.info.username} (${player.id}) Joined Room: `, roomId);
                
                player.game.roomFull = true
                io.emit("roomJoined", {roomId})
            }
        }
    }

    // hostGame - Host a room
    async function hostGame({roomId, gameProperties}) {
        await addToRoom("host", roomId, gameProperties)
    }

    // joinGame - Join a room
    async function joinGame({roomId, gameProperties}) {
        await addToRoom("join", roomId, gameProperties)
    }

    // Set the player's opponent
    const setOpponent = async () => {
        let opponentSocketId = ""
        console.log("my id: ", player.id);
        
        let playersInMyRoomSocketId = checkIfRoomIsFull()
        console.log("rmfull : ", player.game.roomFull);
        
        if (player.game.roomFull) {
            player.game.roomFull = true

            // Check if the opponent exists in the room
            playersInMyRoomSocketId.forEach( psid => {
                if (psid !== player.id){
                    opponentSocketId = psid.toString()
                    if (!Player.list[opponentSocketId]){
                        console.log("Not A Player");
                        return false
                    }else{
                        console.log("Valid Player");
                        console.log("opponentSocketId : ", opponentSocketId);
                        // Set the opponent id
                        player.game.opponent.id = psid.toString()
                        return true
                    }
                }
            })
        }
        else{
            player.game.roomFull = false
            console.log("No Opponent Yet!!");
            console.log(" Waiting For Player To Join...");
            return false
        }
    }

    // Get players opponent and send to client
    const getOpponent = async () => {
        if (player.game.roomFull){
            const validOpponent = setOpponent()
            if (validOpponent) {
                console.log("oppo id : ", player.game.opponent.id);
                let opponent = Player.list[player.game.opponent.id]
                console.log("opponent : ", opponent)
                playerSocket.emit("sendingOpponentInfo", {opponentInfo: opponent.info}) 
            }else{
                playerSocket.emit("sendingOpponentInfoError", {error: "No Opponent Yet!!"})    
            }
        }
    }

    // Check if the players room is full
    const checkIfRoomIsFull = () => {
        let playersInMyRoomSocketId = io.sockets.adapter.rooms.get(player.game.roomId)
        if (playersInMyRoomSocketId && playersInMyRoomSocketId.size === 2){
            player.game.roomFull = true
            return playersInMyRoomSocketId
        }else {
            player.game.roomFull = false
            return false
        }
    }

    // Send The Room State To The Client
    const isRoomFull = () => {
        checkIfRoomIsFull()
        console.log(`${player.info.username} - RoomFull : `, player.game.roomFull);
        playerSocket.emit("checkedIsRoomFull", {roomFull: player.game.roomFull})
    }

    // Check if player is in room already
    async function isPlayerInRoom() {
        if (player.game.roomId){
            playerSocket.emit("checkedInRoom", {
                inRoom: true, roomId: player.game.roomId,
                join: player.game.join, host: player.game.join})
        }
        else {
            playerSocket.emit("checkedInRoom", {inRoom: false})
        }
    }
    
    // Get Players Game Room
    const getSocketGameRoom = (socket) => {
        const socketRooms = Array.from(socket.rooms.values()).filter((room) => room !== socket.id)
        const gameRoom = socketRooms && socketRooms[0]
        return gameRoom
    }

    // Check For Avalible Hosts (i.e hosts without opponents yet)
    // Add To (allAvailableHosts) and return (allAvailableHosts)
    const updateAvailableHost = () => {
        allHosts.forEach( host => {
            let connectedHostRoomSockets = io.sockets.adapter.rooms.get(host.roomId)
            if (connectedHostRoomSockets && connectedHostRoomSockets.size !== 2){

                if (!allAvailableHosts.includes(host)) {
                    allAvailableHosts.push(host)
                }
            }
        })
        return allAvailableHosts
    }

    // Get and Send The Avaliable Hosts To Client 
    const sendHosts = async () => {
        allAvailableHosts = updateAvailableHost()
        console.log(allAvailableHosts);
        io.emit("sendingHosts", {allAvailableHosts})
    }

    // Get and Send The Game Properties The Hosts Sends To The Room
    const saveGameProperties = async ({properties}) => {
        console.log("gameProperties", properties);

        // Host Saves The Game Properties
        console.log("Host Saving Game Props ...");
        player.game.difficulty = properties.difficulty

        // console.log("Sending Game Props To Room Members ...")
        // io.to(player.game.roomId).emit("hostSendingGameProperties", {gameProperties: properties})
    }

    // playerSocket.on("hostSendingGameProperties", ({gameProperties}) => {

    // })

    const requestGamePropertiesFromHost = async () => {
        let opponent = Player.list[player.game.opponent.id]

        console.log("Opponent Difficulty : ", opponent.game.difficulty);
        
        console.log("Joiner Saving Game Props ...");
        player.game.difficulty = opponent.game.difficulty

        console.log("Sending Game Props To Joiner Socket Client ...");   
        playerSocket.emit("sendingGameProperties", {gameProperties: opponent.game.difficulty})
    }

    function createNewGame() {
        console.log("creating a new game");
        const gameRoom = getSocketGameRoom(playerSocket)
        // playerSocket.emit("createNewGame", {gameId: gameRoom, playerId: playerSocket.id})

        playerSocket.to(gameRoom).emit("on_game_update", {
            gameId: gameRoom, 
            playerId: playerSocket.id
        });
    }

    function updateGame() {
        console.log("updating game");
        const gameRoom = getSocketGameRoom(playerSocket)

        playerSocket.to(gameRoom).emit("onGameUpdate", {
            gameId: gameRoom, 
            playerId: playerSocket.id
        });
    }

    function requestUsername() {
        const gameId = move
    }

    function recievedUsername() {
        const gameId = move
    }
    function newMove() {
        // const gameId = move.gameId
        // io.to(gameId).emit("opponent move", move);s
    }

    // create a new player
    playerSocket.on("createNewPlayer", createNewPlayer)

    // host/join a game
    // create a new room per game
    // each room can only max 2 clients
    playerSocket.on("isPlayerInRoom", isPlayerInRoom)

    playerSocket.on("hostGame", hostGame)
    playerSocket.on("getHosts", sendHosts)
    playerSocket.on("joinGame", joinGame)

    playerSocket.on("isRoomFull", isRoomFull)
    playerSocket.on("getOpponent", getOpponent)

    // Host Saves The New Game Properties
    playerSocket.on("saveGameProperties", saveGameProperties)
    
    // Joiner Request For The New Game Properties
    playerSocket.on("requestGamePropertiesFromHost", requestGamePropertiesFromHost)
    
    // create a game
    playerSocket.on("createNewGame", createNewGame)
    playerSocket.on("requestUsername", requestUsername)
    playerSocket.on("recievedUsername", recievedUsername)
    playerSocket.on("new move", newMove)

    // Remove sockets and player from 
    // socket and player list respectively
    playerSocket.on('disconnect', function(){
        delete SOCKET_LIST[playerSocket.id];
        // Player.onDisconnect(playerSocket.id);
    })
}

// Set A Global Loop To Catch And Update Changes
// setInterval(() => {
//     let pack = {
//         player : Player.update(),
//         bullet : Bullet.update()
//     }
//     for (let i in SOCKET_LIST){
//         let socket = SOCKET_LIST[i];
//         socket.emit('newPosition', pack) 
//     }
// }, 1000/100 );

exports.initializeGame = initializeGame
const { forIn } = require("lodash");
const { username } = require("../models/userDefaults");
const { login } = require("../controllers/authControllers");

let sio

// Create a sockets list to hold all sockets
// key => socket.id 
// value => socket object of socket with the key as it id
let SOCKET_LIST = {};

let playerSocket
let player = null

let allHosts = []
let allAvailableHosts = []
let allJoiners = []
let activePlayers = []
let inacivePlayers = []

let allPlayers = []

class Player {
    constructor(id, socket, info) {
        this.id = socket.id
        this.userId = id
        this.info = info
        this.game = {
            type: null, difficulty: null,
            connected: false, ready: false,
            host: false, join: false, roomId: "", 
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

        Player.list[this.id] = this;
        
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
    if (Object.prototype.hasOwnProperty.call(Player.list, id)) {
        pSocket.emit("playerCreationError", {error : "Player Exist Already !!"})        
    }else{
        player = new Player(id, pSocket, info);
        pSocket.emit("playerCreated", {playerInfo : player.info})        
    }

    // pSocket.on('keyPress', function (data) {

    // });
}

Player.onDisconnect = function (socket) {
    delete Player.list[socket];
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


const initializeGame = (io, client) => {
    sio = io
    playerSocket = client

    // Add Socket To SOCKET_LIST 
    SOCKET_LIST[playerSocket.id] = playerSocket;

    const createNewPlayer = ({id, info}) => {
        console.log("creating a new player");

        // Create a PLyer for the new Socket
        Player.onConnect(id, playerSocket, info);
    }

    const addToRoom = async (roomId, hostOrJoin) => {

        let connectedSockets = io.sockets.adapter.rooms.get(roomId)
        let socketRooms = Array.from(playerSocket.rooms.values()).filter((room) => room !== playerSocket.id)
        
        if (socketRooms.length > 0 || connectedSockets && connectedSockets.size === 2){
            playerSocket.emit("roomJoinError", {
                error: hostOrJoin === 
                    "host" ? "RoomId as been used, Please choose another room Id to host"
                    : "Room is full, Please choose another room to play"
                })
        }else {
            await playerSocket.join(roomId)   
            player.game.connected = true
            player.game.roomId = roomId 

            if (hostOrJoin === "host") {
                allHosts.push({hostId: playerSocket.id, 
                    roomId, image: player.info.image})
                
                player.game.host = true
                player.game.join = false
                console.log("User Created Room: ", roomId);
                playerSocket.emit("roomCreated", {roomId})

                console.log(allAvailableHosts);
                
            } else if (hostOrJoin === "join"){
                allJoiners.push({JoinerId: playerSocket.id, roomId})
                player.game.host = false
                player.game.join = true
                console.log(`${player.id} Joining Room: `, roomId);
                playerSocket.emit("roomJoined", {roomId})
            }
        }
    }

    async function hostGame({roomId}) {
        await addToRoom(roomId, "host")
    }
    async function joinGame({roomId}) {
        await addToRoom(roomId, "join")
    }
    
    const getSocketGameRoom = (socket) => {
        const socketRooms = Array.from(socket.rooms.values()).filter((room) => room !== socket.id)
        const gameRoom = socketRooms && socketRooms[0]
        return gameRoom
    }

    const setOpponent = async () => {
        let opponentSocketId = ""
        let playersInMyRoomSocketId = io.sockets.adapter.rooms.get(player.game.roomId)
        playersInMyRoomSocketId.forEach( psid => {
            console.log("room psids : ", psid);
            let pp = psid.toString()
            console.log(pp);
            
            if (psid !== player.id){
                opponentSocketId = psid.toString()
                player.game.opponent.id = psid.toString()
                console.log("opponent: ", Player.list[opponentSocketId]);
            }
        })
        return Player.list[opponentSocketId]
    }

    const getOpponent = async () => {
        if (isRoomFull()){
            let opponent = setOpponent()
            console.log(opponent)
            playerSocket.emit("sendingOpponentInfo", {opponentInfo: opponent.info})
        }
    }

    const isRoomFull = () => {
        let playersInMyRoomSocketId = io.sockets.adapter.rooms.get(player.game.roomId)
        if (playersInMyRoomSocketId && playersInMyRoomSocketId.size === 2){
            return true
        }else {return false}
    }


    const sendHosts = () => {
        updateAvailableHost()
        playerSocket.emit("sendingHosts", {allAvailableHosts})
    }

    const updateAvailableHost = () => {
        allHosts.forEach(host => {
            let connectedHostRoomSockets = io.sockets.adapter.rooms.get(host.roomId)
            if (connectedHostRoomSockets && connectedHostRoomSockets.size !== 2){

                if (!allAvailableHosts.includes(host)) {
                    allAvailableHosts.push(host)
                }
            }
        })
        console.log(allAvailableHosts);
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
    playerSocket.on("hostGame", hostGame)
    playerSocket.on("getHosts", sendHosts)
    playerSocket.on("joinGame", joinGame)

    playerSocket.on("getOpponent", getOpponent)

    // create a game
    playerSocket.on("createNewGame", createNewGame)
    playerSocket.on("requestUsername", requestUsername)
    playerSocket.on("recievedUsername", recievedUsername)
    playerSocket.on("new move", newMove)

    // Remove sockets and player from 
    // socket and player list respectively
    playerSocket.on('disconnect', function(){
        delete SOCKET_LIST[playerSocket.id];
        Player.onDisconnect(playerSocket.id);
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
const { OnDisconnect } = require("socket-controllers")
const { mySocketId } = require("../../frontend/src/connections/sockets")

let sio
let gameSocket

const initializeGame = (io, client) => {
    sio = io
    gameSocket = client

    // create a game
    // join a game
    // new move
    // create a new room per game
    // each room can only max 2 clients

    gameSocket.on('disconnect', onDisconnect)
    gameSocket.on("new move", newMove)
    gameSocket.on("createNewGame", createNewGame)
    gameSocket.on("playerJoinGame", playerJoinGame)
    gameSocket.on("requestUsername", requestUsername)
    gameSocket.on("recievedUsername", recievedUsername)

    function onDisconnect() {

    }
    function newMove() {
        // const gameId = move.gameId
        // io.to(gameId).emit("opponent move", move);s
    }
    function createNewGame() {
        console.log("creating a new game");
        
        gameSocket.emit("createNewGame", {gameId: "2345", mySocketId: gameSocket.id})
        gameSocket.join("3456")
    }
    async function playerJoinGame(idData) {
        let playerSocket = gameSocket
        let connectedSockets = io.sockets.adapter.rooms.get(idData.gameId)
        // let socketRooms = io.sockets.adapter.rooms[idData.gameId]
        let socketRooms = Array.from(socket.rooms.values()).filter((room) => room !== playerSocket.id)
        
        if (socketRooms.length > 0 || connectedSockets && connectedSockets.size === 2){
            playerSocket.emit("roomJoinError", {
                error: "Room is full, Please choose another room to play"
            })
        }else {
            await playerSocket.join(idData.roomId)
            playerSocket.emit("roomJoined")
        }
    }
    function requestUsername() {
        const gameId = move
    }
    function recievedUsername() {
        const gameId = move
    }
}

exports.initializeGame = initializeGame
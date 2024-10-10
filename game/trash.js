    // Player Who Joins Sends Info To Host
    const sendPlayerInfoToHost = async () => {
        let hostRecievedInfo = false
        console.log(`${player.info.username} Sending to Hosts (${player.game.opponent.id}) ...`);        

        // while (!hostRecievedInfo) {
        let checkIfHostRecievedInfo = setInterval(async () => {
            
            await io.to(player.game.opponent.id).emit("sendingJoinerInfoToHost", {info: player.info})    
            await playerSocket.on("hostRecievedInfo", ({state}) => {
                hostRecievedInfo = state
                console.log("Host Recieved Info Success :) ");
            
            })
            // console.log("checking If Host Recieved Info ... ");
            
            if (hostRecievedInfo) {
                console.log("Host Recieved Info.");
                clearInterval(checkIfHostRecievedInfo)
            }
        }, 4000);
    }

    // Host Recieves The Info Joiner Sends And Sends To The Frontend
    const recieveAndSendJoinerInfo = async () => {       
        // io.to(player.game.opponent.id).emit("sendingJoinerInfoToHost", {info: player.info})    
        
        console.log("Scanning for joiner info ...");
        
        // let hostRecievedInfo = false
        playerSocket.on("sendingJoinerInfoToHost", ({info}) => {
            if (info) {
                player.game.opponent.info = info
                io.to(player.id).emit("sendingHostOpponent", {info})
                io.to(player.game.opponent.id).emit("hostRecievedInfo", {state: true})
                console.log("Host says : Received Info.");
                
            } else {
                io.to(player.id).emit("sendingHostOpponent", {info : "No Opponent Yet !!"})
                io.to(player.game.opponent.id).emit("hostRecievedInfo", {state: false})
                // recieveAndSendJoinerInfo()
                console.log("Host says : Couldn't Receive Info.");
            }
          })
    }


    let roomSockets = io.sockets.adapter.rooms.get(roomId)
    .forEach(pId => {
        console.log(`${roomId} Member : ${pId}`);
    })

 
const playerDefaultValue = {
    email: "",
    password: "",
    username: "user",
    country: "usa",
    profileImage: {value: "gow.jpg", pos: 300, posId: 3},
    socials: {
        twitter: {title: "twitter", value: ""},
        discord: {title: "discord", value: ""},
        telegram: {title: "telegram", value: ""},
        twitch: {title: "twitch", value: ""},
        steam: {title: "steam", value: ""},
        epicGames: {title: "epic games", value: ""}
    },
    finance : {
        address : "",
        keys : {
            title: "keys",
            balance : 9,
            depositHistory : [
                {
                    token : "keys", 
                    chain : "polygon",
                    depositType : "swap",
                    senderAddress : "", 
                    unitDeposited : 5
                },
                {
                    token : "keys", 
                    chain : "polygon",
                    depositType : "swap",
                    senderAddress : "", 
                    unitDeposited : 5
                },
                {
                    token : "keys", 
                    chain : "polygon",
                    depositType : "swap",
                    senderAddress : "", 
                    unitDeposited : 5
                }
            ]
        },
        dia : {
            title: "token",
            balance : 100,
            depositHistory : [
                {
                token : "usdt", 
                chain : "polygon",
                depositType : "swap",
                senderAddress : "0x522789456...32c", 
                unitDeposited : 1000, 
                "timeStamp" : "August 9 2024, 11:00 pm GMT"
                }
            ]
        },
        usdt : {
            title: "usdt",
            balance : 150,
            depositHistory : [
                {
                token : "usdt", 
                chain : "polygon",
                depositType : "deposit",
                senderAddress : "0x34562424...32c", 
                unitDeposited : 200
                }
            ]
        },
        purchaseHistory : [
            {item: "dia", purchasedWith: "usdt", amountPurchased: 50, unitPurchased: 1000},
            {item: "keys", purchasedWith: "dia", amountPurchased: 500, unitPurchased: 5},
            {item: "keys", purchasedWith: "dia", amountPurchased: 200, unitPurchased: 2},
            {item: "keys", purchasedWith: "dia", amountPurchased: 200, unitPurchased: 2}
        ]
    },
    inGame: {
        connected: true,
        ready: false,
        host: true,
        join: false,
        opponent: {},
        wins : 10,
        losses : 2,
        won : false,
        lose : false,
        myCode: "",
        guesses : [],
        moves : null,
        time : null,
        powerUps : {
            timeFreezer : {
                active: false,
                duration: 5
            },
            timeBooster : {
                active: false,
                duration: 5
            },
            moveBooster : {
                active: false,
                duration: 5
            },
            detectiveMode : {
                active: false,
                duration: 5
            },
            wizardMode : {
                active: false,
                duration: 5
            }
        }
    },
    gameHistory: {
        gamePlaySocials: {
            rank : {title: "rank", value: "088", badge: ""}, 
            team : {title: "team", value: "", badge: ""}
        },
        singlePlayerGamePlayHistories: {
            vsComputer: {title: "Vs Computer", gameplayed: 0, wins: 0, losses: 0},
            survivalMode: {title: "Survival Mode", gameplayed: 0, wins: 0, losses: 0},
            storyMode: {title: "Story Mode", gameplayed: 0, wins: 0, losses: 0}
        },
        multiplayerGamePlayHistories: {
            offlineMultiplayer: {
                title: "Offline Multiplayer", 
                total: {title: "total", gameplayed: 0, wins: 0, losses: 0},
                whenHost: {title: "whenHost", gameplayed: 0, wins: 0, losses: 0}, 
                whenJoin: {title: "whenJoin", gameplayed: 0, wins: 0, losses: 0}
            },
            onlineMultiplayer: {
                title: "Online Multiplayer",
                total: {title: "total", gameplayed: 0, wins: 0, losses: 0},
                whenHost: {title: "whenHost", gameplayed: 0, wins: 0, losses: 0}, 
                whenJoin: {title: "whenJoin", gameplayed: 0, wins: 0, losses: 0}
            }
        }
    },
    settings : {
        theme : "dark",
        sound : false,
        audio : false,
        language : "english"
    }
}

module.exports = playerDefaultValue
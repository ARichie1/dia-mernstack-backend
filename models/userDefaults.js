 
const playerDefaultValue = {
    email: "",
    password: "",
    username: "",
    imgSrc: "../../../assets/images/faces/asta3.jpeg",
    finance : {
        address : "",
        keys : {
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
        myGuesses : [],
        opponentsGuesses : [],
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
    settings : {
        theme : "dark",
        sound : false,
        audio : false,
        language : "english"
    }
}

module.exports = playerDefaultValue
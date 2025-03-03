
// RESULT ASSETS CREATION START=========================//
const scanSelection = (theSCode, selection, difficulty) => {

    // GET THE ELEMENTS FOR THE CURRENT PREDICTION RESULT DIV
    let result = []

    // THE NEXT THREE ARRAY WILL GROUP
    // EACH (selection) TO THEIR RESPECTIVE STATUS.
    let deadArray = [];
    let injuredArray = [];
    let aliveArray = [];

    // (statusBinder) WILL BIND ALL THE STATUS AS AN ARRAY.
    let statusBinder = [];

    console.log("Starting Selection Scan...");
    
// (sInc) WILL INCREMENT SO WE CAN
// CYCLE THROUGH THE THE MAIN CODE.
    let sInc = 0;

// IF SELECTION IS EQUAL TO THE REQUIRED 
// MAXIMUM SELECTION FOR THE CURRENT DIFFICULTY
    if(selection.length == difficulty){
// FOR EACH SELECTION ELEMENT AS SELECTED
        selection.forEach(selected => {
            let stringifiedBtnId = selected.btn_id.toString()
            
// IF SELECTED MEETS A CONDITION ADD THE A STATUS ARRAY
            if (theSCode.includes(stringifiedBtnId) && stringifiedBtnId === theSCode[sInc]) {
                    deadArray.push("dead");}
            if (theSCode.includes(stringifiedBtnId) && stringifiedBtnId !== theSCode[sInc]) {
                    injuredArray.push("injured");}
            if (theSCode.includes(stringifiedBtnId) == false) {
                    aliveArray.push("alive");
            }
 
// PERFOM ACTION IF (sInc) IS GREATER THAN
// (selection) LENGTH
            sInc = sInc + 1;
            if (sInc == selection.length) {sInc = 0};
        });             
// SELECTION FOREACH LOOP END.

// BIND ALL THE STATUS ARRAY TOGETHER
        statusBinder = deadArray.concat(injuredArray).concat(aliveArray);

    // CREATE THE RESULT
        for (let i = 0; i < statusBinder.length; i++) {
            const stats = statusBinder[i];
            if (stats === "dead"){
                result = [...result, {title: "dead", value: "D", emoji: "💀", id: i}]
            } else if (stats === "injured"){
                result = [...result, {title: "injured", value: "I", emoji: "🤕", id: i}]
            }else if (stats === "alive"){
                result = [...result, {title: "alive", value: "A", emoji: "😁", id: i}]
            }
        }

        return result
    }else{
        console.log("invalid difficulty!!");
        
    }
}

exports.scanSelection = scanSelection
// RESULT ASSETS CREATION END=========================//

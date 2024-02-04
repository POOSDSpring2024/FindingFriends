let hasOutputElementID = false;
let outputElementID = "";

function setOutputElementID(newOutputElementID){
    if (typeof newOutputElementID !== 'string'){
        console.log('Incorrect OutputElementID Format. Defaulted to Null');
        outputElementID="";
        hasOutputElementID=false;
    }else{
        if(newOutputElementID.toUpperCase()==='NULL'||newOutputElementID===""){
            console.log('OutputElementID is "NULL". Defaulted to Null');
            outputElementID="";
            hasOutputElementID=false;
        }else{
            outputElementID="";
            hasOutputElementID=true;
        }
    }
}

function outputString(outputStr){
    if(hasOutputElementID) document.getElementById(outputElementID).innerHTML = outputStr;
    else console.log(outputStr);
}
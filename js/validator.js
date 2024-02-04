// Field where User Enters Info
let firstNameFieldElement;
let lastNameFieldElement;
let usernameFieldElement;
let passwordFieldElement;

let nameRequirementElement
let nameReqLengthElement;
let nameReqExcludedElement;

let usernameRequirementElement;
let usernameReqLengthElement;
let usernameReqLetterElement;
let usernameReqCharacterElement;
let usernameExtraInfoElement;

let passwordRequirementElement;
let passwordReqLengthElement;
let passwordReqLetterElement;
let passwordReqNumberElement;
let passwordReqSpecialCharacterElement;
let passwordReqExcludedElement;
let passwordExtraInfoElement;

function setFieldElement(firstNameFieldElementIDString, lastNameFieldElementIDString,usernameFieldElementIDString,passwordFieldElementIDString){
    firstNameFieldElement=document.getElementById(firstNameFieldElementIDString);
    lastNameFieldElement=document.getElementById(lastNameFieldElementIDString);
    usernameFieldElement=document.getElementById(usernameFieldElementIDString);
    passwordFieldElement=document.getElementById(passwordFieldElementIDString);
}

function setNameReqElement(nameRequirementElementIDString, nameReqLengthElementIDString, nameReqExcludedElementIDString){
    nameRequirementElement=document.getElementById(nameRequirementElementIDString);
    nameReqLengthElement=document.getElementById(nameReqLengthElementIDString);
    nameReqExcludedElement=document.getElementById(nameReqExcludedElementIDString);

    updateNameRequirement();
}

function setUsernameReqElement(usernameRequirementElementIDString, usernameReqLengthElementIDString, usernameReqLetterElementIDString, usernameReqCharacterElementIDString, usernameExtraInfoElementIDString){
    usernameRequirementElement=document.getElementById(usernameRequirementElementIDString);
    usernameReqLengthElement=document.getElementById(usernameReqLengthElementIDString);
    usernameReqLetterElement=document.getElementById(usernameReqLetterElementIDString);
    usernameReqCharacterElement=document.getElementById(usernameReqCharacterElementIDString);
    usernameExtraInfoElement=document.getElementById(usernameExtraInfoElementIDString);

    updateUsernameRequirement();
}

function setPasswordReqElement(passwordRequirementElementIDString, passwordReqLengthElementIDSting, passwordReqLetterElementIDString, passwordReqNumberElementIDString, passwordReqSpecialCharacterElementIDString, passwordReqExcludedElementIDString, passwordExtraInfoElementIDString){
    passwordRequirementElement=document.getElementById(passwordRequirementElementIDString);
    passwordReqLengthElement=document.getElementById(passwordReqLengthElementIDSting);
    passwordReqLetterElement=document.getElementById(passwordReqLetterElementIDString);
    passwordReqNumberElement=document.getElementById(passwordReqNumberElementIDString);
    passwordReqSpecialCharacterElement=document.getElementById(passwordReqSpecialCharacterElementIDString);
    passwordReqExcludedElement=document.getElementById(passwordReqExcludedElementIDString);
    passwordExtraInfoElement=document.getElementById(passwordExtraInfoElementIDString);

    updatePasswordRequirement();
}

// Prevents "Cross-Site Scripting" (XSS) attack
function sanatizeString(inputString) {
    return inputString.replace(/[<>]/g, '');
}

function getUsernameCharSet(){
    return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_-';
}

function getPasswordCharSet(){
    return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-=_+[\]{}|;:\'",./?~`';
}

function outputIncorrectCharacter(inputString, charSet, element){
    let outputStr = "Invalid Character: ";
    // g to allow multiple all 
    const regex = new RegExp(`[^${charSet}]`, 'g');
    const charNotInSet = inputString.match(regex);
    if (charNotInSet) {
        element.innerText=(outputStr+charNotInSet.join(' '));
    }
}

function getNameRequirementList(){
    const arrayUsernameRequirement=[];
    arrayUsernameRequirement.push('Name MUST be 1-32 Characters Long (inclusive)');
    arrayUsernameRequirement.push("Name CANNOT have '<' or '>'");
    return arrayUsernameRequirement;

}

function getUsernameRequirementList(){
    const arrayUsernameRequirement=[];
    arrayUsernameRequirement.push('Username MUST be 3-18 Characters Long (inclusive)');
    arrayUsernameRequirement.push('Username MUST be have at least one letter (a-z or A-Z)');
    arrayUsernameRequirement.push("Username can ONLY be letters, numbers, underscores or hypens");
    return arrayUsernameRequirement;
    // Username can only have a-z, A-Z, 0-9, _, -
}

function getPasswordRequirementList(){
    const arrayPasswordRequirement=[];
    arrayPasswordRequirement.push('Password MUST be 8-32 Characters Long (inclusive)');
    arrayPasswordRequirement.push('Password MUST be have at least one letter (a-z or A-Z)');
    arrayPasswordRequirement.push('Password MUST be have at least one number (0-9)');
    arrayPasswordRequirement.push('Password MUST be have at the following special character.');
    arrayPasswordRequirement.push('Special Character List: !@#$%^&*()-=_+[\\]{}|;:\'",./?~`');
    arrayPasswordRequirement.push("Password CANNOT have '<' or '>'");
    return arrayPasswordRequirement;
    // !@#$%^&*()-=_+[\]{}|;:'",./?~`
    // NOTE no <>
}

function isValidName(name){
    /*  isNameLengthValid(name)     [^<>] Exclude < and >
        isNameExcludedValid(name)   {1,32}Length Requirement
    */
    return isNameLengthValid(name) && isNameExcludedValid(name);
}

function isNameLengthValid(name){
    //  ^ @ the beginning   . matches any single character  {1,32}Length Requirement    $ end of regex
    return /^.{1,32}$/.test(name);
}

function isNameExcludedValid(name){
    //  ^ @ the beginning   [^<>]* Exclude < and > For Multiple Occurance   $ end of regex
    return /^[^<>]+$/.test(name);
}

function isValidUsername(username) {
    /*  ^ @ the beginning
        isUsernameLetterValid(username)     (?=.*[a-zA-Z]) Must include Letter  
        isUsernameAllowedValid(username)    [a-zA-Z0-9_-] Allowed Characters
        isUsernameLengthValid(username)     {3,18}Length Requirement
        $ end of regex
    */
    return isUsernameLengthValid(username) && isUsernameAllowedValid(username) && isUsernameLetterValid(username);
}

function isUsernameLengthValid(username){
    /*  ^ @ the beginning
        {3,18}Length Requirement
        $ end of regex
    */
    return /^.{3,18}$/.test(username)
}

function isUsernameAllowedValid(username){
    /*  ^ @ the beginning
        [a-zA-Z0-9_-] Allowed Characters
        Username can only have a-z, A-Z, 0-9, _, -
        $ end of regex
    */
    return /^[a-zA-Z0-9_-]+$/.test(username)
}

function isUsernameLetterValid(username){
    //  [a-zA-Z] Has Letter
    return /[a-zA-Z]/.test(username);
}

function isValidPassword(password) {
    return isPasswordLengthValid(password) && isPasswordLetterValid(password) && isPasswordNumberValid(password)
        && isPasswordSpecialValid(password) && isPasswordExcludedValid(password);
}

function isPasswordLengthValid(password){
    //  ^ @ the beginning   . matches any single character  {8,32}Length Requirement    $ end of regex
    return /^.{8,32}$/.test(password);
}

function isPasswordLetterValid(password){
    //  [a-zA-Z] Has Letter
    return /[a-zA-Z]/.test(password);
}

function isPasswordNumberValid(password){
    //  [0-9] Has Number 
    return /[0-9]/.test(password);
}

function isPasswordSpecialValid(password){
    //  [!@#$%^&*()-=_+[\]{}|;:\'",./?~`] Has Special Character 
    return /[!@#$%^&*()\-=_+[\]{}|;:\'",./?~`]/.test(password);
}

function isPasswordExcludedValid(password){
    //  ^ @ the beginning   [^<>]* Exclude < and > For Multiple Occurance   $ end of regex
    return /^[^<>]+$/.test(password);
}

function updateNameRequirement(){
    let nameReqArr = getNameRequirementList();
    firstNameFieldElement.onkeyup = function(){
        if(isValidName(firstNameFieldElement.value)&&isValidName(lastNameFieldElement.value)){
            nameRequirementElement.innerText= "✅First & Last Names are Good✅";
        }else{
            let returnStr = "";
            if(firstNameFieldElement.value===""&&lastNameFieldElement.value===""){
                returnStr="First Name & Last Name is Blank";
            }else if(firstNameFieldElement.value===""){
                returnStr="First Name is Blank";
            }else if(lastNameFieldElement.value===""){
                returnStr="Last Name is Blank";
            }else if(!isValidName(firstNameFieldElement.value)&&!isValidName(lastNameFieldElement.value)){
                returnStr="First & Last Name isn't in Correct Format";
            }else if(!isValidName(firstNameFieldElement.value)){
                returnStr="First Name isn't in Correct Format";
            }else if(!isValidName(lastNameFieldElement.value)){
                returnStr="Last Name isn't in Correct Format";
            }
            
            nameRequirementElement.innerText = `❌${returnStr}❌`;
        }
        if(isNameLengthValid(firstNameFieldElement.value)&&isNameLengthValid(lastNameFieldElement.value))
            nameReqLengthElement.innerText = "✅"+nameReqArr[0]+"✅";
        else
            nameReqLengthElement.innerText = "❌"+nameReqArr[0]+"❌";
        if(isNameExcludedValid(firstNameFieldElement.value)&&isNameExcludedValid(lastNameFieldElement.value))
            nameReqExcludedElement.innerText = "✅"+nameReqArr[1]+"✅";
        else
            nameReqExcludedElement.innerText = "❌"+nameReqArr[1]+"❌";
    }
    lastNameFieldElement.onkeyup = function(){
        if(isValidName(firstNameFieldElement.value)&&isValidName(lastNameFieldElement.value)){
            nameRequirementElement.innerText= "✅First & Last Names are Good✅";
        }else{
            let returnStr = "";
            if(firstNameFieldElement.value===""&&lastNameFieldElement.value===""){
                returnStr="First Name & Last Name is Blank";
            }else if(firstNameFieldElement.value===""){
                returnStr="First Name is Blank";
            }else if(lastNameFieldElement.value===""){
                returnStr="Last Name is Blank";
            }else if(!isValidName(firstNameFieldElement.value)&&!isValidName(lastNameFieldElement.value)){
                returnStr="First & Last Name isn't in Correct Format";
            }else if(!isValidName(firstNameFieldElement.value)){
                returnStr="First Name isn't in Correct Format";
            }else if(!isValidName(lastNameFieldElement.value)){
                returnStr="Last Name isn't in Correct Format";
            }
            
            nameRequirementElement.innerText = `❌${returnStr}❌`;
        }
        if(isNameLengthValid(firstNameFieldElement.value)&&isNameLengthValid(lastNameFieldElement.value))
            nameReqLengthElement.innerText = "✅"+nameReqArr[0]+"✅";
        else
            nameReqLengthElement.innerText = "❌"+nameReqArr[0]+"❌";
        if(isNameExcludedValid(firstNameFieldElement.value)&&isNameExcludedValid(lastNameFieldElement.value))
            nameReqExcludedElement.innerText = "✅"+nameReqArr[1]+"✅";
        else
            nameReqExcludedElement.innerText = "❌"+nameReqArr[1]+"❌";
    }
}

function updateUsernameRequirement(){
    let usernameReqArr = getUsernameRequirementList();
    usernameFieldElement.onkeyup = function(){        
        if(isValidUsername(usernameFieldElement.value))
            usernameRequirementElement.innerText = "✅Username is Good✅";
        else
            usernameRequirementElement.innerText = "❌Username isn't in Correct Format❌";
        
        if(isUsernameLengthValid(usernameFieldElement.value))
            usernameReqLengthElement.innerText = "✅"+usernameReqArr[0]+"✅";
        else
            usernameReqLengthElement.innerText = "❌"+usernameReqArr[0]+"❌";
        if(isUsernameLetterValid(usernameFieldElement.value))
            usernameReqLetterElement.innerText = "✅"+usernameReqArr[1]+"✅";
        else
            usernameReqLetterElement.innerText = "❌"+usernameReqArr[1]+"❌";
        if(isUsernameAllowedValid(usernameFieldElement.value)){
            usernameReqCharacterElement.innerText="✅"+usernameReqArr[2]+"✅";
            usernameExtraInfoElement.innerText = "";
        }else{
            usernameReqCharacterElement.innerText = "❌"+usernameReqArr[2]+"❌";
            outputIncorrectCharacter(usernameFieldElement.value, getUsernameCharSet(), usernameExtraInfoElement);
        }
    }
}



function updatePasswordRequirement(){
    let passwordReqArr = getPasswordRequirementList();
    passwordFieldElement.onkeyup = function(){
        if(isValidPassword(passwordFieldElement.value))
            passwordRequirementElement.innerText = "✅Password is Good✅";
        else
            passwordRequirementElement.innerText = "❌Password isn't in Correct Format❌";
        
        if(isPasswordLengthValid(passwordFieldElement.value))
            passwordReqLengthElement.innerText = "✅"+passwordReqArr[0]+"✅";
        else
            passwordReqLengthElement.innerText = "❌"+passwordReqArr[0]+"❌";
        if(isPasswordLetterValid(passwordFieldElement.value))
            passwordReqLetterElement.innerText = "✅"+passwordReqArr[1]+"✅";
        else
            passwordReqLetterElement.innerText = "❌"+passwordReqArr[1]+"❌";
        if(isPasswordNumberValid(passwordFieldElement.value))
            passwordReqNumberElement.innerText = "✅"+passwordReqArr[2]+"✅";
        else
            passwordReqNumberElement.innerText = "❌"+passwordReqArr[2]+"❌";
        if(isPasswordSpecialValid(passwordFieldElement.value))
            passwordReqSpecialCharacterElement.innerText = "✅"+passwordReqArr[3]+"✅";
        else
            passwordReqSpecialCharacterElement.innerText = "❌"+passwordReqArr[3]+"❌";
        if(isPasswordExcludedValid(passwordFieldElement.value)){
            passwordReqExcludedElement.innerText = "✅"+passwordReqArr[5]+"✅";
            passwordExtraInfoElement.innerText = "";
        }else{
            passwordReqExcludedElement.innerText = "❌"+passwordReqArr[5]+"❌";
            outputIncorrectCharacter(passwordFieldElement.value, getPasswordCharSet(), passwordExtraInfoElement);
        }
    }
}

function checkStatusEmoji(isValid){
    return isValid?"✅":"❌";
}
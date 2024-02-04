//import './md5.js';
document.write('<script src="js/md5.js"></script>');
document.write('<script src="js/validator.js"></script>');
const urlBase = 'http://cop4331-g24.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let ids = []

let hasOutputElementID = false;
let outputElementID = "";

function setOutputElementID(newOutputElementID){
    console.log(newOutputElementID);
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
            outputElementID=newOutputElementID;
            hasOutputElementID=true;
        }
    }
}

function outputString(outputStr){
    if(hasOutputElementID){
        if(document.getElementById(outputElementID)===null){
            console.log(`Null outputElementID ${outputElementID}`)
        }else document.getElementById(outputElementID).innerHTML = outputStr;
    } 
    else console.log(outputStr);
}

function authenticateLoginHTML(usernameElementID, passwordElementID, outputElementID){
    if (typeof usernameElementID !== 'string')
        throw new TypeError('usernameElementID must be a string');
    if (typeof passwordElementID !== 'string')
        throw new TypeError('passwordElementID must be a string');

    userId = 0;
    firstName = "";
    lastName = "";

    let username = document.getElementById(usernameElementID).value;
    let password = document.getElementById(passwordElementID).value;
    authenticateLoginString(username, password, outputElementID);
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";

    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function signUpUserHTML(firstNameElementID, lastNameElementID, usernameElementID, passwordElementID, outputElementID){
    if (typeof firstNameElementID !== 'string') 
        throw new TypeError('firstNameElementID must be a string');
    if (typeof lastNameElementID !== 'string') 
        throw new TypeError('lastNameElementID must be a string');
    if (typeof usernameElementID !== 'string') 
        throw new TypeError('usernameElementID must be a string');
    if (typeof passwordElementID !== 'string') 
        throw new TypeError('passwordElementID must be a string');

    userId = 0;
    firstName = document.getElementById(firstNameElementID).value;
    lastName = document.getElementById(lastNameElementID).value;
    let username = document.getElementById(usernameElementID).value;
    let password = document.getElementById(passwordElementID).value;
    signUpUserString(firstName, lastName, username, password, outputElementID);
}

function signUpUserDoublePasswordHTML(firstNameElementID, lastNameElementID, usernameElementID, passwordElementID, confirmPassowrdElementID, outputElementID){
    if (typeof firstNameElementID !== 'string') 
        throw new TypeError('firstNameElementID must be a string');
    if (typeof lastNameElementID !== 'string') 
        throw new TypeError('lastNameElementID must be a string');
    if (typeof usernameElementID !== 'string') 
        throw new TypeError('usernameElementID must be a string');
    if (typeof passwordElementID !== 'string') 
        throw new TypeError('passwordElementID must be a string');
    if (typeof confirmPassowrdElementID !== 'string') 
        throw new TypeError('confirmPassowrdElementID must be a string');

    userId = 0;
    firstName = document.getElementById(firstNameElementID).value;
    lastName = document.getElementById(lastNameElementID).value;
    let username = document.getElementById(usernameElementID).value;
    let password = document.getElementById(passwordElementID).value;
    let confirmPassword = document.getElementById(confirmPassowrdElementID).value;
    signUpUserDoublePasswordString(firstName, lastName, username, password, confirmPassword, outputElementID);
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));

    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie(outputElementID) {
    setOutputElementID(outputElementID);

    userId = -1;
    let splits = document.cookie.split(",");

    for (let i = 0; i < splits.length; i++) {
        let tokens = splits[i].trim().split("=");
        switch(tokens[0]){
            case "firstName":
                firstName = tokens[1];
                break;
            case "lastName":
                lastName = tokens[1];
                break; 
            case "userId":
                userId = tokens[1];
                break; 
        }
    }

    if (!userExist(id)) {
        window.location.href = "index.html";
    }

    else {
        setOutputElementID("weclome-text");
        outputString("Welcome, " + firstName + " " + lastName + "!");
    }
}

function userExist(id){
    return id > 0;
}

function authenticateLoginString(username, password, outputElementID){
    // Check Parameter Type
    if (typeof username !== 'string')
        throw new TypeError('username must be a string');
    if (typeof password !== 'string') 
        throw new TypeError('password must be a string');
    setOutputElementID(outputElementID);
    
    // Reset Details
    userId = 0;
    firstName = "";
    lastName = "";
    
    // Validate Username & Password
    returnString = "";
    isValidForm=true;
    if (!isValidUsername(username)) {
        returnString+="Incorrect Username. "
        isValidForm=false;
    }
    if (!isValidPassword(password)) {
        returnString+="Incorrect Password. "
        isValidForm=false;
    }
    outputString(returnString);
    if(!isValidForm)return;

    // Hash Password
    let hash = md5(password);

    let jsonInfo = {
        login: username,
        password: hash
    }
    let jsonPayload = JSON.stringify(jsonInfo);
    let url = urlBase + '/Login.' + extension;
    let xhr = new XMLHttpRequest();
    // console.log("Attempting xhr Post");
    xhr.open("POST", url, true);
    // console.log("Finished Post");
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = 
            function () {
                if (this.readyState == 4 && this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    userId = jsonObject.id;
                    if (!userExist(userId)) {
                        outputString("User/Password Combination Incorrect");
                    }else{
                        firstName = jsonObject.firstName;
                        lastName = jsonObject.lastName;
                        saveCookie();
                        window.location.href = "contacts.html";
                    }
                    
                }
            };
        xhr.send(jsonPayload);
    } catch (err) {
        outputString(err.message);
    }
}

function signUpUserString(firstName, lastName, username, password, outputElementID){
    if (typeof firstName !== 'string')
        throw new TypeError('firstName must be a string');
    if (typeof lastName !== 'string')
        throw new TypeError('lastName must be a string');
    if (typeof username !== 'string')
        throw new TypeError('username must be a string');
    if (typeof password !== 'string') 
        throw new TypeError('password must be a string');
    console.log(`Before signUpUserString [${outputElementID}]`);
    setOutputElementID(outputElementID);
    console.log(`After signUpUserString [${outputElementID}]`);
    // Validate Username & Password
    returnString = "";
    isValidForm=true;
    if (!isValidName(firstName)) {
        returnString+="Invalid First Name. "
        isValidForm=false;
    }
    if (!isValidName(lastName)) {
        returnString+="Invalid Last Name. "
        isValidForm=false;
    }
    if (!isValidUsername(username)) {
        returnString+="Invalid Username. "
        isValidForm=false;
    }
    if (!isValidPassword(password)) {
        returnString+="Invalid Password. "
        isValidForm=false;
    }
    outputString(returnString);
    if(!isValidForm)return;

    let hash = md5(password);
    let jsonInfo = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: hash
    };

    let jsonPayload = JSON.stringify(jsonInfo);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    console.log(`Before SignUp XML [${outputElementID}]`);
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState != 4) {
                return;
            }
            if (this.status == 409) {
                console.log(`After SignUp 409 [${outputElementID}]`);
                document.getElementById(outputElementID).innerHTML = "User already exists";
                return;
            }
            if (this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                outputString("User added");
                // console.log(userId);
                // console.log(firstName);
                // console.log(lastName);
                saveCookie();
                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        outputString(err.message);
    }

}

function signUpUserDoublePasswordString(firstName, lastName, username, password, confirmPassowrd, outputElementID){
    setOutputElementID(outputElementID);

    if (password!==confirmPassowrd) {
        outputString("Password & Confirmed Password aren't the same.");
        return;
    }
    signUpUserString(firstName, lastName, username, password, outputElementID)
}
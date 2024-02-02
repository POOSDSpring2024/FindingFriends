// THIS NEEDS TO BE REFRACTOR
// THIS FILE IS TOO BLOAT FOR ITS OWN GOOD
urlBase = 'http://cop4331-g24.xyz/LAMPAPI';
extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
ids = []

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("login-name").value;
    let password = document.getElementById("login-password").value;

    //console.log(password);
    var hash = md5(password);
    //hash = md5(password);
    //console.log(hash);
    //console.log(hash);
    //console.log(hash);
    //let hash=password;
// DEBUG
    if (!validLoginForm(login, password)) {
        document.getElementById("login-result").innerHTML = "invalid username or password";
        return;
    }
    document.getElementById("login-result").innerHTML = "";
    

    let tmp = {
        login: login,
        password: hash
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;
    let xhr = new XMLHttpRequest();
    console.log("Attempting xhr Post");
    xhr.open("POST", url, true);
    console.log("Finished Post");
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("login-result").innerHTML = "User/Password combination incorrect";
                    return;
                }
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();
                window.location.href = "contacts.html";
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("login-result").innerHTML = err.message;
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";

    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function clickLogin() {
    let log = document.getElementById("login");
    let reg = document.getElementById("signup");
    let but = document.getElementById("toggle-form");

    log.style.left = "-400px";
    reg.style.left = "0px";
    but.style.left = "130px";
}

function validLoginForm(loginName, loginPassword) {
    //DEBUG LINE
    return true;
    
        let loginNameError = loginPasswordError = true;
    
        if (loginName == "") {
            console.log("USERNAME IS BLANK");
        }else {
            let regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;
            if (regex.test(loginName) == false) {
                console.log("USERNAME IS NOT VALID");
            }else{
                console.log("USERNAME IS VALID");
                loginNameError = false;
            }
        }
    
        if (loginPassword == "") {
            console.log("PASSWORD IS BLANK");
            loginPasswordError = true;
        }else {
            let regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;
            if (regex.test(loginPassword) == false) {
                console.log("PASSWORD IS NOT VALID");
            }else {
                console.log("PASSWORD IS VALID");
                loginPasswordError = false;
            }
        }
        if ((loginNameError || loginPasswordError) == true) {
            return false;
        }
        return true;
    }

    function saveCookie() {
        let minutes = 20;
        let date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
    
        document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
    }
    
    function readCookie() {
        userId = -1;
        let data = document.cookie;
        let splits = data.split(",");
    
        for (let i = 0; i < splits.length; i++) {
    
            let thisOne = splits[i].trim();
            let tokens = thisOne.split("=");
    
            if (tokens[0] == "firstName") {
                firstName = tokens[1];
            }
    
            else if (tokens[0] == "lastName") {
                lastName = tokens[1];
            }
    
            else if (tokens[0] == "userId") {
                userId = parseInt(tokens[1].trim());
            }
        }
    
        if (userId < 0) {
            window.location.href = "index.html";
        }
    
        else {
            document.getElementById("weclome-text").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
        }
    }

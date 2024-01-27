// THIS NEEDS TO BE REFRACTOR
// THIS FILE IS TOO BLOAT FOR ITS OWN GOOD
urlBase = 'http://cop4331-g24.xyz/LAMPAPI';
extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
ids = []

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    var login = document.getElementById("loginName").value;
    var password = document.getElementById("loginPassword").value;

//var hash = md5(password);
// DEBUG
    var hash =password;
    if (!validLoginForm(login, password)) {
        document.getElementById("loginResult").innerHTML = "invalid username or password";
        return;
    }
    document.getElementById("loginResult").innerHTML = "";
    

    var tmp = {
        login: login,
        password: hash
    };

    var jsonPayload = JSON.stringify(tmp);

    var url = urlBase + '/Login.' + extension;
    var xhr = new XMLHttpRequest();
    console.log("Attempting xhr Post");
    xhr.open("POST", url, true);
    console.log("Finished Post");
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
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
        document.getElementById("loginResult").innerHTML = err.message;
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
    var log = document.getElementById("login");
    var reg = document.getElementById("signup");
    var but = document.getElementById("btn");

    log.style.left = "-400px";
    reg.style.left = "0px";
    but.style.left = "130px";
}

function validLoginForm(logName, logPass) {
    //DEBUG LINE
    return true;
    
        var logNameErr = logPassErr = true;
    
        if (logName == "") {
            console.log("USERNAME IS BLANK");
        }
        else {
            var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;
    
            if (regex.test(logName) == false) {
                console.log("USERNAME IS NOT VALID");
            }
    
            else {
    
                console.log("USERNAME IS VALID");
                logNameErr = false;
            }
        }
    
        if (logPass == "") {
            console.log("PASSWORD IS BLANK");
            logPassErr = true;
        }
        else {
            var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;
    
            if (regex.test(logPass) == false) {
                console.log("PASSWORD IS NOT VALID");
            }
    
            else {
    
                console.log("PASSWORD IS VALID");
                logPassErr = false;
            }
        }
    
        if ((logNameErr || logPassErr) == true) {
            return false;
        }
        return true;
    
    }

    function saveCookie() {
        var minutes = 20;
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
    
        document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
    }
    
    function readCookie() {
        userId = -1;
        var data = document.cookie;
        var splits = data.split(",");
    
        for (var i = 0; i < splits.length; i++) {
    
            var thisOne = splits[i].trim();
            var tokens = thisOne.split("=");
    
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
            document.getElementById("userName").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
        }
    }

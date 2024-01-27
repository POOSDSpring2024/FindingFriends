// THIS NEEDS TO BE REFRACTOR
// THIS FILE IS TOO BLOAT FOR ITS OWN GOOD
urlBase = 'http://cop4331-g24.xyz/LAMPAPI';
extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
ids = []

function doSignup() {
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;

    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (!validSignUpForm(firstName, lastName, login, password)) {
        document.getElementById("signupResult").innerHTML = "invalid signup";
        return;
    }

    var hash = md5(password);

    document.getElementById("signupResult").innerHTML = "";

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: login,
        password: hash
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {

            if (this.readyState != 4) {
                return;
            }

            if (this.status == 409) {
                document.getElementById("signupResult").innerHTML = "User already exists";
                return;
            }

            if (this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                document.getElementById("signupResult").innerHTML = "User added";
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signupResult").innerHTML = err.message;
    }
}

function clickRegister() {

    var log = document.getElementById("login");
    var reg = document.getElementById("signup");
    var but = document.getElementById("btn");

    reg.style.left = "-400px";
    log.style.left = "0px";
    but.style.left = "0px";

}

function validSignUpForm(fName, lName, user, pass) {

    var fNameErr = lNameErr = userErr = passErr = true;

    if (fName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (user == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
        var regex = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{3,18}$/;

        if (regex.test(user) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            userErr = false;
        }
    }

    if (pass == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
        var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

        if (regex.test(pass) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            passErr = false;
        }
    }

    if ((fNameErr || lNameErr || userErr || passErr) == true) {
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

    for (var i = 0; i < splits.length; i++) {

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
        document.getElementById("userName").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
    }
}
// THIS NEEDS TO BE REFRACTOR
// THIS FILE IS TOO BLOAT FOR ITS OWN GOOD
urlBase = 'http://cop4331-g24.xyz/LAMPAPI';
extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
ids = []

function doSignup() {
    firstName = document.getElementById("first-name").value;
    lastName = document.getElementById("last-name").value;

    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;


    if (!validSignUpForm(firstName, lastName, login, password)) {
        document.getElementById("signup-result").innerHTML = "invalid signup";
        return;
    }

    let hash = md5(password);

    document.getElementById("signup-result").innerHTML = "";

    console.log(firstName);
    console.log(lastName);
    console.log(login);
    console.log(password);

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
                document.getElementById("signup-result").innerHTML = "User already exists";
                return;
            }

            if (this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                document.getElementById("signup-result").innerHTML = "User added";
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
                window.location.href = "contacts.html";
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signup-result").innerHTML = err.message;
    }
}

function clickRegister() {

    let log = document.getElementById("login");
    let reg = document.getElementById("signup");
    let but = document.getElementById("toggle-form");

    reg.style.left = "-400px";
    log.style.left = "0px";
    but.style.left = "0px";

}

function validSignUpForm(firstName, lastName, username, password) {

    let firstNameError = lastNameError = usernameError = passwordError = true;

    if (firstName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        firstNameError = false;
    }

    if (lastName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lastNameError = false;
    }

    if (username == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
        let regex = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{3,18}$/;

        if (regex.test(username) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            usernameError = false;
        }
    }

    if (password == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
        let regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

        if (regex.test(password) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            passwordError = false;
        }
    }

    if ((firstNameError || lastNameError || usernameError || passwordError) == true) {
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
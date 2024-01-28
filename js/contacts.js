// THIS NEEDS TO BE REFRACTOR
// THIS FILE IS TOO BLOAT FOR ITS OWN GOOD
urlBase = 'http://cop4331-g24.xyz/LAMPAPI';
extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
ids = []

function showTable() {
    var x = document.getElementById("addMe");
    var contacts = document.getElementById("contactsTable")
    if (x.style.display === "none") {
        x.style.display = "block";
        contacts.style.display = "none";
    } else {
        x.style.display = "none";
        contacts.style.display = "block";
    }
}

function addContact() {

    let firstName = document.getElementById("contactTextFirst").value;
    let lastName = document.getElementById("contactTextLast").value;
    let phoneNumber = document.getElementById("contactTextNumber").value;
    let emailAddress = document.getElementById("contactTextEmail").value;

    if (!validAddContact(firstName, lastName, phoneNumber, emailAddress)) {
        console.log("INVALID FIRST NAME, LAST NAME, PHONE, OR EMAIL SUBMITTED");
        return;
    }
    let tmp = {
        firstName: firstName,
        lastName: lastName,
        phone: phoneNumber,
        email: emailAddress,
        userId: userId
    };


    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been added");
                // Clear input fields in form 
                document.getElementById("addMe").reset();
                // reload contacts table and switch view to show
                loadContacts();
                showTable();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function loadContacts() {
    let tmp = {
        search: "",
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                let text = "<table border='1'>"
                for (let i = 0; i < jsonObject.results.length; i++) {
                    ids[i] = jsonObject.results[i].id;
                    text += "<tr id='row" + i + "'>";
                    text += "<td id='firstName" + i + "'><span>" + jsonObject.results[i].firstName + "</span></td>";
                    text += "<td id='lastName" + i + "'><span>" + jsonObject.results[i].lastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].email + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].phone + "</span></td>";
                    text += "<td>" +
                        "<button type='button' id='editButton" + i + "' class='w3-button w3-circle w3-lime' onclick='edit_row(" + i + ")'>" + "<span class='glyphicon glyphicon-edit'></span>" + "</button>" +
                        "<button type='button' id='saveButton" + i + "' value='Save' class='w3-button w3-circle w3-lime' onclick='save_row(" + i + ")' style='display: none'>" + "<span class='glyphicon glyphicon-saved'></span>" + "</button>" +
                        "<button type='button' onclick='delete_row(" + i + ")' class='w3-button w3-circle w3-amber'>" + "<span class='glyphicon glyphicon-trash'></span> " + "</button>" + "</td>";
                    text += "<tr/>"
                }
                text += "</table>"
                document.getElementById("tbody").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function edit_row(id) {
    document.getElementById("editButton" + id).style.display = "none";
    document.getElementById("saveButton" + id).style.display = "inline-block";

    var firstNameId = document.getElementById("firstName" + id);
    var lastNameId = document.getElementById("lastName" + id);
    var emailId = document.getElementById("email" + id);
    var phoneId = document.getElementById("phone" + id);

    var firstNameData = firstNameId.innerText;
    var lastNameData = lastNameId.innerText;
    var emailData = emailId.innerText;
    var phoneData = phoneId.innerText;

    firstNameId.innerHTML = "<input type='text' id='firstNameText" + id + "' value='" + firstNameData + "'>";
    lastNameId.innerHTML = "<input type='text' id='lastNameText" + id + "' value='" + lastNameData + "'>";
    emailId.innerHTML = "<input type='text' id='emailText" + id + "' value='" + emailData + "'>";
    phoneId.innerHTML = "<input type='text' id='phoneText" + id + "' value='" + phoneData + "'>"
}

function save_row(no) {
    var firstNameValue = document.getElementById("firstNameText" + no).value;
    var lastNameValue = document.getElementById("lastNameText" + no).value;
    var emailValue = document.getElementById("emailText" + no).value;
    var phoneValue = document.getElementById("phoneText" + no).value;
    var idValue = ids[no]

    document.getElementById("firstName" + no).innerHTML = firstNameValue;
    document.getElementById("lastName" + no).innerHTML = lastNameValue;
    document.getElementById("email" + no).innerHTML = emailValue;
    document.getElementById("phone" + no).innerHTML = phoneValue;

    document.getElementById("editButton" + no).style.display = "inline-block";
    document.getElementById("saveButton" + no).style.display = "none";

    let tmp = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        email: emailValue,
        phone: phoneValue,
        id: idValue
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function delete_row(no) {
    var namef_val = document.getElementById("first_Name" + no).innerText;
    var namel_val = document.getElementById("last_Name" + no).innerText;
    nameOne = namef_val.substring(0, namef_val.length);
    nameTwo = namel_val.substring(0, namel_val.length);
    let check = confirm('Confirm deletion of contact: ' + nameOne + ' ' + nameTwo);
    if (check === true) {
        document.getElementById("row" + no + "").outerHTML = "";
        let tmp = {
            firstName: nameOne,
            lastName: nameTwo,
            userId: userId
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/DeleteContacts.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    console.log("Contact has been deleted");
                    loadContacts();
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }

    };

}

function searchContacts() {
    const content = document.getElementById("searchText");
    const selections = content.value.toUpperCase().split(' ');
    const table = document.getElementById("contacts");
    const tr = table.getElementsByTagName("tr");// Table Row

    for (let i = 0; i < tr.length; i++) {
        const tdfirstName = tr[i].getElementsByTagName("td")[0];// Table Data: First Name
        const tdLastName = tr[i].getElementsByTagName("td")[1];// Table Data: Last Name
        const tdemail = tr[i].getElementsByTagName("td")[2];// Table Data: Email
        const tdphone = tr[i].getElementsByTagName("td")[3];// Table Data: Phone

        if (tdfirstName && tdLastName) {
            const txtValueFirstName = tdfirstName.textContent || tdfirstName.innerText;
            const txtValueLastName = tdLastName.textContent || tdLastName.innerText;
            tr[i].style.display = "none";

            for (selection of selections) {
                if (txtValueFirstName.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
                if (txtValueLastName.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
                if (tdemail.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
                if (tdphone.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
            }
        }
    }
}

function validAddContact(firstName, lastName, phone, email) {

    var fNameErr = lNameErr = phoneErr = emailErr = true;

    if (firstName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lastName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (phone == "") {
        console.log("PHONE IS BLANK");
    }
    else {
        var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

        if (regex.test(phone) == false) {
            console.log("PHONE IS NOT VALID");
        }

        else {

            console.log("PHONE IS VALID");
            phoneErr = false;
        }
    }

    if (email == "") {
        console.log("EMAIL IS BLANK");
    }
    else {
        var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

        if (regex.test(email) == false) {
            console.log("EMAIL IS NOT VALID");
        }

        else {

            console.log("EMAIL IS VALID");
            emailErr = false;
        }
    }

    if ((phoneErr || emailErr || fNameErr || lNameErr) == true) {
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
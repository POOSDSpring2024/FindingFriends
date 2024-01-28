// THIS NEEDS TO BE REFRACTOR
// THIS FILE IS TOO BLOAT FOR ITS OWN GOOD
urlBase = 'http://cop4331-g24.xyz/LAMPAPI';
extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
ids = []

function showTable() {
    var x = document.getElementById("add-me");
    var contacts = document.getElementById("contact-table")
    if (x.style.display === "none") {
        x.style.display = "block";
        contacts.style.display = "none";
    } else {
        x.style.display = "none";
        contacts.style.display = "block";
    }
}

function addContact() {

    let firstName = document.getElementById("contact-text-first-name").value;
    let lastName = document.getElementById("contact-text-last-name").value;
    let phoneNumber = document.getElementById("contact-text-number").value;
    let emailAddress = document.getElementById("contact-text-email").value;

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
                document.getElementById("add-me").reset();
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
                    text += "<tr id='row-" + i + "'>";
                    text += "<td id='first-name-" + i + "'><span>" + jsonObject.results[i].firstName + "</span></td>";
                    text += "<td id='last-name-" + i + "'><span>" + jsonObject.results[i].lastName + "</span></td>";
                    text += "<td id='email-" + i + "'><span>" + jsonObject.results[i].email + "</span></td>";
                    text += "<td id='phone-" + i + "'><span>" + jsonObject.results[i].phone + "</span></td>";
                    text += "<td>" +
                        "<button type='button' id='edit-button-" + i + "' class='w3-button w3-circle w3-lime' onclick='editRow(" + i + ")'>" + "<span class='glyphicon glyphicon-edit'></span>" + "</button>" +
                        "<button type='button' id='save-button-" + i + "' value='Save' class='w3-button w3-circle w3-lime' onclick='saveRow(" + i + ")' style='display: none'>" + "<span class='glyphicon glyphicon-saved'></span>" + "</button>" +
                        "<button type='button' onclick='deleteRow(" + i + ")' class='w3-button w3-circle w3-amber'>" + "<span class='glyphicon glyphicon-trash'></span> " + "</button>" + "</td>";
                    text += "<tr/>"
                }
                text += "</table>"
                document.getElementById("table-body").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function editRow(rowNumber) {
    document.getElementById("edit-button-" + rowNumber).style.display = "none";
    document.getElementById("save-button-" + rowNumber).style.display = "inline-block";

    var firstNameElement = document.getElementById("first-name-" + rowNumber);
    var lastNameElement = document.getElementById("last-name-" + rowNumber);
    var emailNElement= document.getElementById("email-" + rowNumber);
    var phoneElement = document.getElementById("phone-" + rowNumber);

    var firstNameData = firstNameElement.innerText;
    var lastNameData = lastNameElement.innerText;
    var emailData = emailNElement.innerText;
    var phoneData = phoneElement.innerText;

    firstNameElement.innerHTML = "<input type='text' id='first-name-edit-text-" + rowNumber + "' value='" + firstNameData + "'>";
    lastNameElement.innerHTML = "<input type='text' id='last-name-edit-text-" + rowNumber + "' value='" + lastNameData + "'>";
    emailNElement.innerHTML = "<input type='text' id='email-edit-text-" + rowNumber + "' value='" + emailData + "'>";
    phoneElement.innerHTML = "<input type='text' id='phone-edit-text-" + rowNumber + "' value='" + phoneData + "'>"
}

function saveRow(rowNumber) {
    var newFirstNameValue = document.getElementById("first-name-edit-text-" + rowNumber).value;
    var newLastNameValue = document.getElementById("last-name-edit-text-" + rowNumber).value;
    var newEmailValue = document.getElementById("email-edit-text-" + rowNumber).value;
    var newPhoneValue = document.getElementById("phone-edit-text-" + rowNumber).value;
    var newIdValue = ids[rowNumber]

    document.getElementById("first-name-" + rowNumber).innerHTML = newFirstNameValue;
    document.getElementById("last-name-" + rowNumber).innerHTML = newLastNameValue;
    document.getElementById("email-" + rowNumber).innerHTML = newEmailValue;
    document.getElementById("phone-" + rowNumber).innerHTML = newPhoneValue;

    document.getElementById("edit-button-" + rowNumber).style.display = "inline-block";
    document.getElementById("save-button-" + rowNumber).style.display = "none";

    let tmp = {
        firstName: newFirstNameValue,
        lastName: newLastNameValue,
        email: newEmailValue,
        phone: newPhoneValue,
        id: newIdValue
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

function deleteRow(rowNumber) {
    var idValue = ids[rowNumber]
    var firstNameValue = document.getElementById("first-name-" + rowNumber).innerText;
    var lastNameValue = document.getElementById("last-name-" + rowNumber).innerText;
    var firstName = firstNameValue.substring(0, firstNameValue.length);
    var lastName = lastNameValue.substring(0, lastNameValue.length);
    let check = confirm('Confirm deletion of contact: ' + firstName + ' ' + lastName);
    if (check === true) {
        document.getElementById("row-" + rowNumber + "").outerHTML = "";
        let tmp = {
            id: idValue
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
    const content = document.getElementById("search-text");
    const selections = content.value.toUpperCase().split(' ');
    const table = document.getElementById("contacts");
    const tr = table.getElementsByTagName("tr");// Table Row

    for (let i = 0; i < tr.length; i++) {
        const tdFirstName = tr[i].getElementsByTagName("td")[0];// Table Data: First Name
        const tdLastName = tr[i].getElementsByTagName("td")[1];// Table Data: Last Name
        const tdEmail = tr[i].getElementsByTagName("td")[2];// Table Data: Email
        const tdPhone = tr[i].getElementsByTagName("td")[3];// Table Data: Phone

        if (tdFirstName && tdLastName) {
            const textValueFirstName = tdFirstName.textContent || tdFirstName.innerText;
            const textValueLastName = tdLastName.textContent || tdLastName.innerText;
            const textValueEmail = tdEmail.textContent || tdEmail.innerText;
            const textValuePhone = tdPhone.textContent || tdPhone.innerText;
            tr[i].style.display = "none";

            for (selection of selections) {
                if (textValueFirstName.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
                if (textValueLastName.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
                if (textValueEmail.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
                if (textValuePhone.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
            }
        }
    }
}

function validAddContact(firstName, lastName, phone, email) {

    var firstNameError = lastNameErrot = phoneError = emailError = true;

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
        lastNameErrot = false;
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
            phoneError = false;
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
            emailError = false;
        }
    }

    if ((firstNameError || lastNameErrot || phoneError || emailError) == true) {
        return false;

    }

    return true;

}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";

    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
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
        document.getElementById("weclome-text").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
    }
}
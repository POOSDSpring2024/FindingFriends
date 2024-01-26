<?php

    $inData = getRequestInfo();
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userID = $inData["userID"];

    $conn = new mysqli("localhost", "MasterUser", "COP4331TwoFour", "COP4331");
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
        $stmt->bind_param("i", $inData['id']);
        $stmt->execute();

        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if (!$row) {
            returnWithError("Record not found");
        } else {
            $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=?, UserID=? WHERE ID=?");
            $stmt->bind_param("sssssi", $firstName, $lastName, $phone, $email, $userID, $inData['id']);
            $stmt->execute();

            $stmt->close();
            $conn->close();

            returnWithInfo("Update successful");
        }
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($info)
    {
        $retValue = '{"info":"' . $info . '"}';
        sendResultInfoAsJson($retValue);
    }

?>

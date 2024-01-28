<?php
	header("Access-Control-Allow-Origin: http://cop4331-g24.xyz");
	header("Access-Control-Allow-Methods: GET, POST");
	header("Access-Control-Allow-Headers: Content-Type");
    
    $inData = getRequestInfo();
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    //$userID = $inData["userID"];
    //Since we can't know which Contact to change, we need to send the Contact ID, not the User ID
    //For example, what would happen if first,last,phone, and email are changed, then we wouldn't know which contact to change
    $id = $inData["id"];

    $conn = new mysqli("localhost", "MasterUser", "COP4331TwoFour", "COP4331");
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        // The SQL below is searching for the Contact's ID, not the UserID; hence why we changed $userID to $id
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
        $stmt->bind_param("i", $inData['id']);
        $stmt->execute();

        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if (!$row) {
            returnWithError("Record not found");
        } else {
            $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? /*, UserID=?*/ WHERE ID=?");
            $stmt->bind_param(/*"sssssi"*/"ssssi", $firstName, $lastName, $phone, $email, /*$userID,*/ $inData['id']);
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

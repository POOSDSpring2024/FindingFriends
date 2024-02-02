<?php
	header("Access-Control-Allow-Origin: http://cop4331-g24.xyz");
	header("Access-Control-Allow-Methods: GET, POST");
	header("Access-Control-Allow-Headers: Content-Type");

	$inData = getRequestInfo();

  // For registering, we only need first and last name, user, and password
  $firstName = $inData["firstName"];
  $lastName = $inData["lastName"];
  $login = $inData["login"];
  $password = $inData["password"];
  // $passwordRepeat = $inData["passwordRepeat"];

	$conn = new mysqli("localhost", "MasterUser", "COP4331TwoFour", "COP4331");
	if($conn->connect_error ){
		returnWithError($conn->connect_error );
	}

  // Check that all fields were filled out
  if (!isset($firstName) OR  !isset($lastName) OR !isset($login) OR !isset($password)){
    returnWithError("All fields need to be set");
    exit();
  }

  // Check that values in fields aren't empty
  if ((empty($firstName) || empty($lastName) || empty($login) || empty($password))){
    returnWithError("Field values cannot be empty");
    exit(); 
  }

  // Check the password length
  if (strlen($password) < 5){
    returnWithError("Password must be at leat 5 characters long");

    
    // Check that passwords match
    // if ($password !== $passwordRepeat)
    // {
    //   returnWithError("Passwords do not match");
    // }
  }else{
    $stmt = $conn->prepare("SELECT * FROM Users WHERE Login=?");
    $stmt->bind_param("s", $login);
		$stmt->execute();
    $result = $stmt->get_result();
    $rows = mysqli_num_rows($result);

    if($rows > 0){
			returnWithError("Login taken. Try a different login");
    }
    else{
      $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
      $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
      $stmt->execute();
      $id = $conn->insert_id;
      $stmt->close();
      $conn->close();
      // http_response_code(200);
      $searchResults .= '{'.'"id": "'.$id.''.'"}';
      returnWithInfo($searchResults);
      //echo 'Succesfully Registered';
    }

    $stmt->close();
    $conn->close();
  }


  function getRequestInfo()
  {
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
  {
		header('Content-type: application/json');
		//echo $obj;
	}

	function returnWithError($err)
  {
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

  function returnWithInfo($searchResults)
  {
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
  }

?>

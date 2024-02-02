<?php
  header("Access-Control-Allow-Origin: http://cop4331-g24.xyz");
  header("Access-Control-Allow-Methods: GET, POST");
  header("Access-Control-Allow-Headers: Content-Type");
  $inData = getRequestInfo();

  //$firstName = $inData["firstName"];
  //$lastName = $inData["lastName"];
  //$userId = $inData["userId"];
  $id=$inData["id"];

	$conn = new mysqli("localhost", "MasterUser", "COP4331TwoFour", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		//$stmt = $conn->prepare("DELETE FROM Contacts WHERE FirstName = ? AND LastName = ? AND UserID = ?");
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
		//$stmt->bind_param("sss", $firstName, $lastName, $userId);
		$stmt->bind_param("s", $id);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>

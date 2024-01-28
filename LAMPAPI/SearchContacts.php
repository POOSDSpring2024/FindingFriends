<?php
	header("Access-Control-Allow-Origin: http://cop4331-g24.xyz");
	header("Access-Control-Allow-Methods: GET, POST");
	header("Access-Control-Allow-Headers: Content-Type");

	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "MasterUser", "COP4331TwoFour", "COP4331");
	if ($conn->connect_error){
		returnWithError( $conn->connect_error );
	}else{
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserID = ?");
		$input = "%" . $inData["search"] . "%";
		$stmt->bind_param("ssssi", $input, $input, $input, $input, $inData["userId"]);
		$stmt->execute();

		$result = $stmt->get_result();

		while($row = $result->fetch_assoc()){
			if( $searchCount > 0 ){
				$searchResults .= ",";
			}
			$searchCount++;
			// Return array of JSON objects instead of array of strings
			$searchResults .= '{"firstName" : "' . $row["FirstName"]. '", "lastName" : "' . $row["LastName"]. '", "phone" : "' . $row["Phone"]. '", "email" : "' . $row["Email"]. '", "userID" : "' . $row["UserID"].'", "id" : "' . $row["ID"]. '"}';
			//$searchResults .= '{"firstName" : "' . $row["FirstName"]. '", "lastName" : "' . $row["LastName"]. '", "phone" : "' . $row["Phone"]. '", "email" : "' . $row["Email"]. '"}';
		}

		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>

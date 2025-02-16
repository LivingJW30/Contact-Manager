<?php
	//Login PHP Code
	/*
		This code takes an AJAX request from JavaScript containing the corresponding username and password
		provided. It then takes the values and queries it through the users table of the database, where it checks if the user
		exists. If it exists, it returns the users ID. If they dont exist, it returns an ID of 0.
	*/

    $inData = getRequestInfo();
    
    $id = 0;
    
    $conn = new mysqli("localhost", "Adam", "password", "CONTACT_MANAGER"); //need username and password from Adam
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
		$stmt = $conn->prepare("SELECT user_id FROM users WHERE username=? AND password_hash =?");
		$stmt->bind_param("ss", $inData["username"], $inData["password"]); //Depends on JSON format in JavaScript (username and password respectively)
		$stmt->execute();
		$result = $stmt->get_result();

		//I could change it to snag the password (along with the userID) for comparison. If the password is wrong it would throw an "Incorrect Password" Error
		//For now im leaving it like this, where if either are wrong it will throw the same error

		if ($row = $result->fetch_assoc()) 
		{
        	returnWithInfo($row["user_id"]);
		}
		else
		{
			returnWithError("No Records Found");
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
		$retValue = '{"id":0, "error":"' . $err . '"}'; 
    	sendResultInfoAsJson($retValue);
	}
	
	function returnWithInfo( $id )
	{
		$retValue = '{"id":' . $id . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
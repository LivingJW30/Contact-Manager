<?php
    //SignUp PHP Code
    /*
        This code takes an AJAX request from JavaScript and parses the username and password from it. It then adds
        the corresponding information into the users table of the database, creating a new user in the contact manager
    */

    $inData = getRequestInfo();

    //These fields depend on JSON format in JavaScript
    $username = $inData["username"]; 
    $password = $inData["password"];

    $conn = new mysqli("localhost", "Adam", "password", "CONTACT_MANAGER"); //need username and password from Adam
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	else
	{
        $stmt = $conn->prepare("INSERT into users (username, password_hash) VALUES(?,?)");
        $stmt->bind_param("ss", $username, $password);
		
		
		try 
		{
			if ($stmt->execute()) 
			{
				returnWithError(""); //An error with "" indicates success
			}
		} 
		catch (Exception $e) 
		{
			if ($e->getCode() == 1062) 
			{
				returnWithError("Username already exists. Please try again.");
			} 
			else 
			{
				returnWithError("Signup failed: " . $e->getMessage());
			}
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>

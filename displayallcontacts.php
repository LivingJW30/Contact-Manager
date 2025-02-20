<?php
	//Display All Contacts PHP Code
	/*
		This code takes an AJAX request from JavaScript containing the user ID of the logged in user.
		It then displays the contact information (first name, last name, email) of all contacts containing
		the user ID in a JSON encoded array
	*/

    $inData = getRequestInfo(); //Collects information from Front End

	//Connects to database
    $conn = new mysqli("localhost", "Adam", "password", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//Preparing and executing SQL statement
		$stmt = $conn->prepare("SELECT first_name, last_name, email FROM CONTACTS WHERE user_id=?");
		$stmt->bind_param("s", $inData["id"]); //Pre Defined JSON Values (can change later if needed)
		$stmt->execute();
		$result = $stmt->get_result();
		
		$contacts = [];

		// Fetch all rows and store them in an array
		while ($row = $result->fetch_assoc()) {
			$contacts[] = $row;
		}
        
		if (count($contacts) > 0) {
			returnWithInfo($contacts);
		} else {
			returnWithError("No Contacts");
		}

		$stmt->close();
		$conn->close();
	}

    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	//Returns new results as JSON to the Front End
    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	//Any Error throws "" values for the provided fields
	function returnWithError( $err )
	{
		$retValue = '{"firstName":"","lastName":"","email":"","error":"' . $err . '"}';
    	sendResultInfoAsJson($retValue);
	}
	
	//Returns new array as JSON to the Front End
	function returnWithInfo($contacts)
	{
		$retValue = json_encode(["contacts" => $contacts, "error" => ""]);
		sendResultInfoAsJson($retValue);
	}
?>
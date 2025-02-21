<?php
	//Delete Contacts PHP Code
	/*
		This code takes an AJAX request from JavaScript containing the unique contact ID.
		It then deletes the contact based on the corresponding contact ID directly in the database.
	*/

    $inData = getRequestInfo(); //Collects information from Front End

    $contact_id = $inData["contactId"]; //Pre Defined JSON Values (can change later if needed)

	//Connects to database
    $conn = new mysqli("localhost", "Adam", "password", "CONTACT_MANAGER");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//Preparing and executing SQL statement
		$stmt = $conn->prepare("DELETE from CONTACTS WHERE contact_id=?");
		$stmt->bind_param("s", $contact_id);
		$stmt->execute();

		if($stmt->affected_rows === 0)
		{
			returnWithError("Delete failed");
		}
		else
		{
			returnWithError(""); //An error with a value of "" indicates success
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
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
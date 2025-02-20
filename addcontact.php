<?php
	//Add Contacts PHP Code
	/*
		This code takes an AJAX request from JavaScript containing the first name, last name, email, and user ID.
		It then adds the contact directly in the database including the user ID.
	*/

	$inData = getRequestInfo(); //Collects information from Front End
    
    //Pre Defined JSON Values (Can change later if needed)
    $user_id = $inData["id"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];

	//Connects to database
	$conn = new mysqli("localhost", "Adam", "password", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//Preparing and executing SQL statement
		$stmt = $conn->prepare("INSERT into CONTACTS (user_id, first_name, last_name, email) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $user_id, $firstName, $lastName, $email);
		$stmt->execute();

		//I could modify this code to throw an error if the contact doesnt add but im keeping it like this for now

		$stmt->close();
		$conn->close();
		returnWithError(""); //An error with a value of "" indicates success
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
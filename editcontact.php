<?php
	//Edit Contacts PHP Code
	/*
		This code takes an AJAX request from JavaScript containing the first name, last name, email, and contact ID.
		It then edits the contact based on the corresponding contact ID directly in the database
	*/

    $inData = getRequestInfo(); //Collects information from Front End

	//Connects to database
    $conn =  $conn = new mysqli("localhost", "Adam", "password", "CONTACT_MANAGER");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
		//Preparing and executing SQL statement
        $stmt = $conn->prepare("UPDATE CONTACTS SET first_name =?, last_name =?, email=? where contact_id=?");
		$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["email"], $inData["contactId"]); //Pre Defined JSON Values (can change later if needed)
		$stmt->execute(); 

		//I could modify this code to throw an error if the contact doesnt edit but im keeping it like this for now

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
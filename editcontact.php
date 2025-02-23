<?php
	//Edit Contacts PHP Code
	/*
		This code takes an AJAX request from JavaScript containing the first name, last name, email, and contact ID.
		It then edits the contact based on the corresponding contact ID directly in the database
	*/

    $inData = getRequestInfo(); //Collects information from Front End

	//Connects to database
    $conn = new mysqli("localhost", "team", "team_pass", "CONTACT_MANAGER");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
		//Preparing and executing SQL statement
        $stmt = $conn->prepare("UPDATE CONTACTS SET first_name =?, last_name =?, email=? WHERE contact_id=?");
		$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["email"], $inData["contactId"]); //Pre Defined JSON Values (can change later if needed)
		$stmt->execute(); 

		if($stmt->affected_rows === 0) //May also throw this if values are the same. I can either keep it to throw one error or change it to throw different errors
		{
			$info = $conn->info;
			if (strpos($info, "Rows matched: 0") !== false) 
			{
				returnWithError("No contact found");
			} 
			else 
			{
				returnWithError("Values are Identical");
			}
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
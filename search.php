<?php
    //Search PHP Code
	/*
		This code takes an AJAX request from JavaScript containing the corresponding userId, First name, Last Name, and email.
        It then searches the database to and returns the user found to the front end. If no user is found, it throws a No Records
        Found error
	*/

    $inData = getRequestInfo(); //Collects information from Front End

    $userID = $inData["id"];
    $firstName = "%" . $inData["firstName"] . "%";
    $lastName = "%" . $inData["lastName"] . "%";
    $email = "%" . $inData["email"] . "%";
    
    //Connects to database
    $conn = new mysqli("localhost", "Adam", "password", "CONTACT_MANAGER");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        //Preparing and executing SQL statement
        $stmt = $conn->prepare("SELECT first_name, last_name, email, contact_id from CONTACTS WHERE user_id =? AND (first_name LIKE ? OR last_name LIKE ? AND email LIKE ?)");
        $stmt->bind_param("ssss", $userID, $firstName, $lastName, $email); //Pre Defined JSON Values (can change later if needed)
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
	
    //Any Error throws an ID of 0 and "" values for the other fields
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","email":"","error":"' . $err . '"}';
    	sendResultInfoAsJson($retValue);
	}
	
    //Returns new array as JSON to the Front End
	function returnWithInfo($contacts)
	{
		$retValue = json_encode(["contacts" => $contacts, "error" => ""]);
		sendResultInfoAsJson($retValue);
	}
?>

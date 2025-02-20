<?php
    //Search PHP Code
	/*
		This code takes an AJAX request from JavaScript containing the corresponding userId, First name, Last Name, and email.
        It then searches the database to and returns the user found to the front end. If no user is found, it throws a No Records
        Found error
	*/

    $inData = getRequestInfo(); //Collects information from Front End
    
    //Connects to database
    $conn = new mysqli("localhost", "Adam", "password", "CONTACT_MANAGER");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        //Preparing and executing SQL statement
        $stmt = $conn->prepare("SELECT user_id, first_name, last_name, email from CONTACTS where user_id=? AND first_name=? AND last_name=? AND email=?");
        $stmt->bind_param("ssss", $inData["id"], $inData["firstName"], $inData["lastName"], $inData["email"]); //Pre Defined JSON Values (can change later if needed)
        $stmt->execute();
		$result = $stmt->get_result();

        //Fetches result and returns the values
        if($row = $result->fetch_assoc())
        {
            returnWithInfo($row["user_id"], $row["first_name"], $row["last_name"], $row["email"]);
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
	
    //Converts the new values into JSON Format
	function returnWithInfo( $id, $firstName, $lastName, $email)
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":"' . $email . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
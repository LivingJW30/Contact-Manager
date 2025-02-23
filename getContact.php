<?php
    $inData = getRequestInfo();
    $conn = new mysqli("localhost", "Adam", "password", "CONTACT_MANAGER");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("SELECT first_name, last_name, email FROM CONTACTS WHERE contact_id=?");
        $stmt->bind_param("s", $inData["contactId"]);
        $stmt->execute();

        $result = $stmt->get_result();

        if($row = $result->fetch_assoc())
        {
            $contactInfo = '{"firstName":"' . $row['first_name'] . '",
                           "lastName":"' . $row['last_name'] . '",
                           "email":"' . $row['email'] . '",
                           "error":""}';
            sendResultInfoAsJson($contactInfo);
        }
        else
        {
            returnWithError("Contact not found");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>

const urlBase = 'http://pood.zerix.org/Contact-Manager-API';
const extension = 'php';

function readCookie() {
  let match = document.cookie.match(/userId=([^;]+)/);
  if (match) {
    userId = parseInt(match[1].trim());
  } else {
    userId = -1;
  }
  
  if (userId < 0) {
    window.location.href = "login.html";
  }
  console.log("Parsed userId:", userId);
}


readCookie();

//*************************************************
document.addEventListener('DOMContentLoaded', function () {
  // Display initial contacts when the page loads
  fetchContacts();

  // Search button (supports partial matches on name or email)
  document.getElementById("searchBtn").addEventListener("click", function () {
    let query = document.getElementById("searchInput").value;
      searchContacts(query);
  });

  // When the contact form is submitted, save (add/update) the contact
  document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    saveContact();
  });

  // Logout button
  document.getElementById("logoutBtn").addEventListener("click", function () {
    logout();
  });
});

//*************************************************
// Fetch contacts from server and display them
// Change this to use the 'displayallcontacts.php' file
function fetchContacts() {
  let url = urlBase + '/displayallcontacts.' + extension;

  let tmp = { id: userId };
  let jsonPayload = JSON.stringify(tmp);

  // Create a new XMLHttpRequest to send data to the server
  // let xhr = new XMLHttpRequest();
  // xhr.open("POST", url, true);
  // xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  // // When the request is successful, parse the JSON response
  // xhr.onreadystatechange = function () {
  //   if (xhr.readyState === 4 && xhr.status === 200) {
  //     let jsonObject = JSON.parse(xhr.responseText);
  //     displayContacts(jsonObject.contacts);
  //   }
  // };

  // // Send the JSON payload to the API endpoint
  // xhr.send(jsonPayload);

  let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
        let jsonObject = JSON.parse( xhr.responseText );
				displayContacts(jsonObject.contacts);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
    console.log("Error fetching contacts:", err.message);
	}
}

//*************************************************
// Search for contacts by name
function searchContacts(query) {
  let url = urlBase + '/search.' + extension;

  let tmp = { 
    id: userId, 
    firstName: query,
    lastName: query,
    email: ""
  };
  let jsonPayload = JSON.stringify(tmp);

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let jsonObject = JSON.parse(xhr.responseText);
      displayContacts(jsonObject.contacts);
    }
  };

  xhr.send(jsonPayload);
}

//*************************************************
// Display the contacts inside the "contactsContainer" element
function displayContacts(contacts) {
  let container = document.getElementById("contactsContainer");
  container.innerHTML = ""; // Clear any previous contacts.

  // Loop through each contact and create a div element
  contacts.forEach(contact => {
    const contactDiv = document.createElement("div");
    contactDiv.className = "contact";

    const contactInfo = document.createElement("span");
    let fullName = `${contact.first_name} ${contact.last_name}`;
    contactInfo.innerHTML = `<strong>${fullName}</strong> (${contact.email})`;
    contactDiv.appendChild(contactInfo);

    // // Add edit button
    // const editBtn = document.createElement("button");
    // editBtn.innerHTML = "Edit";
    // editBtn.onclick = () => editContact(contact.id);
    // contactDiv.appendChild(editBtn);

    // // Add delete button
    // const deleteBtn = document.createElement("button");
    // deleteBtn.innerHTML = "Delete";
    // deleteBtn.onclick = () => {
    //   if(confirm("Are you sure you want to delete this contact?")) {
    //     deleteContact(contact.id);
    //   }
    // };
    // contactDiv.appendChild(deleteBtn);

    // container.appendChild(contactDiv);
  });
}

//*************************************************
// Save a contact (adding a new one or updating an existing one)
function saveContact() {
  let contactId = document.getElementById("contactId").value;
  let contactFirstName = document.getElementById("contactFirstName").value;
  let contactLastName = document.getElementById("contactLastName").value;
  let contactEmail = document.getElementById("contactEmail").value;

  let tmp = { 
    id: contactId, 
    firstName: contactFirstName,
    lastName: contactLastName, 
    email: contactEmail 
  };
  let jsonPayload = JSON.stringify(tmp);

  // If contactId is empty, it's a new contact...otherwise, it's an update
  let url = "";
  if (contactId == "") {
    url = urlBase + '/addcontact.' + extension;
  }
  else {
    url = urlBase + '/editcontact.' + extension;
  }

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.onereadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let jsonObject = JSON.parse(xhr.responseText);
      if (jsonObject.error == "") {
        // Refresh the contacts list
        fetchContacts();
        // Reset the form
        document.getElementById("contactForm").reset();
        document.getElementById("contactId").value = "";
      }
      else {
        alert("Error saving contact: " + jsonObject.error);
      }
    }
  };
  xhr.send(jsonPayload);
}

//*************************************************

// Edit a contact by fetching the contact details and populate the form
function editContact(id) {
  let url = urlBase + '/editcontact.' + extension;
  let tmp = { id: id };
  let jsonPayload = JSON.stringify(tmp);

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let jsonObject = JSON.parse(xhr.responseText);
      if (jsonObject.success) {
        document.getElementById("contactId").value = contact.id;
        document.getElementById("contactName").value = contact.name;
        document.getElementById("contactEmail").value = contact.email;
      } else {
        alert(jsonObject.message);
      }
    }
  };
  xhr.send(jsonPayload);
}

//*************************************************
// delete a contact (ask for confirm before deleting)
function deleteContact(id) {
  if (!confirm("Are you sure you want to delete this contact?")) {
    return;
  }

  let url = urlBase + '/deletecontact.' + extension;
  let tmp = { id: id };
  let jsonPayload = JSON.stringify(tmp);

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let jsonObject = JSON.parse(xhr.responseText);
      if (jsonObject.success) {
        // Refresh the contacts list
        fetchContacts();
      } else {
        alert(jsonObject.message);
      }
    }
  };
}

//*************************************************
// Logout function
function logout() {
  // Clear the userId and redirect to the login page
  userId = 0;
  window.location.href = "login.html";
}
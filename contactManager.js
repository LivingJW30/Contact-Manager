const urlBase = 'http://pood.zerix.org/Contact-Manager-API';
const extension = 'php';

document.addEventListener('DOMContentLoaded', function () {
  // Display initial contacts when the page loads
  displayContacts(dummyContacts);
  // API: fetch contacts when the page loads
  // fetchContacts("");

  // Search button (supports partial matches on name or email)
  document.getElementById("searchBtn").addEventListener("click", function () {
    let query = document.getElementById("searchInput").value;
    fetchContacts(query);
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
// Fetch contacts from server
// The API should accept a JSON payload with an optional search query
// Change this to search function using 'search.php'
function fetchContacts(query) {
  // If no query is provided, default to an empty string
  if (query === undefined) {
    query = "";
  }

  let url = urlBase + '/GetContacts.' + extension;

  // Create a JSON payload that includes the search query
  let tmp = { search: query };
  let jsonPayload = JSON.stringify(tmp);

  // Create a new XMLHttpRequest to send data to the server
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  // When the request is successful, parse the JSON response
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let jsonObject = JSON.parse(xhr.responseText);
      // The server should return an object with a "results" array
      displayContacts(jsonObject.results);
    }
  };

  // Send the JSON payload to the API endpoint
  xhr.send(jsonPayload);
}

//*************************************************
// Display the contacts inside the "contactsContainer" element
// Change this to use the 'displayallcontacts.php' file
function displayContacts(contacts) {
  let container = document.getElementById("contactsContainer");
  container.innerHTML = ""; // Clear any previous contacts.

  // Loop through each contact and create a div element
  contacts.forEach(contact => {
    let div = document.createElement("div");
    div.className = "contact";

    // Add the contact's info and Edit/Delete buttons
    div.innerHTML = `<span><strong>${contact.name}</strong> (${contact.email})</span>
                       <button onclick="editContact(${contact.id})">Edit</button>
                       <button onclick="deleteContact(${contact.id})">Delete</button>`;
    container.appendChild(div);
  });
}

//*************************************************
// Save a contact (adding a new one or updating an existing one)
function saveContact() {
  let contactId = document.getElementById("contactId").value;
  let contactName = document.getElementById("contactName").value;
  let contactEmail = document.getElementById("contactEmail").value;

  let tmp = { id: contactId, name: contactName, email: contactEmail };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/SaveContact.' + extension;
  if (contactId == "") {
    url = urlBase + '/AddContact.' + extension;
  }
  else {
    url = urlBase + '/EditContact.' + extension;
  }

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.onereadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let jsonObject = JSON.parse(xhr.responseText);
      if (jsonObject.success) {
        // Refresh the contacts list
        fetchContacts("");
        document.getElementById("contactForm").reset();
        document.getElementById("contactId").value = "";
      }
      else {
        alert(jsonObject.message);
      }
    }
  };
  xhr.send(jsonPayload);
}

//*************************************************

// Edit a contact by fetching the contact details and populate the form
function editContact(id) {
  let url = urlBase + '/GetContact.' + extension;
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

  let url = urlBase + '/DeleteContact.' + extension;
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
        fetchContacts("");
      } else {
        alert(jsonObject.message);
      }
    }
  };
}

//*************************************************
// Logout function
function logout() {
  let url = urlBase + '/Logout.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let jsonObject = JSON.parse(xhr.responseText);
      if (jsonObject.success) {
        alert("Logged out!");
        window.location.href = "login.html";
      }
      else {
        alert(jsonObject.message);
      }
    }
  };
  xhr.send();
}
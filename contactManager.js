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
// Display contacts in the table
function displayContacts(contacts) {
  let container = document.getElementById("contactsContainer");
  container.innerHTML = "";

  if (!contacts || contacts.length == 0) {
    container.innerHTML = "<p>No contacts found</p>";
    return;
  }

  contacts.forEach(contact => {
    let fullName = contact.first_name + " " + contact.last_name;
    let div = document.createElement("div");
    div.className = "contact";
    div.innerHTML = `<span>Contact_ID: ${contact.contact_id}<strong>${fullName}</strong> (${contact.email})</span>
                     <button onclick="editContact(${contact.contact_id})">Edit</button>
                     <button onclick="deleteContact(${contact.contact_id})">Delete</button>`;
    container.appendChild(div);
  });
}

//*************************************************
// Fetch contacts from server and display them
// Change this to use the 'displayallcontacts.php' file
function fetchContacts() {
  let payload = { id: userId };

  fetch("displayallcontacts.php", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    displayContacts(data.contacts);
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Fetch failed: " + error.message);
  });
}

//*************************************************
// Search for contacts by name
function searchContacts(query) {
  if (query == "") {
    fetchContacts();
    return;
  }

  let payload = { 
    id: userId,
    firstName: query,
    lastName: query,
    email: ""
   };

   fetch("search.php", { 
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      displayContacts(data.contacts);
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Search failed: " + error.message);
    });
}

//*************************************************
// Save a contact (adding a new one or updating an existing one)
function saveContact() {
  let contactId = document.getElementById("contactId").value;
  let contactFirstName = document.getElementById("contactFirstName").value;
  let contactLastName = document.getElementById("contactLastName").value;
  let contactEmail = document.getElementById("contactEmail").value;

  let payload = {}

  // Adding a new contact, pass userId
  if (contactId == "") {
    payload = { 
      id: userId,
      firstName: contactFirstName,
      lastName: contactLastName, 
      email: contactEmail 
    };
  } else {
    // Edit contact
    payload = {  
      firstName: contactFirstName,
      lastName: contactLastName, 
      email: contactEmail,
      contactId: contactId
    };
  }

  console.log("Payload:", payload);

  let apiFile = (contactId == "") ? "addcontact.php" : "editcontact.php";

  fetch(apiFile, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.error == "") {
      fetchContacts();
      document.getElementById("contactForm").reset();
      document.getElementById("contactId").value = "";
    } else {
      alert("Error saving contact: " + data.error);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Save failed: " + error.message);
  });
}

//*************************************************
// Edit a contact (load the contact info into the form)
function editContact(contact_id) {
  let payload = { contactId: contact_id };

  fetch("getContact.php", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.error == "") {
      document.getElementById("contactId").value = data.id;
      document.getElementById("contactFirstName").value = data.firstName;
      document.getElementById("contactLastName").value = data.lastName;
      document.getElementById("contactEmail").value = data.email;
    } else {
      alert("Error getting contact: " + contact_id);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Get failed: " + error.message);
  });
}

//*************************************************
// delete a contact (ask for confirm before deleting)
function deleteContact(contact_id) {
  if (!confirm("Are you sure you want to delete this contact?")) {
    return;
  }

  let payload = { contactId: contact_id };

  fetch("deletecontact.php", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.error == "") {
      fetchContacts();
    } else {
      alert("Error deleting contact: " + contact_id);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Delete failed: " + error.message);
  });
}

//*************************************************
// Logout function
function logout() {
  // Clear the userId and redirect to the login page
  userId = -1;
  window.location.href = "login.html";
}

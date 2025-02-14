// const urlBase = 'http://pood.zerix.org/LAMPAPI/ContactManager';
// const extension = 'php';

// Dummy data to simulate contacts from an API
let dummyContacts = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
  ];
  
  document.addEventListener('DOMContentLoaded', function() {
    // Display initial contacts when the page loads
    displayContacts(dummyContacts);
    // API: fetch contacts when the page loads
    // fetchContacts("");
  
    // Search button (supports partial matches on name or email)
    document.getElementById("searchBtn").addEventListener("click", function() {
      let query = document.getElementById("searchInput").value;
      fetchContacts(query);
    });
  
    // When the contact form is submitted, save (add/update) the contact
    document.getElementById("contactForm").addEventListener("submit", function(e) {
      e.preventDefault();
      saveContact();
    });
  
    // Logout button
    document.getElementById("logoutBtn").addEventListener("click", function() {
      logout();
    });
  });
  
  //*************************************************
  // Filters the dummyContacts array based on the search query
  function searchContacts(query) {
    let filteredContacts = dummyContacts.filter(contact =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.email.toLowerCase().includes(query.toLowerCase())
    );
    displayContacts(filteredContacts);
  }

// // The API should accept a JSON payload with an optional search query
// function fetchContacts(query) {
//   // If no query is provided, default to an empty string
//   if (query === undefined) {
//     query = "";
//   }

//   // Build the URL to call your API endpoint
//   let url = urlBase + '/GetContacts.' + extension;

//   // Create a JSON payload that includes the search query
//   let tmp = { search: query };  
//   let jsonPayload = JSON.stringify(tmp);

//   // Create a new XMLHttpRequest to send data to the server
//   let xhr = new XMLHttpRequest();
//   xhr.open("POST", url, true);
//   xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

//   // When the request is successful, parse the JSON response
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4 && xhr.status === 200) {
//       let jsonObject = JSON.parse(xhr.responseText);
//       // The server should return an object with a "results" array
//       displayContacts(jsonObject.results);
//     }
//   };

//   // Send the JSON payload to the API endpoint
//   xhr.send(jsonPayload);
// }

  //*************************************************
  // Display the contacts inside the "contactsContainer" element
  function displayContacts(contacts) {
    let container = document.getElementById("contactsContainer");
    container.innerHTML = ""; // Clear any previous contacts.
  
    contacts.forEach(contact => {
      // Create a div for each contact
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
  
    if (contactId === "") {
      // Adding a new contact
      // Generate a new id
      let newId = dummyContacts.length > 0 ? Math.max(...dummyContacts.map(c => c.id)) + 1 : 1;
      dummyContacts.push({ id: newId, name: contactName, email: contactEmail });
    } else {
      // Updating an existing contact
      dummyContacts = dummyContacts.map(contact => {
        if (contact.id === parseInt(contactId)) {
          return { id: contact.id, name: contactName, email: contactEmail };
        }
        return contact;
      });
    }
  
    // Refresh the displayed contacts and clear the form
    displayContacts(dummyContacts);
    document.getElementById("contactForm").reset();
    document.getElementById("contactId").value = "";
  }
  
  //*************************************************
  // Edit a contact by finding it in the dummy data and populating the form
  function editContact(id) {
    let contact = dummyContacts.find(c => c.id === id);
    if (contact) {
      document.getElementById("contactId").value = contact.id;
      document.getElementById("contactName").value = contact.name;
      document.getElementById("contactEmail").value = contact.email;
    }
  }
  
  //*************************************************
  // Delete a contact from the dummy data and refresh the display
  function deleteContact(id) {
    if (confirm("Are you sure you want to delete this contact?")) {
      dummyContacts = dummyContacts.filter(contact => contact.id !== id);
      displayContacts(dummyContacts);
    }
  }
  
  //*************************************************
  // Logout function
  function logout() {
    alert("Logged out!");
    // window.location.href = "login.html";
  }
  
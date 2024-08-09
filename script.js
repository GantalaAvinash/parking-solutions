function fetchSlots(callback) {
    fetch('clients.txt')
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error fetching slots:', error));
}

function searchSlots() {
    const location = document.getElementById('location').value;
    const vehicleType = document.getElementById('vehicleType').value;

    fetchSlots(data => {
        const filteredSlots = data.filter(slot => 
            slot.location.includes(location) && slot.vehicleType === vehicleType
        );

        const slotsList = document.getElementById('slotsList');
        slotsList.innerHTML = ''; // Clear previous results

        if (filteredSlots.length === 0) {
            slotsList.innerHTML = '<p>No slots available.</p>';
        } else {
            filteredSlots.forEach(slot => {
                const slotItem = document.createElement('div');
                slotItem.className = 'slot-item';
                slotItem.innerHTML = `
                    <p><strong>${slot.clientName}</strong></p>
                    <p>${slot.location}</p>
                    <p>Price: ${slot.price}</p>
                `;
                slotsList.appendChild(slotItem);

                // Adding click event to navigate to book slot page
                slotItem.addEventListener('click', () => {
                    window.location.href = `book-slot.html?client=${encodeURIComponent(slot.clientName)}`;
                });
            });
        }
    });
}

function loadSlotDetails() {
    const params = new URLSearchParams(window.location.search);
    const clientName = params.get('client');

    fetchSlots(data => {
        const slot = data.find(slot => slot.clientName === clientName);
        
        if (slot) {
            const slotDetails = document.getElementById('slotDetails');
            slotDetails.innerHTML = `
                <p><strong>${slot.clientName}</strong></p>
                <p>${slot.location}</p>
                <p>Price: ${slot.price}</p>
                <img src="${slot.slotImage}" alt="Slot Image" style="width:100%; margin-top:10px; border-radius:4px;">
            `;
        } else {
            document.getElementById('slotDetails').innerHTML = '<p>Slot details not found.</p>';
        }
    });
}

function confirmBooking() {

    const params = new URLSearchParams(window.location.search);
    const clientName = params.get('client');

    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (!startTime || !endTime) {
        alert('Please select both start and end times.');
        return;
    }
    alert(`Booking confirmed for ${startTime} to ${endTime}.`);

    fetchSlots(data => {
        const slot = data.find(slot => slot.clientName === clientName);

        if (slot) {
            const slotBooking = document.getElementById('slotBooking');
            slotBooking.innerHTML = `
                <p><strong>${slot.clientName}</strong></p>
                <p><a href="https://www.google.com/maps/search/?api=1&query=${slot.location}" target="_blank">${slot.location}</a></p>
                <p>Price: ${slot.price}</p>
                <p>Start Time: ${startTime}</p>
                <p>End Time: ${endTime}</p>
            `;
            const booking = {
                clientName: slot.clientName,
                location: slot.location,
                vehicleType: slot.vehicleType,
                price: slot.price,
                startTime,
                endTime
            };
            saveBooking(booking);
        } else {
            alert('Slot details not found.');
        }
    });
}



// Function to get query parameters from URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        clientName: params.get('client')
    };
}

// Load the slot details when the page is loaded
window.onload = loadSlotDetails;


function uploadSlot() {
    const clientName = document.getElementById('clientName').value;
    const location = document.getElementById('location').value;
    const vehicleType = document.getElementById('vehicleType').value;
    const price = document.getElementById('price').value;
    const slotImage = document.getElementById('slotImage').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    const newSlot = {
        clientName,
        location,
        vehicleType,
        price,
        slotImage,
        startTime,
        endTime
    };

    fetch('clients.txt')
        .then(response => response.json())
        .then(data => {
            data.push(newSlot);
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'clients.txt';
            a.click();
        })
        .catch(error => console.error('Error uploading slot:', error));
}



function validation() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if the username and password match the required credentials
    if (username === "chandu" && password === "chandu123") {
        // Redirect to account.html if credentials are correct
        alert("Login Successful");
        window.location.href = "Client_Upload.html";
    } else {
        // Show an alert message if the credentials are incorrect
        alert("Invalid username or password. Please try again.");
    }
}


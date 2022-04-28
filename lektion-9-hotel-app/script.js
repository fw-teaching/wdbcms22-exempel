console.log("works")

const API_URL = "https://cgi.arcada.fi/~welandfr/demo/wdbcms22-exempel/api/hotel/";

/**
 * getHotel() hämtar gäster och bokningar
 */
async function getHotel() {

  document.querySelector('#edit-title').innerText = 'Ny bokning';

  const resp = await fetch(API_URL);
  const data = await resp.json();

  console.log(data.guests);

  let guests_html = "";
  // for-of loopen loopar igenom alla element i en array
  for (guest of data.guests) {  
    // backtick-syntax är praktiskt för att bygga upp teckensträngar
    guests_html += `
      <option value="${guest.id}">
        (id:${guest.id}) ${guest.firstname} ${guest.lastname} (${guest.bookings_count} besök)
      </option>`;
  }
  document.querySelector("#guest").innerHTML = guests_html;

  let bookings_html = "";
  for (booking of data.bookings) {
    bookings_html += `
      <li>
        (id:${booking.id})
        ${booking.datefrom}
        ${booking.guestname},
        Rum:${booking.room_id} 
        (${booking.addinfo})
        <span class="link" data-edit="${booking.id}">[Edit]</span>
        <span class="link" data-del="${booking.id}">[Del]</span>
      </li>`;
  }
  document.querySelector("#bookings").innerHTML = bookings_html;

}
getHotel();

/**
 * saveBooking() gör POST-request för att spara ny bokning
 */
async function saveBooking(booking_id) {

  const bookingData = {
    guest_id: document.querySelector('#guest').value,
    room_id: document.querySelector('#room').value,
    addinfo: document.querySelector('#addinfo').value,
    datefrom: document.querySelector('#datefrom').value
  }

  // Kolla om vi sparar ny eller uppdaterar gammal
  let urlStr = API_URL;
  let method = 'POST';
  if (booking_id != 0) {
    urlStr += "?id=" + booking_id;
    method = 'PUT';
  }

  const resp = await fetch(urlStr, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': localStorage.getItem('hotel_api_key')
    },
    body: JSON.stringify(bookingData)
  });
  const respData = await resp.json();

  //getHotel();
  console.log(respData);
  location = './';
}

/**
 * delBooking() gör DELETE-request för att radera bokning
 */
async function delBooking(booking_id) {
  if (confirm("vill du verkligen radera bokning " + booking_id)) {

    const resp = await fetch(API_URL + "?id=" + booking_id, {
      method: 'DELETE',
      headers: { 'x-api-key': localStorage.getItem('hotel_api_key') }
    });
    const respData = await resp.json();
    console.log(respData);
    getHotel();
  }
}

/**
 * editBooking(id) fyller i formuläret för editering av existerande bokning
 */

async function editBooking(booking_id) {
  
  const resp = await fetch(API_URL + "?id=" + booking_id, {
    method: 'GET',
    headers: { 'x-api-key': localStorage.getItem('hotel_api_key') }
  });
  const b = await resp.json();
  console.log(b);
  document.querySelector('#edit-title').innerText = 'UPPDATERA bokning ' + b.id;
  document.querySelector('#booking-id').value = b.id; // dolda fältet!
  document.querySelector('#datefrom').value = b.datefrom;
  document.querySelector('#guest').value = b.guest_id;
  document.querySelector('#room').value = b.room_id;
  document.querySelector('#addinfo').value = b.addinfo;

}

// Lyssna på save-knappen
document.querySelector('#save-booking').addEventListener('click', () => {
  // booking-id är 0 för nya, riktig id när vi uppdaterar
  saveBooking(document.querySelector('#booking-id').value) 
});

// Lyssna på [Del]
document.querySelector('#bookings').addEventListener('click', (event) => {
  
  if (event.target.getAttribute("data-del")) {
    delBooking(event.target.getAttribute("data-del"));

  } else if (event.target.getAttribute("data-edit")) {
    editBooking(event.target.getAttribute("data-edit"));
  }

});

// Lyssna på Settings-länken
document.querySelector('#settings').addEventListener('click', () => {
  const CURRENT_KEY = localStorage.getItem('hotel_api_key');
  localStorage.setItem('hotel_api_key', prompt("API-key:", CURRENT_KEY));
});



 

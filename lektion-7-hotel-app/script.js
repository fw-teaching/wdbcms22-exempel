console.log("works")

const URL = "https://cgi.arcada.fi/~welandfr/demo/wdbcms22-exempel/api/hotel/";

async function getHotel() {
  const resp = await fetch(URL);
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
      </li>`;
  }
  document.querySelector("#bookings").innerHTML = bookings_html;

}
getHotel();

async function saveBooking() {
  const bookingData = {
    guest_id: document.querySelector('#guest').value,
    room_id: document.querySelector('#room').value,
    addinfo: document.querySelector('#addinfo').value
  }

  const resp = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  });
  const respData = await resp.json();

  getHotel();
  //console.log(bookingData);
}

document.querySelector('#save-booking').addEventListener('click', saveBooking);



 

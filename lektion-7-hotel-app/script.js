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
        ${guest.firstname} ${guest.lastname}
      </option>`;
  }
  document.querySelector("#guest").innerHTML = guests_html;

  let bookings_html = "";
  for (booking of data.bookings) {
    bookings_html += `<li>
      ${booking.datefrom}
      ${booking.guestname},
      Rum:${booking.room_id}
    </li>`;
  }
  document.querySelector("#bookings").innerHTML = bookings_html;



}
getHotel();



 

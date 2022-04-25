console.log("works")

const URL = "https://cgi.arcada.fi/~welandfr/demo/wdbcms22-exempel/api/hotel/";

async function getHotel() {
  const resp = await fetch(URL);
  const data = await resp.json();

  console.log(data.guests);

  // New school-loop och string-konkatenering:
  let guests_html = "";
  // for-of loopen loopar igenom alla element i en array
  for (guest of data.guests) {  
    // backtick-syntax är praktiskt för att bygga upp teckensträngar
    guests_html += `
      <option value="${guest.id}">
        ${guest.firstname} ${guest.lastname}
      </option>`;
  }
  
  // Old school-loop och string-konkatenering:
  guests_html = "";
  for (let i = 0; i < data.guests.length; i++) {
    guests_html += '<option value="' 
      + data.guests[i].id + '">' 
      + data.guests[i].firstname
      + ' '
      + data.guests[i].lastname
      + '</option>';
  }

  document.querySelector("#guest").innerHTML = guests_html;
}
getHotel();



 

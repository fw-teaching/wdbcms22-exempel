const IP_URL = "https://cgi.arcada.fi/~welandfr/demo/wdbcms22-exempel/lektion-1/api/ip/";
//const IP_URL = "https://fw-teaching.fi/ip";

/* Pre-ES6 JavaScript XHR */
function getXHR(URL) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            respBody = JSON.parse(this.responseText);
            // { "ip": "193.bla.bla.bla."}
            document.querySelector("#ip-1").innerText = respBody.ip;
        }
    }
    xhttp.open("GET", URL, true);
    xhttp.send();
}

/* jQuery */
function getjQuery(URL) {
 // $.get(URL, function(data) {
    $.get(URL, (data) => {
        document.querySelector("#ip-2").innerText = data.ip;
    });
}

/* Promise-based fetch() med .then */
function getThen(URL) {
    fetch(URL)
        .then(resp => resp.json())
        .then(data => {
            document.querySelector("#ip-3").innerText = data.ip;
        })
}

/* Promise-based fetch() med async/await */
async function getAsyncAwait(URL) {
    const resp = await fetch(URL);
    const data = await resp.json();

    document.querySelector("#ip-4").innerText = data.ip;
}

getXHR(IP_URL);
getjQuery(IP_URL);
getThen(IP_URL);
getAsyncAwait(IP_URL);
<?php

require_once("../../../../../local/hotel_config.php");

try {
  $conn_string = "pgsql:host=".$db_conf['host'].";port=5432;dbname=".$db_conf['dbname'];
  // pgsql:host=128.214.253.167;port=5432;dbname=woqkeycs

  $pdo = new PDO($conn_string, 
    $db_conf['user'], $db_conf['password'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
  //echo "Connection works!";

} catch (PDOException $e) {
  die($e->getMessage());
}

// Berätta år browsern att vi tänker skicka JSON-data
header("Content-Type: application/json");
// Vi plockar ut variablerna från URLen och sparar i $request_vars
parse_str($_SERVER['QUERY_STRING'], $request_vars); // ==> ARRAY

// vi plockar ut data från request-bodyn 
$request_json = file_get_contents('php://input');
$request_body = json_decode($request_json); // ==> OBJEKT
// Vi kan casta (byta datatyp) från objekt till array så här: 
$request_body_arr = (array) $request_body;
// Alla headers
$req_headers = getallheaders();

// Vår response först som en PHP-array
$response = [
  "bookings" => [], 
  "guests" => [],
  "conf" => $db_conf["hello"]
];

// Här kollar vi att alla requests som inte är GET har valid API_key, annars exit.
// $api_key får sitt värde i hotel_config.php!
if ($_SERVER['REQUEST_METHOD'] != "GET" 
    && (!isset($req_headers['x-api-key']) || $req_headers['x-api-key'] != $api_key)
  ) {

    echo json_encode(["msg" => "BAD KEY"]);
    exit();
}
/**
 * GET specifik bokning
 */
if ($_SERVER['REQUEST_METHOD'] == "GET" && isset($request_vars['id'])) {

  //$response['msg'] = "UPDATE booking " . $request_vars['id'];
  $stmt = $pdo->prepare("SELECT * FROM hotel_booking WHERE id = :id"); 
  $stmt->execute([':id' => $request_vars['id']]);
  $response = $stmt->fetch(PDO::FETCH_ASSOC);

/**
 * GET: hämta gäster och bokningar
 */
} else if ($_SERVER['REQUEST_METHOD'] == "GET") {
  
  // Hämta alla gäster
  $stmt = $pdo->prepare("SELECT 
    *,
    (SELECT 
      count(*) FROM hotel_booking 
      WHERE guest_id = hotel_guest.id) AS bookings_count
    FROM hotel_guest
    ORDER BY lastname
  ");
  $stmt->execute();
  $response['guests'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // Hämta alla bokningar med namn!
  $stmt = $pdo->prepare("SELECT  
    b.*,
    g.firstname,
    g.lastname,
    g.firstname || ' ' || g.lastname AS guestname
    /* dubbel-pipe || konkatenerar teckensträngar i PostgreSQL */
  FROM 
    hotel_booking b
  INNER JOIN hotel_guest g ON
    b.guest_id = g.id");

  $stmt->execute();
  $response['bookings'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

/**
 * POST: skapa ny bokning
 */
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {

  try {
    $stmt = $pdo->prepare("INSERT INTO hotel_booking (
      guest_id,
      room_id,
      addinfo,
      dateto,
      datefrom
    ) VALUES (
      :guest_id,
      :room_id,
      :addinfo,
      :datefrom, -- För enkelhetens skull samma datum på båda
      :datefrom  -- För enkelhetens skull samma datum på båda
    )");
    $stmt->execute([
      ":guest_id" => $request_body->guest_id,
      ":room_id" => $request_body->room_id,
      ":addinfo" => strip_tags($request_body->addinfo),
      ":datefrom" => $request_body->datefrom
    ]);

    $response = [
      "msg" => "booking saved!",
      "body" => $request_body
    ];

  } catch (Exception $e) {
    $response = [ "error" => $e ];
  }

/**
 * DELETE: radera bokning
 */  
} else if ($_SERVER['REQUEST_METHOD'] == 'DELETE' && isset($request_vars['id'])) {

  try {
    $stmt = $pdo->prepare("DELETE FROM 
      hotel_booking 
    WHERE id = :id"); // OBS: glöm aldrig WHERE i DELETE och UPDATE!!
    
    $stmt->execute([":id" => $request_vars['id']]);
    $response = [ "msg" => "DELETED booking " . $request_vars['id']];

  } catch (Exception $e) {
    $response = [ "error" => $e ];
  }
  
} else if ($_SERVER['REQUEST_METHOD'] == 'PUT' && isset($request_vars['id'])) {

  try {
    $stmt = $pdo->prepare("UPDATE hotel_booking SET 

      guest_id = :guest_id,
      room_id = :room_id,
      addinfo = :addinfo,
      dateto = :datefrom,
      datefrom = :datefrom
    WHERE id = :id");

  $stmt->execute([
    ":guest_id" => $request_body->guest_id,
    ":room_id" => $request_body->room_id,
    ":addinfo" => strip_tags($request_body->addinfo),
    ":datefrom" => $request_body->datefrom,
    ":id" => $request_vars['id']
  ]);

  } catch (Exception $e) {
    $response = [ "error" => $e ];
  }

  $response = ['Updated rows' => $stmt->rowCount()];


}

// Omvandla PHP-arrayen till JSON och skriv ut
echo json_encode($response);





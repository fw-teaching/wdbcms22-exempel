<?php

    require_once("../../../../../local/hotel_config.php");

    // LÄXA: Skapa pdo-connection till postgresql här!
    $pdo = null;


    // Berätta år browsern att vi tänker skicka JSON-data
    header("Content-Type: application/json");

    // Vi plockar ut variablerna från URLen och sparar i $request_vars
    parse_str($_SERVER['QUERY_STRING'], $request_vars); // ==> ARRAY

    // vi plockar ut data från request-bodyn 
    $request_json = file_get_contents('php://input');
    $request_body = json_decode($request_json); // ==> OBJEKT
    // Vi kan casta (byta datatyp) från objekt till array så här: 
    $request_body_arr = (array) $request_body;

    // Vår response först som en PHP-array
    $response = [
      "bookings" => [], 
      "guests" => [],
      "conf" => $hello
    ];


    // Omvandla PHP-arrayen till JSON och skriv ut
    echo json_encode($response);





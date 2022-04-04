<?php
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
        "METHOD" => $_SERVER['REQUEST_METHOD'],
        "msg" => "Methodtest!",
        "raw_query_string" => $_SERVER['QUERY_STRING'],
        "request_vars" => $request_vars,
        "request_body" => $request_body
    ];

    if (!isset($request_vars['key']) || $request_vars['key'] != "abc123") {
        $response = [ 'error' => 'ACCESS DENIED!!!!' ];
    }

    if ($_SERVER['REQUEST_METHOD'] == "POST") {

        $response = [
            "METHOD" => $_SERVER['REQUEST_METHOD'],
            //"msq" => "Welcome " . $request_body->firstname
            "Welcome " => $request_body->firstname . " " . $request_body_arr['lastname'],
            "request_body" => $request_body,
            "status" => "Booking done, " . $request_body->firstname
        ];

        // Spara bokningen i databasen!
    }

    // Omvandla PHP-arrayen till JSON och skriv ut
    echo json_encode($response);


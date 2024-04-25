<?php

$eventID = "";

if (isset($_GET['eventID'])) {
    $eventID = $_GET['eventID'];
} else {
    $eventID = "Could not find game date";
    exit();
}

try {
    require "../dbConnect.php";
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT event_begin_date, event_end_date FROM gpgp_event WHERE event_id=:eventID";

    $stmt = $conn->prepare("$sql");
    $stmt->bindParam(':eventID', $eventID);
    $stmt->execute();

    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $row = $stmt->fetch();

    $gameDates = [$row['event_begin_date'], $row['event_end_date']];
    $gameDatesJSON = json_encode($gameDates);
    echo $gameDatesJSON;
    $conn = null;
} catch (PDOException $e) {
    echo $e;
}
?>
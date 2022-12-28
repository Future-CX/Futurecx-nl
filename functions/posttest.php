<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
  	$date = date('m/d/Y h:i:s a', time());
	
	$headers = "MIME-Version: 1.0" . "\r\n"; 
	$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n"; 
	// Additional headers 
	$headers .= 'From: Future CX<webmaster@futurecx.nl>' . "\r\n"; 
	//$headers .= 'Cc: welcome@example.com' . "\r\n"; 
	//$headers .= 'Bcc: welcome2@example.com' . "\r\n"; 
	
	$to      = 'm.van.deel@futurecx.nl';
    $subject = 'PostTest at ' . $date;
    
	$message = '<html><head><title>Future CX Post Test</title></head><body>';
	
	$message .= '<h2>POST PARAMETERS</h2>';
	
	foreach ($_POST as $key => $value) {
        $message .= "<tr>";
        $message .= "<td>";
        $message .= $key;
        $message .= "</td>";
        $message .= "<td>";
        $message .= $value;
        $message .= "</td>";
        $message .= "</tr>";
    }
	
	$message .= '<h2>JSON BODY</h2>';
	
	
	$data = json_decode(file_get_contents('php://input'), true);
	
	$message .= "<pre>";
	
	$message .= json_encode($data, JSON_PRETTY_PRINT);
	
	$message .= "</pre>";
	
	
	
    $message .= "</body></html>";

    mail($to, $subject, $message, $headers);
	
	
	
	
	
  
} else {
	print_r($_SERVER["REQUEST_METHOD"]);
}
?>
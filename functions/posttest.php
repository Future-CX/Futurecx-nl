<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  
  	$date = date('m/d/Y h:i:s a', time());
	
	$headers = 'From: webmaster@futurecx.nl'       . "\r\n" .
                 'Reply-To: webmaster@futurecx.nl' . "\r\n" .
					 'X-Mailer: PHP/' . phpversion();
	$to      = 'm.van.deel@futurecx.nl';
    $subject = 'PostTest at ' + $date;
    $message = '';
	
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
    

    mail($to, $subject, $message, $headers);
	
	
	
	
	
  
}
?>
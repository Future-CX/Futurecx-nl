<?php
// IMPORTANT: This must match your app's custom scheme callback
$appCallback = 'mycrm://linkedin/callback';

// Preserve the original query string from LinkedIn (code, state, error params)
$query = $_SERVER['QUERY_STRING'] ?? '';

// Build the redirect location
$location = $appCallback . ($query ? ('?' . $query) : '');

// Optional: Basic safety checks (e.g., ensure 'state' is present)
// if (!isset($_GET['state'])) {
//     // You can choose to handle this differently (e.g., show an error page)
//     header('HTTP/1.1 400 Bad Request');
//     echo 'Missing state';
//     exit;
// }

// Issue the redirect
header('Location: ' . $location, true, 302);
exit;
<?php
// logout.php

session_start(); // Start the session

// Unset all session variables
session_unset();

// Destroy the session
session_destroy();

// Optionally, you can redirect the user to the login page
echo "Logout successful";
?>

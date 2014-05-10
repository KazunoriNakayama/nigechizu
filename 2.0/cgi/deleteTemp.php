<?php
	//cgi to insert to 'main' table
	
	require_once 'login.php';
	
	//connect to SQL
	$dbM_server=mysql_connect($dbM_host,$dbM_username,$dbM_password);
	if(!$dbM_server) die("Unable to connect to MySQL" . mysql_error());
	
	//select the database
	mysql_select_db($dbM_db) or die("Unable to select database" . mysql_error());
	
	$query = "TRUNCATE TABLE ".$dbM_tableTemp.";";
	
	if(!mysql_query($query,$dbM_server)) echo "TRUNCATE failed ;(";

	/*
	if($_POST['data']!=""){
		$query = "DELETE TABLE temp";
	}
	*/
	
	if(!mysql_query($query,$dbM_server)) echo "TRUNCATE failed ;(";
		
	//close the database
	mysql_close($dbM_server);
	
	echo "terminated successfully...(deleted data in table 'temp')";
	
?>
<?php
	require_once 'login.php';
	
	//connect to SQL
	$dbM_server=mysql_connect($dbM_host,$dbM_username,$dbM_password);
	if(!$dbM_server) die("Unable to connect to MySQL" . mysql_error());
	
	//select the database
	mysql_select_db($dbM_db) or die("Unable to select database" . mysql_error());

	//fetch data
	$query="SELECT * FROM ".$dbM_tableMain.";";
	$result=mysql_query($query);
	if(!$result) die("Database access failed. :" .mysql_error());
	
	$data=array();
	while ($row=mysql_fetch_row($result)) {
		array_push($data, $row);
	}
	
	echo json_encode($data);
	//close the database
	mysql_close($dbM_server);
?>
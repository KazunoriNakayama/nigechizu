<?php
	//cgi to insert to 'main' table
	
	require_once 'login.php';
	
	//connect to SQL
	$dbM_server=mysql_connect($dbM_host,$dbM_username,$dbM_password);
	if(!$dbM_server) die("Unable to connect to MySQL" . mysql_error());
	
	//select the database
	mysql_select_db($dbM_db) or die("Unable to select database" . mysql_error());
	
	//INSERT!! HARDCODING...
	//$query = "INSERT INTO main VALUES".
	//		"(NULL,NULL,'testfromphp',10,10,10,10.0,20.0,20.0,20.0,20.0,30.0,30.0,30.0,30.0)";
	
	//INSERT!! abit of variables
	
	$query = "INSERT INTO ".$dbM_tableMain." VALUES".
			"(NULL,NULL,"."'".$_POST['operations']."'".",".
			$_POST['results00'].",".
			$_POST['results01'].",".
			$_POST['results02'].",".
			$_POST['results03'].",".
			$_POST['results10'].",".
			$_POST['results11'].",".
			$_POST['results12'].",".
			$_POST['results13'].",".
			$_POST['results20'].",".
			$_POST['results21'].",".
			$_POST['results22'].",".
			$_POST['results23'].
			");";
	//$query = "INSERT INTO main VALUES".
	//		"(NULL,NULL,'testfromphp',10,10,10,10.0,20.0,20.0,20.0,20.0,30.0,30.0,30.0,30.0)";
	if(!mysql_query($query,$dbM_server)) echo "INSERT failed ;(";
		
	//close the database
	mysql_close($dbM_server);
	
	echo "terminated successfully...";
	
?>
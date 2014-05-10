<?php
	require_once 'login.php';
	
	//connect to SQL
	$dbM_server=mysql_connect($dbM_host,$dbM_username,$dbM_password);
	if(!$dbM_server) die("Unable to connect to MySQL" . mysql_error());
	
	//select the database
	mysql_select_db($dbM_db) or die("Unable to select database" . mysql_error());

	//fetch data
	$query="SELECT * FROM ".$dbM_tableTemp.";";
	$result=mysql_query($query);
	if(!$result) die("Database access failed:" . mysql_error());
	
	$length = mysql_num_rows($result);
	$datetime=array();
	$data=array();
	$stat=array();
	while ($row=mysql_fetch_row($result)){
		array_push($datetime, $row[0]);
		array_push($data, $row[1]);
		array_push($stat, $row[2]);
	}
	
	echo json_encode(array("length"=>$length,"datetime"=>$datetime,"data"=>$data,"stat"=>$stat));
	
	mysql_close($dbM_server);
?>
<?php

$filename="../log/".$_POST['filename'].".csv";
if($FP = fopen($filename, "a+")){
	flock($FP, LOCK_EX);
	$csv=fgetcsv($FP);
	//print_r(array_values($csv));
	$add_data = array($_POST['data'], $_POST['start'], $_POST['end'], $_POST['M29'], $_POST['S08'], $_POST['S35'], $_POST['H23']);
	if(!fputcsv($FP, $add_data)){
		// "<br>書込に失敗しました";
	}else{
		//echo "<br>データを書込ました";
	}
	flock($FP, LOCK_UN);
	fclose($FP);
}else{
	//echo "fopen error";
}

?>

	
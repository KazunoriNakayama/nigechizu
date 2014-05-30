//WebGLの使用可否判定
if( ! Detector.webgl ){
	Detector.addGetWebGLMessage();
	document.getElementById( 'container' ).innerHTML = "";
}

//
// variables
//

var container, textbox, visualize;
var canvasW, canvasH;
var camera, scene, renderer, controls;
var radius, radifov, angleXY, angleZ;
var meshW, meshH, gridU, gridV, gridUPitch, gridVPitch;
var nodeLen, pathLen, projector;
var selectNode, pSelectNode, chooseNode, pChooseNode, addPathS, addPathE;
var mouse;
var Nodes, Pathes, DistMaps, pDistMaps, MeshVeres;
var mesh, pPoints, pLines, TLine;
var meshGeo, network, network3D, network3D_ORG;
var colorSetted, setTower, setRoad, resetFLG, updateFLG, firstInput, isAnimate, inputData, resetData, updateGraph, viewLogFLG, showAllLog;
var defNodeColor, goalNodeColor, selectNodeColor, chooseNodeColor, defColorPitch;
var tData, THeight;
var keyInput, TMode;
var threshold, limitMin, limitSec;
var base, scale;
var TEras = [ 'M29', 'S08', 'S35', 'H23' ];
var initialSafeNodes,initialEvacLength;
var totalSafeNodes, totalEvacLength, totalAddCost, totalAddLength, totalAddTower;
var timeNow, timePrev, timer, AnimateTimer, operationStatus, durationPitch, animationPitch, dbTimeStamp;
var inputTower, inputPath, addTower, addRoad;
var displayData;
var camMode, rankingMode;

//送信用データ
var operations, results;

	init();
	animate();


//初期設定
function init(){

//HTML上の表示位置をコンテナに登録
	container = document.getElementById( 'container' );
	visualize = document.getElementById( 'visualize' );
//テキストコンソールの表示位置登録
	textbox = document.getElementById( 'text' );

	container.innerHTML = "";
	visualize.innerHTML = "";
	textbox.innerHTML = "";

//キャンバスサイズ、メッシュサイズ、メッシュ分割数設定

	//canvasW = 1024, canvasH = 768;
	canvasW = window.innerWidth, canvasH=window.innerHeight;
	meshW = 1800, meshH = 1800;
	gridU = 72, gridV = 72;
	gridUPitch = meshW/gridU, gridVPitch = meshH/gridV;
	THeight = [ 5, 3, 2, 12 ];
	base = { x: -meshW/2, y: -meshH/2, z: 150 };
	scale = { x: 1, y: 1, z: 5 };
	mouse = { x: -1, y: -1 };
	timeNow = new Date().getTime();
	timePrev = timeNow;

	$( '#slider' ).css( 'width', window.innerWidth-20 );
	viewLog();

//カメラの基準距離設定
	radifov = 110000
	radius = 5000;
	angleXY = Math.PI*3/2;
	angleZ = Math.PI/2;
	selectNode = -1;
	pSelectNode = -1;
	chooseNode = -1;
	pChooseNode = -1;
	addPathS = -1;
	addPathE = -1;
	colorSetted = false;
	setTower = false;
	setRoad = false;
	resetFLG = false;
	updateFLG = true;
	isAnimate = true;
	resetData = false;
	inputData = false;
	firstInput = true;
	updateGraph = true;
	viewLogFLG = false;
	showAllLog = false;
	TMode = 4;
	keyInput = TMode;
	limitMin=5;
	limitSec=0;
	threshold = limitMin*40+limitSec*40/60;
	camMode = 0;
	rankingMode = 0;
	displayData = [];

	defNodeColor = 0x660000;
	goalNodeColor = 0xff0000;
	selectNodeColor = 0x0000ff;
	chooseNodeColor = 0xffff00;

//シーンの設定
	scene = new THREE.Scene();

//カメラの用意とシーンへの登録
	camera = new THREE.PerspectiveCamera( radifov/radius, canvasW/canvasH, 50, 1e7 );
	camera.position.z = radius;
	scene.add( camera );

	projector = new THREE.Projector();

//レンダラーの用意
	renderer = new THREE.WebGLRenderer( { antialias:true, clearAlpha:1 } );
	renderer.setSize( canvasW, canvasH );
	renderer.domElement.style.position = 'relative';
	renderer.autoClear = false;

//レンダラーをコンテナに登録
	container.appendChild( renderer.domElement );

//カメラコントローラの設定
	controls = new THREE.RhinishControls( camera, renderer.domElement );

	//controls.radius = radius/20;
	controls.rotateSpeed = 0.5;
	controls.zoomSpeed = 0.8;
	controls.panSpeed = 0.12;
	controls.dynamicDampingFactor = 0.3;
	controls.minDistance = radius * 0.4;
	controls.maxDistance = radius * 20;
	controls.keys = [ 16, 17, 32 ];
	//controls.rotateSpeed = 1.0;//controls.zoomSpeed = 1.2;//controls.panSpeed = 0.3;//controls.noRotate = false;//controls.noZoom = false;//controls.noPan = false;//controls.staticMoving = false;

//光源の設定と登録

	scene.add(new THREE.AmbientLight(0x111111));

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 0, 1 ).normalize();
	scene.add(light);

//計算用ネットワークグラフの用意
	networkGraph();

//3D表示用ネットワークグラフの用意
	networkGraph3D();

//3D図形の用意と登録
	setGeometory();

	resetNodeColor( network3D.Nodes );
	resetPathColor( network3D.Pathes );
	//ダイクストラ法による経路距離計算
	network3D.setDistmap( network3D.isDistmap() );
	DistMaps = network3D.Distmap[ TEras[ TMode-1 ] ];
	changePathColor( network3D.Pathes );

	initialSafeNodes = 0;
	initialEvacLength = 0;
	totalAddCost = 0;
	totalAddLength = 0;
	totalAddTower = 0;
	for( var i = 0; i < DistMaps.length; i++ ){
		initialEvacLength += DistMaps[ i ];
		if( threshold > DistMaps[ i ] )initialSafeNodes++;
	}
	
	updateDisplay( initialSafeNodes, initialEvacLength, totalAddCost,0 , 0 );

	renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'keydown', onKeyDown, false );

	camera.updateProjectionMatrix();

//送信用データの初期化
	operations = [];
	results = [12];

//タイマーと操作ステータスの初期化
	timeNow = new Date().getTime();
	timePrev = timeNow;
	durationPitch = 0.2; //seconds
	animationPitch = 60;
	timer = 0;
	AnimateTimer = 0
	operationStatus = -1;
	dbTimeStamp = "";
	inputTower = [];
	inputPath = [];
	addTower = [];
	addRoad = [];
}

function onKeyDown( event ){

	switch( event.keyCode ){
		case 49: //1 
			keyInput = 1;
			break;
		case 50: //2 
			keyInput = 2;
			break;
		case 51: //3 
			keyInput = 3;
			break;
		case 52: //4 
			keyInput = 4;
			break;
		case 57: //9 
			textbox.innerHTML = "("+camera.position.x+","+camera.position.y+","+camera.position.z+")";
			break;
	}

	switch( event.keyCode ){
		case 37: //← 
			rankingMode--;
			if( rankingMode < 0 )rankingMode = 3;
			//console.log( rankingMode );
			updateRanking( displayData )
			break;
		case 39: //→ 
			rankingMode++;
			if( rankingMode > 3 )rankingMode = 0;
			//console.log( rankingMode );
			updateRanking( displayData )
			break;
		case 65: //a 
			if( isAnimate )isAnimate = false;
			else isAnimate = true;
			break;
		case 67: //c 
			camMode++;
			if( camMode > 1 )camMode = 0;
			break;
		case 76: //l 
			if( viewLogFLG )viewLogFLG = false;
			else viewLogFLG = true;
			viewLog();
			break;
		case 82: //r 
			resetData = true;
			break;
		case 83: //s 
			if( viewLogFLG ){
				if( showAllLog )showAllLog = false;
				else showAllLog = true;
			}
			break;
		case 84: //t 
			setTower = true;
			if( selectNode > -1 )addTower.push( selectNode );
			break;
	}

}

function onDocumentMouseMove( event ){

	event.preventDefault;

	if( event.clientX <= canvasW && event.clientY <= canvasH ){
		mouse.x = ( event.clientX/canvasW )*2-1;
		mouse.y = -( event.clientY/canvasH )*2+1;
	}else{
		mouse.x = -1;
		mouse.y = -1;
	}

	var IntNodes = [];
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );
	vector = new THREE.Vector3().subVectors( vector, camera.position ).normalize();
	for( i = 0; i < network3D.Nodes.length; i++ ){
		var point = network3D.Nodes[ i ].position.clone();
		point.x = point.x*scale.x+base.x;
		point.y = point.y*scale.y+base.y;
		point.z = point.z*scale.z+base.z+1;
		var IntPoints = [];
		if( distPointLine( point, camera.position, vector ) < 10 ){
			IntPoints =  [ i, Math.sqrt( Math.pow( point.x-camera.position.x, 2 )+
						     Math.pow( point.y-camera.position.y, 2 )+
						     Math.pow( point.z-camera.position.z, 2 ) ) ];
		}
		if( IntPoints.length > 0 ){
			IntNodes.push( IntPoints );
		}
	}

	if( IntNodes.length > 0 ){
		IntNodes.sort( function( a, b ){ return a[ 1 ]-b[ 1 ]; } );
		selectNode = IntNodes[ 0 ][ 0 ];
		container.style.cursor = 'pointer';
	}else{
		selectNode = -1;
		container.style.cursor = 'auto';
	}

}

function onDocumentMouseDown( event ){

	event.preventDefault;

}

function onDocumentMouseUp( event ){

	event.preventDefault;

	if( event.button == 0 ){
		if( selectNode > -1 ){
			pChooseNode = selectNode;
			container.style.cursor = 'move';
		}
		if( pChooseNode > -1 ) chooseNode = pChooseNode;
		else chooseNode = -1;
	}
	container.style.cursor = 'auto';

}

//アニメーション
function animate(){

	textbox.innerHTML = "";
	//visualize.innerHTML = "";

	timePrev = timeNow;
	timeNow = new Date().getTime();

	timer += timeNow - timePrev;
	if( !isAnimate )AnimateTimer += timeNow - timePrev;
	else AnimateTimer = 0;
	if( timer > durationPitch*1000 ){
		//visualize.innerHTML += AnimateTimer+"<br>";
		//look at temp;
		var numData, dateTime, stringData;
		$.ajax({
			type: "post",
			dataType : 'html',
			url: "./cgi/selectTemp.php",
			data: "",
			success: function( receivedData ){
				var data = JSON.parse( receivedData );
				if( data[ 'length' ] == 0 ){
					
				}else{
					dateTime = data[ 'datetime' ][ data[ 'length' ]-1 ];
					if( dbTimeStamp == "" || dbTimeStamp != dateTime ){
						dbTimeStamp = dateTime;
						if( data[ 'stat' ][ data[ 'length' ]-1 ] == "0" ){
							var decoded = JSON.parse( data[ 'data' ][ data[ 'length' ]-1 ] );
							inputTower = decoded [ 'tower' ];
							inputPath = decoded[ 'line' ];
							inputData = true;
						}else if( data[ 'stat' ][ data[ 'length' ]-1 ] == "1" ){
							resetData = true;
						}
					}
				}
			}
		});
		timer = 0;
	}

	if( inputData ){
		AnimateTimer = 0;
		isAnimate = false;
		//visualize.innerHTML += "tower.length: "+inputTower.length+"<br>";
		if( inputTower.length > 0 ){
			for( var i = 0; i < inputTower.length; i++ ){
				var _twIndex = searchNode( network3D.Nodes, new THREE.Vector3( inputTower[ i ][ 0 ], inputTower[ i ][ 1 ], 0 ) );
				if( _twIndex >= 0 ){
					//visualize.innerHTML += _twIndex+"<br>";
					addTower.push( _twIndex );
				}
			}
			resetFLG = true;
			setTower = true;
		}
		//visualize.innerHTML += "path.length: "+inputPath.length+"<br>";
		if( inputPath.length > 0 ){
			for( var i = 0; i < inputPath.length; i++ ){
				var _rsIndex = searchNode( network3D.Nodes, new THREE.Vector3( inputPath[ i ][ 0 ][ 0 ], inputPath[ i ][ 0 ][ 1 ], 0 ) );
				var _reIndex = searchNode( network3D.Nodes, new THREE.Vector3( inputPath[ i ][ 1 ][ 0 ], inputPath[ i ][ 1 ][ 1 ], 0 ) );
				if( _rsIndex >= 0 && _reIndex >= 0 ){
					//visualize.innerHTML += _rsIndex+", "+_reIndex+"<br>";
					addRoad.push( [ _rsIndex, _reIndex ] );
				}
			}
			resetFLG = true;
			setRoad = true;
		}
		operations.push( { tower : addTower, line : addRoad } );
		inputTower = [];
		inputPath = [];
		inputData = false;
	}

	if( resetData ){
		AnimateTimer = 0;
		isAnimate = false;
		resetFLG = true;
		inputTower = [];
		inputPath = [];

		var totalDist = 0;
		var saveCount = 0;
		for( var i = 0; i < network3D.Distmap.M29.length; i++ ){
			if( network3D.Nodes[ i ].onGround ){
				totalDist += network3D.Distmap.M29[ i ];
				if( threshold > network3D.Distmap.M29[ i ] )saveCount++;
			}
		}
		totalDist = 0;
		saveCount = 0;
		results[ 0 ] = saveCount;
		results[ 4 ] = totalDist;
		for( var i = 0; i < network3D.Distmap.S08.length; i++ ){
			if( network3D.Nodes[ i ].onGround ){
				totalDist += network3D.Distmap.S08[ i ];
				if( threshold > network3D.Distmap.S08[ i ] )saveCount++;
			}
		}
		totalDist = 0;
		saveCount = 0;
		results[ 1 ] = saveCount;
		results[ 5 ] = totalDist;
		for( var i = 0; i < network3D.Distmap.S35.length; i++ ){
			if( network3D.Nodes[ i ].onGround ){
				totalDist += network3D.Distmap.S35[ i ];
				if( threshold > network3D.Distmap.S35[ i ] )saveCount++;
			}
		}
		totalDist = 0;
		saveCount = 0;
		results[ 2 ] = saveCount;
		results[ 6 ] = totalDist;
		for( var i = 0; i < network3D.Distmap.H23.length; i++ ){
			if( network3D.Nodes[ i ].onGround ){
				totalDist += network3D.Distmap.H23[ i ];
				if( threshold > network3D.Distmap.H23[ i ] )saveCount++;
			}
		}
		results[ 3 ] = saveCount;
		results[ 7 ] = totalDist;
		results[ 8 ] = totalAddCost;
		results[ 9 ] = totalAddCost;
		results[ 10 ] = totalAddCost;
		results[ 11 ] = totalAddCost;
		var data={
			id : "NULL",
			datetime: "NULL",
			operations: JSON.stringify( operations ),
			results00 : results[ 0 ],
			results01 : results[ 1 ],
			results02 : results[ 2 ],
			results03 : results[ 3 ],
			results10 : results[ 4 ],
			results11 : results[ 5 ],
			results12 : results[ 6 ],
			results13 : results[ 7 ],
			results20 : results[ 8 ],
			results21 : results[ 9 ],
			results22 : results[ 10 ],
			results23 : results[ 11 ]
		};
		$.ajax({
			type: "post",
			dataType : 'html',
			url: "./cgi/insertMain.php",
			data: data,
			success: function() {
				updateGraph = true;
				return false;
			}
		});
		operations = [];
		results = [];

		resetData = false;
	}

	if( updateGraph ){
		updateGraph = false;
		$.ajax({
			type: "post",
			dataType : 'html',
			url: "./cgi/selectMain.php",
			data: data,
			success: function( receivedData ) {
				var decoded = JSON.parse( receivedData );
				if( decoded.length > 0 ){
					displayData = [];
					for( var i = 0; i < decoded.length; i++ ){
						if( decoded[ i ].length > 0 ){
							var controllog;
							try{
								var controllog = JSON.parse( decoded[ i ][ 2 ] );
							}catch( e ){
								;
							}
							if( typeof controllog === "undefined" ){
								
							}else{
								displayData.push( [ 
									decoded[ i ][ 0 ], 
									decoded[ i ][ 1 ], 
									controllog, 
									decoded[ i ][ 6 ], 
									decoded[ i ][ 10 ], 
									decoded[ i ][ 14 ] 
								] );
							}
						}
					}
					$( '#slider' ).slider( "option", "max", displayData.length-1 );
					drawConsole( displayData );
				}
			}
		});
	}

	if( AnimateTimer > animationPitch*1000 ){
		isAnimate = true;
		AnimateTimer = 0;
	}

	requestAnimationFrame( animate );
	render();

}

//レンダラー
function render(){

	if( TMode != keyInput ){
		TMode = keyInput;
		for( var i = 0; i < TLine.length; i++){
			for( var j = 0; j < TLine[ i ].length; j++){
				if( TMode == i+1 )TLine[ i ][ j ].material.opacity = 1.0;
				else TLine[ i ][ j ].material.opacity = 0.0;
			}
		}
		resetNodeColor();
		//ダイクストラ法による経路距離計算
		network3D.setDistmap( network3D.isDistmap() );
		DistMaps = network3D.Distmap[ TEras[ TMode-1 ] ];
		//パスの表示色変更
		changePathColor( network3D.Pathes );
		colorSetted = false;
	}

	if( selectNode > -1 ){
		var vector = network3D.Nodes[ selectNode ].position.clone();
		vector.x = vector.x*scale.x+base.x;
		vector.y = vector.y*scale.y+base.y;
		vector.z = vector.z*scale.z+base.z+1;
		vector = projector.projectVector( vector, camera );
		vector.x = ~~( canvasW/2+canvasW*vector.x/2 );
		vector.y = ~~( canvasH/2-canvasH*vector.y/2 );
		if( DistMaps[ selectNode ] ){
			//visualize.innerHTML += visualText( vector.x+10, vector.y-30, ~~( DistMaps[ selectNode ]/40 )+"\'"+~~( ( ( DistMaps[ selectNode ]%40 )/40 )*60 )+"\"" );
		}
	}

	if( selectNode != pSelectNode ){
		if( selectNode > -1 ){
			//ノードの表示色変更
			resetNodeColor();
			changeNodeColor( selectNode, selectNodeColor );
			if( addPathS > -1 ) changeNodeColor( addPathS, chooseNodeColor );
			pSelectNode = selectNode;
		}
	}

//経路距離計算とそれによる表示色の変更
	//今回選択されたノードが前回選択されたノードと違っていたら
	if( chooseNode == pChooseNode ){
		//ノードが選択されていた場合
		if( chooseNode > -1 ){
			if( network3D.Nodes[ chooseNode ].onGround ){
				//ノードとパスの色を初期化する
				if( addPathS < 0 ){
					addPathS = chooseNode;
					changeNodeColor( addPathS, chooseNodeColor );
				}else if( addPathE < 0 ){
					addPathE = chooseNode;
					addRoad.push( [ addPathS, addPathE ] );
					setRoad = true;
				}
				pChooseNode = -1;
			}
		}
	}

	if( resetFLG ){
		updateFLG = true;

		$.ajax({
			type: "post",
			dataType : 'html',
			url: "./cgi/deleteTemp.php",
			data: "",
			success: function(){
				return false;
			}
		});

		network3D = network3D_ORG.clone();

		totalAddLength = 0;
		totalAddTower = 0;

		resetPoints( network3D.Nodes );
		resetPath( network3D.Pathes );

		colorSetted = false;
		isAnimate = false;
		AnimateTimer = 0;
	}

	if( setTower ){
		if( addTower.length >= 0 ){
			updateFLG = true;

			for( var i = 0; i < addTower.length; i++ ){
				var addNode = new THREE.Node( network3D.Nodes[ addTower[ i ] ].position.x, 
							      network3D.Nodes[ addTower[ i ] ].position.y, 
							      network3D.Nodes[ addTower[ i ] ].position.z+20 );
				var isExist = false;
				for( var j = 0; j < network3D.Nodes.length; j++ ){
					 if( !network3D.Nodes[ j ].onGround ){
					 	if( network3D.Nodes[ j ].distTo( addNode.position ) < 0.0000001 )isExist = true;
					 }
					 if( isExist )break;
				}
				if( !isExist ){
					addNode.onGround = false;
					network3D.addNode( addNode );
					network3D.addSafeNode( network3D.Nodes.length-1 )

					var addPath = new THREE.Path( addTower[ i ], network3D.Nodes.length-1 );
					addPath.setActive( 1 );
					addPath.setPolyline( [ network3D.Nodes[ addTower[ i ] ].position, network3D.Nodes[ network3D.Nodes.length-1 ].position ] );
					addPath.setLen( 1 );
					network3D.addPath( addPath );

					totalAddTower += 60000;
				}
			}
			addTower = [];

			resetPoints( network3D.Nodes );
			resetPath( network3D.Pathes );
		}else{
			setTower = false;
		}
	}

	if( setRoad ){
		if( addRoad.length >= 0 ){
			updateFLG = true;

			for( var i = 0; i < addRoad.length; i++ ){
				//var isExist = false;
				var isExist = 0;
				for( var j = 0; j < network3D.Pathes.length; j++ ){
					 if( network3D.Pathes[ j ].start == addRoad[ i ][ 0 ] ){
					 	//if( network3D.Pathes[ j ].end == addRoad[ i ][ 1 ] )isExist = true;
					 	if( network3D.Pathes[ j ].end == addRoad[ i ][ 1 ] )isExist += 1;
					 }
					 if( network3D.Pathes[ j ].end == addRoad[ i ][ 0 ] ){
					 	//if( network3D.Pathes[ j ].start == addRoad[ i ][ 1 ] )isExist = true;
					 	if( network3D.Pathes[ j ].start == addRoad[ i ][ 1 ] )isExist += 1;
					 }
					 //if( isExist )break;
					 if( isExist >= 2 )break;
				}
				//if( !isExist ){
				if( isExist == 0 ){
					var addPath = new THREE.Path( addRoad[ i ][ 0 ], addRoad[ i ][ 1 ] );
					addPath.setActive( 1 );
					addPath.setPolyline( [ network3D.Nodes[ addPath.start ].position, network3D.Nodes[ addPath.end ].position ] );
					addPath.projection( meshGeo );
					addPath.setLen( addPath.pathLen() );
					network3D.addPath( addPath );

					totalAddLength +=addPath.pathLen();
				}
			}
			addRoad = [];

			addPathS = -1;
			addPathE = -1;

			resetPath( network3D.Pathes );
		}else{
			setRoad = false;
		}
	}

	if( updateFLG ){
		updateFLG = false;

		network3D.setDistmap( network3D.isDistmap() );
		DistMaps = network3D.Distmap[ TEras[ TMode-1 ] ];

		var totalDist = 0;
		var saveCount = 0;
		for( var i = 0; i < DistMaps.length; i++ ){
			if( network3D.Nodes[ i ].onGround ){
				totalDist += DistMaps[ i ];
				if( threshold > DistMaps[ i ] )saveCount++;
			}
		}
		totalSafeNodes = saveCount;
		totalEvacLength = totalDist;
		totalAddCost = totalAddLength*4.0+totalAddTower;

		updateDisplay( totalSafeNodes, totalEvacLength, totalAddCost, 0, 0 );

		resetNodeColor();
		if( selectNode > -1 )changeNodeColor( selectNode, selectNodeColor );
		if( addPathS > -1 )changeNodeColor( addPathS, chooseNodeColor );

		resetPathColor( network3D.Pathes );
		changePathColor( network3D.Pathes );

		if( setTower || resetFLG )setTower = false;
		if( setRoad || resetFLG )setRoad = false;
		if( resetFLG )resetFLG = false;
	}

	switch( camMode ){
		case 0: //1 
			updateCam();
			break;
		case 1: //2 
			controls.update();
			AnimateTimer = 0;
			isAnimate = false;
			break;
	}

	drawLog( displayData, $( '#slider' ).slider( "option", "value" ) );

	camera.updateProjectionMatrix();

//レンダリング
	renderer.clear();
	renderer.setViewport( 0, 0, canvasW, canvasH );
	renderer.render( scene, camera );

}

//計算用のネットワークグラフ
function networkGraph(){

	Nodes = [], Pathes = [], DistMaps = [];

	var _tData = [ getM29(), getS08(), getS35(), getH23() ];
	tData = [];
	for( var i = 0; i<_tData.length; i++ ){
		tData[ i ] = [];
		for( var j = 0; j<_tData[ i ].length; j++ ){
			tData[ i ][ j ] = [];
			tData[ i ][ j ][ 0 ] = _tData[ i ][ j ][ 0 ];
			tData[ i ][ j ][ 1 ] = [];
			for( var k = 0; k < _tData[ i ][ j ][ 1 ].length+1; k++ ){
				tData[ i ][ j ][ 1 ].push( new THREE.Vector3( _tData[ i ][ j ][ 1 ][ k%_tData[ i ][ j ][ 1 ].length ][ 0 ], 
									      _tData[ i ][ j ][ 1 ][ k%_tData[ i ][ j ][ 1 ].length ][ 1 ], 
									      _tData[ i ][ j ][ 1 ][ k%_tData[ i ][ j ][ 1 ].length ][ 2 ] ) );
			}
		}
	}

//ノード座標の読み込み
	Nodes = getNode();
	nodeLen = Nodes.length;

//パスの読み込み
	Pathes = getPath();
	pathLen = Pathes.length;

//ネットワークグラフの作成
	network = new THREE.Network( Nodes, Pathes );

//ネットワークへの津波安全フラグの登録
	network.setSafe( tData );

}

//計算用のネットワークグラフ
function networkGraph3D(){

//地形データの読み込み
	MeshVeres = getGeo();
	meshGeo = new THREE.GeoMesh( MeshVeres, gridU, gridV );

//地形データのへのネットワークの投影
	network3D_ORG = network.clone();
	network3D_ORG.projection( meshGeo );
	network3D_ORG.updatePathLen();
//ネットワークの初期状態保存
	network3D = network3D_ORG.clone();

}

//図形の登録
function setGeometory(){

//3Dの地形ジオメトリー作成
	//テクスチャの地形ジオメトリ作成

	var geoTexture = THREE.ImageUtils.loadTexture( "./img/evacMap_rendered00.png" );
	mesh = new THREE.SceneUtils.createMultiMaterialObject( new THREE.PlaneGeometry( meshW, meshH, gridU+2, gridV+2 ), 
							     [ new THREE.MeshBasicMaterial( { color: 0xffffff, map: geoTexture, side: THREE.DoubleSide } ) ] 
							     );

	//3Dの地形ジオメトリーの原点への移動
	for( var i = 0; i < mesh.children.length; i++ ){
		mesh.children[ i ].doubleSided = true;
		for( var j = 0; j < mesh.children[ i ].geometry.vertices.length; j++ ){
			//mesh.children[ i ].geometry.vertices[ j ].position.x = base.x;
			//mesh.children[ i ].geometry.vertices[ j ].position.y = base.y;
			//mesh.children[ i ].geometry.vertices[ j ].position.z = base.z;
			mesh.children[ i ].geometry.vertices[ j ].x = base.x;
			mesh.children[ i ].geometry.vertices[ j ].y = base.y;
			mesh.children[ i ].geometry.vertices[ j ].z = base.z;
		}
	}

//3Dのノード図形の作成
	//3Dのノード図形の原点への移動
	pPoints = [];
	for( var i = 0; i < network3D.Nodes.length+20; i++ ){
		pPoints[ i ] = new THREE.Mesh( new THREE.SphereGeometry( 3, 10,10 ),
					       new THREE.MeshBasicMaterial( { color: defNodeColor, opacity: 1 } ) );
		pPoints[ i ].doubleSided = true;
		pPoints[ i ].position.x = base.x;
		pPoints[ i ].position.y = base.y;
		pPoints[ i ].position.z = base.z;
		if( i < network3D.Nodes.length )network3D.Nodes[ i ].index = i;
		scene.add( pPoints[ i ] );
	}

//3Dのパス図形の作成
	//3Dのパス図形の原点への移動
	pLines = [];
	for( var i = 0; i < network3D.Pathes.length+100; i++ ){
		var material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 1 } );
		var geometry = new THREE.Geometry();
		geometry.dynamic = true;
		for( var j = 0; j < 10; j++ ){
			geometry.vertices.push( new THREE.Vector3( base.x, base.y, base.z ) );
		}
		pLines[ i ] = new THREE.Line( geometry, material ); 
		scene.add( pLines[ i ] );
	}
	var _j = 0;
	for( var i = 0; i < network3D.Pathes.length; i++ ){
		for( var j = 0; j < ~~( network3D.Pathes[ i ].polyline.length/9 )+1; j++ ){
			network3D.Pathes[ i ].index.push( _j );
			_j++;
		}
	}

	//3Dの地形ジオメトリーの表示位置への移動
	for( var i = 0; i < mesh.children.length; i++ ){
		for( var j = 0; j < gridV+3; j++ ){
			var _j = j-1;
			if( _j < 0 )_j = 0;
			else if( _j > gridV )_j = gridV;
			for( var k = 0; k < gridU+3; k++ ){
				var _k = k-1;
				if( _k < 0 )_k = 0;
				else if( _k > gridU )_k = gridU;
				//mesh.children[ i ].geometry.vertices[ j*( gridU+3 )+k ].position.x += meshGeo.Vertices[ _j*( gridU+1 )+_k ].x*scale.x;
				//mesh.children[ i ].geometry.vertices[ j*( gridU+3 )+k ].position.y += meshGeo.Vertices[ _j*( gridU+1 )+_k ].y*scale.y;
				//if( ( j-_j == 1 ) && ( k-_k == 1 ) ) mesh.children[ i ].geometry.vertices[ j*( gridU+3 )+k ].position.z += meshGeo.Vertices[ _j*( gridU+1 )+_k ].z*scale.z;
				//else mesh.children[ i ].geometry.vertices[ j*( gridU+3 )+k ].position.z = 0;
				mesh.children[ i ].geometry.vertices[ j*( gridU+3 )+k ].x += meshGeo.Vertices[ _j*( gridU+1 )+_k ].x*scale.x;
				mesh.children[ i ].geometry.vertices[ j*( gridU+3 )+k ].y += meshGeo.Vertices[ _j*( gridU+1 )+_k ].y*scale.y;
				if( ( j-_j == 1 ) && ( k-_k == 1 ) ) mesh.children[ i ].geometry.vertices[ j*( gridU+3 )+k ].z += meshGeo.Vertices[ _j*( gridU+1 )+_k ].z*scale.z;
				else mesh.children[ i ].geometry.vertices[ j*( gridU+3 )+k ].z = 0;
			}
		}
	}
	scene.add( mesh );

	//3Dのノード図形の表示位置への移動
	for( var i = 0; i < pPoints.length; i++ ){
		if( i < network3D.Nodes.length ){
			pPoints[ i ].position.x += network3D.Nodes[ i ].position.x*scale.x;
			pPoints[ i ].position.y += network3D.Nodes[ i ].position.y*scale.y;
			pPoints[ i ].position.z += network3D.Nodes[ i ].position.z*scale.z+2;
		}else{
			pPoints[ i ].material.opacity = 0.0;
		}
	}

	//3Dのパス図形の表示位置への移動
	var _j = 0;
	for( var i = 0; i < network3D.Pathes.length; i++ ){
		for( var j = 0; j < network3D.Pathes[ i ].index.length; j++ ){
			for( var k = 0; k < pLines[ network3D.Pathes[ i ].index[ j ] ].geometry.vertices.length; k++ ){
				var _k = k+j*9;
				if( k >= network3D.Pathes[ i ].polyline.length ) _k = network3D.Pathes[ i ].polyline.length-1;
				//pLines[ network3D.Pathes[ i ].index[ j ] ].geometry.vertices[ k ].position.x += network3D.Pathes[ i ].polyline[ _k ].x*scale.x;
				//pLines[ network3D.Pathes[ i ].index[ j ] ].geometry.vertices[ k ].position.y += network3D.Pathes[ i ].polyline[ _k ].y*scale.y;
				//pLines[ network3D.Pathes[ i ].index[ j ] ].geometry.vertices[ k ].position.z += network3D.Pathes[ i ].polyline[ _k ].z*scale.z+1;
				pLines[ network3D.Pathes[ i ].index[ j ] ].geometry.vertices[ k ].x += network3D.Pathes[ i ].polyline[ _k ].x*scale.x;
				pLines[ network3D.Pathes[ i ].index[ j ] ].geometry.vertices[ k ].y += network3D.Pathes[ i ].polyline[ _k ].y*scale.y;
				pLines[ network3D.Pathes[ i ].index[ j ] ].geometry.vertices[ k ].z += network3D.Pathes[ i ].polyline[ _k ].z*scale.z+1;
			}
		}
	}

	TLine = [];

	for( var i = 0; i < tData.length ; i++ ){
		var Geometrys = [];
		for( var j = 0; j < tData[ i ].length ; j++ ){
			Geometrys[ j ] = new THREE.Geometry();
			for( var k = 0; k < tData[ i ][ j ][ 1 ].length; k++){
				Geometrys[ j ].vertices.push( new THREE.Vector3( base.x, base.y, base.z ) );
			}
		}
		var material = new THREE.LineBasicMaterial( { color: 0x0000ff, transparent: true, opacity: 1, linewidth: 1 } );
		TLine[ i ] = [];
		for( var j = 0; j < tData[ i ].length; j++ ){
			TLine[ i ][ j ] = new THREE.Line( Geometrys[ j ], material );
		}

		for( var j = 0; j < tData[ i ].length; j++ ){
			for( var k = 0; k < tData[ i ][ j ][ 1 ].length; k++){
				var prjPoint = meshGeo.projectPoint( tData[ i ][ j ][ 1 ][ k ] );
				//TLine[ i ][ j ].geometry.vertices[ k ].position.x += prjPoint.x*scale.x;
				//TLine[ i ][ j ].geometry.vertices[ k ].position.y += prjPoint.y*scale.y;
				//if( prjPoint.z == 0 )TLine[ i ][ j ].geometry.vertices[ k ].position.z += ( prjPoint.z+THeight[ i ] )*scale.z+10;
				//else TLine[ i ][ j ].geometry.vertices[ k ].position.z += prjPoint.z*scale.z+10;
				TLine[ i ][ j ].geometry.vertices[ k ].x += prjPoint.x*scale.x;
				TLine[ i ][ j ].geometry.vertices[ k ].y += prjPoint.y*scale.y;
				if( prjPoint.z == 0 )TLine[ i ][ j ].geometry.vertices[ k ].z += ( prjPoint.z+THeight[ i ] )*scale.z+10;
				else TLine[ i ][ j ].geometry.vertices[ k ].z += prjPoint.z*scale.z+10;
			}
		}

		for( var j = 0; j < tData[ i ].length; j++ ){
			if( TMode == i+1 )TLine[ i ][ j ].material.opacity = 1.0;
			else TLine[ i ][ j ].material.opacity = 0.0;
			scene.add( TLine[ i ][ j ] );
		}
	}

}

//3Dパス図形の変更パッケージ
function setPoints( _Pathes ){

	pPoints = [];
	for( var i = 0; i < network3D.Nodes.length+20; i++ ){
		pPoints[ i ] = new THREE.Mesh( new THREE.SphereGeometry( 3, 10,10 ),
					       new THREE.MeshBasicMaterial( { color: defNodeColor, opacity: 1 } ) );
		pPoints[ i ].doubleSided = true;
		if( i >= network3D.Nodes.length ){
			pPoints[ i ].material.opacity = 0.0;
		}
		pPoints[ i ].position.x = base.x;
		pPoints[ i ].position.y = base.y;
		pPoints[ i ].position.z = base.z;
		scene.add( pPoints[ i ] );
	}

}

//3Dパス図形の変更パッケージ
function resetPoints( _Nodes ){

	if( pPoints.length > 0 ){
		for( var i = 0; i < pPoints.length; i++ ){
			pPoints[ i ].position.x = base.x;
			pPoints[ i ].position.y = base.y;
			pPoints[ i ].position.z = base.z;
		}
		if( pPoints.length < _Nodes.length ){
			for( var i = pPoints.length; i < _Nodes.length; i++ ){
				pPoints[ i ] = new THREE.Mesh( new THREE.SphereGeometry( 3, 10,10 ),
					       new THREE.MeshBasicMaterial( { color: defNodeColor, opacity: 1 } ) );
				pPoints[ i ].doubleSided = true;
				if( i >= network3D.Nodes.length ){
					pPoints[ i ].material.opacity = 0.0;
				}
				pPoints[ i ].position.x = base.x;
				pPoints[ i ].position.y = base.y;
				pPoints[ i ].position.z = base.z;
				scene.add( pPoints[ i ] );
			}
		}
	}else{
		setNode( _Nodes );
	}

	for( var i = 0; i < pPoints.length; i++ ){
		if( i < _Nodes.length ){
			pPoints[ i ].material.opacity = 1.0;
			pPoints[ i ].position.x += network3D.Nodes[ i ].position.x*scale.x;
			pPoints[ i ].position.y += network3D.Nodes[ i ].position.y*scale.y;
			pPoints[ i ].position.z += network3D.Nodes[ i ].position.z*scale.z+2;
		}else{
			pPoints[ i ].material.opacity = 0.0;
		}
	}

}

//ノードの表示色リセット
function resetNodeColor(){

	for( var i = 0; i < network3D.Nodes.length; i++ ){
		pPoints[ i ].material.color.setHex( defNodeColor )
	}

	for( var i = 0; i < network3D.SafeNodes[ TEras[ TMode-1 ] ].length; i++ ){
		pPoints[ network3D.SafeNodes[ TEras[ TMode-1 ] ][ i ] ].material.color.setHex( goalNodeColor );
	}

}

//ノードの表示色変更
function changeNodeColor( _selectNode, _selectNodeColor ){

//選択されたノードに対して
	pPoints[ _selectNode ].material.color.setHex( _selectNodeColor );

}

//3Dパス図形の変更パッケージ
function setPath( _Pathes ){

	pLines = [];
	for( var i = 0; i < Pathes.length+20; i++ ){
		var material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 1 } );
		var geometry = new THREE.Geometry();
		if( i < _Pathes.length ){
			if( _Pathes[ i ].isActive == 0 ){
				material = new THREE.LineBasicMaterial( { color: 0x444444, opacity: 1, linewidth: 1 } );
			}
			for( var j = 0; j < 10; j++ ){
				geometry.vertices.push( new THREE.Vector3( base.x, base.y, base.z ) );
			}
		}
		pLines[ i ] = new THREE.Line( geometry, material ); 
		scene.add( pLines[ i ] );
	}

}

//3Dパス図形の変更パッケージ
function resetPath( _Pathes ){

	if( pLines.length > 0 ){
		for( var i = 0; i < pLines.length; i++ ){
			for( var j = 0; j < pLines[ i ].geometry.vertices.length; j++ ){
				//pLines[ i ].geometry.vertices[ j ].position.x = base.x;
				//pLines[ i ].geometry.vertices[ j ].position.y = base.y;
				//pLines[ i ].geometry.vertices[ j ].position.z = base.z;
				pLines[ i ].geometry.vertices[ j ].x = base.x;
				pLines[ i ].geometry.vertices[ j ].y = base.y;
				pLines[ i ].geometry.vertices[ j ].z = base.z;
			}
		}
		var _j = 0;
		for( var i = 0; i < _Pathes.length; i++ ){
			_Pathes[ i ].index = [];
			for( var j = 0; j < ~~( _Pathes[ i ].polyline.length/9 )+1; j++ ){
				_Pathes[ i ].index.push( _j );
				_j++;
			}
		}
		if( pLines.length < _j ){
			for( var i = pLines.length; i < _j; i++ ){
				var material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 1 } );
				var geometry = new THREE.Geometry();
				for( var j = 0; j < 10; j++ ){
					geometry.vertices.push( new THREE.Vector3( base.x, base.y, base.z ) );
				}
				pLines[ i ] = new THREE.Line( geometry, material );
				scene.add( pLines[ i ] );
			}
		}
	}else{
		setPath( _Pathes );
	}

	
	for( var i = 0; i < _Pathes.length; i++ ){
		for( var j = 0; j < _Pathes[ i ].index.length; j++ ){
			for( var k = 0; k < pLines[ _Pathes[ i ].index[ j ] ].geometry.vertices.length; k++ ){
				var _k = k+j*9;
				if( _k >= _Pathes[ i ].polyline.length ) _k = _Pathes[ i ].polyline.length-1;
				//pLines[ _Pathes[ i ].index[ j ] ].geometry.vertices[ k ].position.x += _Pathes[ i ].polyline[ _k ].x*scale.x;
				//pLines[ _Pathes[ i ].index[ j ] ].geometry.vertices[ k ].position.y += _Pathes[ i ].polyline[ _k ].y*scale.y;
				//pLines[ _Pathes[ i ].index[ j ] ].geometry.vertices[ k ].position.z += _Pathes[ i ].polyline[ _k ].z*scale.z+1;
				pLines[ _Pathes[ i ].index[ j ] ].geometry.vertices[ k ].x += _Pathes[ i ].polyline[ _k ].x*scale.x;
				pLines[ _Pathes[ i ].index[ j ] ].geometry.vertices[ k ].y += _Pathes[ i ].polyline[ _k ].y*scale.y;
				pLines[ _Pathes[ i ].index[ j ] ].geometry.vertices[ k ].z += _Pathes[ i ].polyline[ _k ].z*scale.z+1;
			}
		}
	}

	for( var i = 0; i < pLines.length; i++ ){
		//pLines[ i ].geometry.__dirtyVertices = true;
		pLines[ i ].geometry.verticesNeedUpdate = true;
	}

}

//パスの表示色リセット
function resetPathColor( _Pathes ){

	for( i = 0; i < _Pathes.length; i++ ){
		//アクティブなパスであった場合
		if( _Pathes[ i ].isActive == 1 ){
			var color = new THREE.Color( 0xffffff );
		//アクティブでないパスであった場合
		}else{
			var color = new THREE.Color( 0x444444 );
		}
		for( j = 0; j < _Pathes[ i ].index.length; j++ ){
			pLines[ _Pathes[ i ].index[ j ] ].material.color = color;
		}
	}

}

//パスの表示色変更
function changePathColor( _Pathes ){

	var colorPitch = 0;
//各ノードまでの最大長の経路距離を取得
	for( var i = 0; i < DistMaps.length; i++ ){
		if( colorPitch < DistMaps[ i ] )colorPitch = DistMaps[ i ];
	}
//最大経路距離を元に色のグラデーションを作成
	//colorPitch = 0.6/colorPitch;
	//colorPitch = 0.6/( colorPitch-threshold );
	colorPitch = 0.4/( colorPitch-threshold );
//色のグラデーション幅の初期値を保存
	if( !colorSetted ){
		defColorPitch = colorPitch;
		colorSetted = true;
	}

//パスの表示色を変更
	for( i = 0; i < _Pathes.length; i++ ){
	//アクティブなパスであった場合
		if( _Pathes[ i ].isActive == 1 ){
			var color = new THREE.Color( 0xffffff );
		//スタートノードから繋がっているパスであった場合(パス両端のノードに登録された経路長が-1以上であった場合)
			if( DistMaps[ _Pathes[ i ].start ] >= 0 && DistMaps[ _Pathes[ i ].end ] >= 0 ){
		//パス両端の経路長を平均して、パスの色を計算
				/*
				avgDist = ( DistMaps[ _Pathes[ i ].start ]+DistMaps[ _Pathes[ i ].end ] )/2;
				//var hue = 0.4-defColorPitch*avgDist;
				var hue = 0.4-colorPitch*avgDist;
				if( hue < 0 )hue = 1+hue;
				*/
				
				var startDist = DistMaps[ _Pathes[ i ].start ]-threshold;
				if( startDist < 0 )startDist = 0;
				var endDist = DistMaps[ _Pathes[ i ].end ]-threshold;
				if( endDist < 0 )endDist = 0;
				avgDist = ( startDist+endDist )/2;
				var hue = 0.4;
				if( DistMaps[ _Pathes[ i ].start ] == 0 && DistMaps[ _Pathes[ i ].end ] == 0 ){
					hue = 0.55;
				}else if( avgDist > 0 ){
					hue = 0.18-defColorPitch*avgDist;
					if( hue < 0 )hue = 1+hue;
				}
				color.setHSL( hue, 1.0, 0.5 );
			}
			//パスの色をアップデート
			for( j = 0; j < _Pathes[ i ].index.length; j++ ){
				pLines[ _Pathes[ i ].index[ j ] ].material.color = color;
			}
		}
	}

}

function visualText( _x, _y, _str ){
	var str = "<p style=\" position:absolute; color:#ffffff; ";
	str += "top: "+_y+"px; ";
	str += "left:"+_x+"px;";
	str += " \">";
	str += selectNode+": "+_str;
	str += "</p>";
	return str;
}

function cameraState( _stateNum ){
	switch( _stateNum ){
		case 0:
			break;
		case 1:
			break;
		case 2:
			break;
		case 3:
			break;
		default:
			break;
	}
}

function zeroAdd( _num, _digit ){
	var num = Math.floor( _num );
	var zeroStr = "";
	if( typeof _digit === "indefined" )_digit = 4;
	for( var i = 0; i < _digit; i++ ){
		zeroStr += "0";
	}
	return ( zeroStr+num ).substr( -_digit );
}

function distToTime( _dist ){
	return Math.floor( _dist/40 );
}

function updateDisplay( _totalSafeNodes, _totalEvacLength, _totalAddCost, _logID, _target ){
	var _tN, _tN_d, _tT, _tT_d, _tC, _ID;
	if( _target == 0 ){
		_tN = jQuery( '#totalSafeNodes' );
		_tN_d = jQuery( '#deltaSafeNodes' );
		_tT = jQuery( '#totalSavedTime' );
		_tT_d = jQuery( '#deltaSavedTime' );
		_tC = jQuery( '#totalCost' );
	}else{
		_tN = jQuery( ".tN-ranking-"+_target );
		_tN_d = jQuery( ".tN-ranking-"+_target+"-diff" );
		_tT = jQuery( ".tT-ranking-"+_target );
		_tT_d = jQuery( ".tT-ranking-"+_target+"-diff" );
		_tC = jQuery( ".tC-ranking-"+_target );
		_ID = jQuery( ".ID-ranking-"+_target );
	}
	//console.log( "" +_totalSafeNodes+" "+_totalEvacLength+" "+_totalAddCost );

	_tN.html( "" );
	_tN.html( zeroAdd( _totalSafeNodes ) );
	_tN_d.html( "" );
	var _deltaSafeNodes = _totalSafeNodes-initialSafeNodes;
	if( _deltaSafeNodes == 0 )_tN_d.html( "(--)" );
	else _tN_d.html( "(▲+"+zeroAdd( _deltaSafeNodes )+")" );

	_tT.html( "" );
	_tT.html( zeroAdd( distToTime( _totalEvacLength*1.0 ) ) );
	_tT_d.html( "" );
	var _deltaEvacLength = initialEvacLength-_totalEvacLength;
	if( _deltaEvacLength == 0 )_tT_d.html( "(--)" );
	else _tT_d.html( "(▼-"+zeroAdd( distToTime( _deltaEvacLength ) )+")" );

	_tC.html( "" );
	_tC.html( zeroAdd( _totalAddCost, 6 ) );

	if( _target != 0 ){
		_ID.html( "" );
		_ID.html( _logID );
	}
}

function updateCam(){

//コントローラによるカメラのアップデート
	//controls.update();

	if( isAnimate ){
		var _angleXY = 0.008*( timeNow - timePrev )*0.03;
		if( angleZ != 0.6 )_angleXY = 0.006*( timeNow - timePrev )*0.03;
		angleXY = angleXY+_angleXY;
		if( angleXY > Math.PI*2 )angleXY = angleXY-Math.PI*2;
		else if( angleXY < 0 )angleXY = angleXY+Math.PI*2;

		if( angleZ != 0.6 ){
			var _angleZ = 0.003*( timeNow - timePrev )*0.03;
			if( angleZ-_angleZ < 0.6 && 0.6 < angleZ )angleZ= 0.6;
			else angleZ = angleZ-_angleZ;
		}

		camera.position.x = radius*Math.cos( angleZ )*Math.cos( angleXY );
		camera.position.y = radius*Math.cos( angleZ )*Math.sin( angleXY );
		camera.position.z = radius*Math.sin( angleZ );

		camera.up = new THREE.Vector3( 0, 0, 1 );
		camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
	}else{
		if( angleXY != Math.PI*3/2 ){
			var _angleXY = 0.25*( timeNow - timePrev )*0.03;
			if( Math.PI/2 < angleXY && angleXY < Math.PI*3/2 ){
				if( angleXY < Math.PI*3/2 && Math.PI*3/2 < angleXY+_angleXY )angleXY = Math.PI*3/2;
				else angleXY = angleXY+_angleXY;
			}else{
				if( angleXY-_angleXY < Math.PI*3/2 && Math.PI*3/2 < angleXY )angleXY = Math.PI*3/2;
				else angleXY = angleXY-_angleXY;
			}
			if( angleXY > Math.PI*2 )angleXY = angleXY-Math.PI*2;
			else if( angleXY < 0 )angleXY = angleXY+Math.PI*2;
		}

		if( angleZ != Math.PI/2 ){
			var _angleZ = 0.18*( timeNow - timePrev )*0.03;
			if( angleZ < Math.PI/2 && Math.PI/2 < angleZ+_angleZ )angleZ= Math.PI/2;
			else angleZ = angleZ+_angleZ;
		}

		camera.position.x = radius*Math.cos( angleZ )*Math.cos( angleXY );
		camera.position.y = radius*Math.cos( angleZ )*Math.sin( angleXY );
		camera.position.z = radius*Math.sin( angleZ );

		camera.up = new THREE.Vector3( -camera.position.x, -camera.position.y, 0 ).normalize();
		camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
	}
//????
	camera.updateProjectionMatrix();

}

function searchNode( _Nodes, _point ){
	var _minDist = meshW+meshH;
	var _nearIndex = -1;
	for( var i = 0; i < _Nodes.length; i++ ){
		if( _Nodes[ i ].onGround ){
			var _dist = Math.sqrt( Math.pow( ( _Nodes[ i ].position.x-_point.x ), 2 )+Math.pow( ( _Nodes[ i ].position.y-_point.y ), 2 ) );
			if( _minDist > _dist ){
				_nearIndex = i;
				_minDist = _dist;
			}
		}
	}
	if( _minDist < 50 )return _nearIndex;
	return -1;
}

function viewLog(){
	if( viewLogFLG ){
		$( '#log_canvas' ).fadeIn( 'fast' );
		$( '#slider' ).fadeIn( 'fast' );
	}else{
		$( '#log_canvas' ).fadeOut( 'fast' );
		$( '#slider' ).fadeOut( 'fast' );
	}
}
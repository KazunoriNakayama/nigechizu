//点と線の交点取得
function cpPointLine( _point1, _point2, _vector ){

	var _t = ( _vector.x*( _point1.x-_point2.x )+_vector.y*( _point1.y-_point2.y )+_vector.z*( _point1.z-_point2.z ) )/
		 ( Math.pow( _vector.x, 2 ) + Math.pow( _vector.y, 2 ) + Math.pow( _vector.z, 2 ) );
	return( new THREE.Vector3( ( _point2.x + _vector.x*_t ) - _point1.x,
		( _point2.y + _vector.y*_t ) - _point1.y,
		( _point2.z + _vector.z*_t ) - _point1.z ) );

}

//点と直線の距離取得
function distPointLine( _point1, _point2, _vector ){

	var _cpPoint = cpPointLine( _point1, _point2, _vector );
	return( _cpPoint.length() );

}

//半直線と平面の交差判定
function isIntRayPlane( _plane, _point, _vector ){

	var _D = _plane.x*_vector.x+_plane.y*_vector.y+_plane.z*_vector.z;
	if( _D == 0 ){
		return( false );
	}else{
		var _t = ( _plane.w-( _plane.x*_point.x+_plane.y*_point.y+_plane.z*_point.z ) )/_D;
		if( _t >= 0 ){
			return true;
		}else{
			return false;
		}
	}

}

//半直線と平面の交点
function intRayPlane( _plane, _point, _vector ){

	var _intPoint;
	var _D = _plane.x*_vector.x+_plane.y*_vector.y+_plane.z*_vector.z;
	if( isIntRayPlane( _plane, _point, _vector ) ){
		_intPoint = new THREE.Vector3( _point.x+_t*_vector.x, _point.y+_t*_vector.y, _point.z+_t*_vector.z );
	}else{
		_intPoint = new THREE.Vector3( 0, 0, 0 );
	}

	return( _intPoint );

}

//直線と平面の交差判定
function isIntLinePlane( _plane, _point, _vector ){

	var _D = _plane.x*_vector.x+_plane.y*_vector.y+_plane.z*_vector.z;
	if( _D == 0 ){
		return false;
	}else{
		return true;
	}

}

//直線と平面の交点
function intLinePlane( _plane, _point, _vector ){

	var _intPoint;
	var _D = _plane.x*_vector.x+_plane.y*_vector.y+_plane.z*_vector.z;
	if( isIntLinePlane( _plane, _point, _vector ) ){
		var _t = ( _plane.w-( _plane.x*_point.x+_plane.y*_point.y+_plane.z*_point.z ) )/_D;
		_intPoint = new THREE.Vector3( _point.x+_t*_vector.x, _point.y+_t*_vector.y, _point.z+_t*_vector.z );
	}else{
		_intPoint = new THREE.Vector3( 0, 0, 0 );
	}

	return( _intPoint );

}

//半直線と線分の交差判定
function isIntRaySeg( _seg1, _seg2 ){

	var crossPdt1 = ( _seg1[ 1 ].x-_seg1[ 0 ].x )*( _seg2[ 0 ].y-_seg1[ 0 ].y )-( _seg1[ 1 ].y-_seg1[ 0 ].y )*( _seg2[ 0 ].x-_seg1[ 0 ].x );
	var crossPdt2 = ( _seg1[ 1 ].x-_seg1[ 0 ].x )*( _seg2[ 1 ].y-_seg1[ 0 ].y )-( _seg1[ 1 ].y-_seg1[ 0 ].y )*( _seg2[ 1 ].x-_seg1[ 0 ].x );
	var dotPdt3 = ( _seg1[ 1 ].x-_seg1[ 0 ].x )*( _seg2[ 0 ].x-_seg1[ 0 ].x )+( _seg1[ 1 ].y-_seg1[ 0 ].y )*( _seg2[ 0 ].y-_seg1[ 0 ].y );
	var dotPdt4 = ( _seg1[ 1 ].x-_seg1[ 0 ].x )*( _seg2[ 1 ].x-_seg1[ 0 ].x )+( _seg1[ 1 ].y-_seg1[ 0 ].y )*( _seg2[ 1 ].y-_seg1[ 0 ].y );
	if( crossPdt1*crossPdt2 < 0.0000001 ){
		if( dotPdt3*dotPdt4 > 0.0000001 ){
			return true ;
		}
	}

	return false ;

}

//点の多角形への内包判定
function isInPointPoly( _point, _polygon ){
	var count = 0;
	var c = 0;
	for( var i = 0; i < _polygon.length-1; i++ ){
		var isUp1 = false;
		var isUp2 = false;
		if( _point.y <= _polygon[ i ].y )isUp1 = true;
		if( _point.y <= _polygon[ i+1 ].y )isUp2 = true;
		if( isUp1 != isUp2 ){
			var isRight1 = false;
			var isRight2 = false;
			if( _point.x <= _polygon[ i ].x )isRight1 = true;
			if( _point.x <= _polygon[ i+1 ].x )isRight2 = true;
			if( isRight1 == isRight2 ){
				if( isRight1 ){
					if( isUp1 )count++;
					else count--;
					c++;
				}
			}else{
				if( ( _polygon[ i+1 ].x-_polygon[ i ].x )*( _point.y-_polygon[ i ].y )/( _polygon[ i+1 ].y-_polygon[ i ].y )+_polygon[ i ].x >= _point.x ){
					if( isUp1 )count++;
					else count--;
					c++;
				}
			}
		}
	}
	if( count == 0 )return false;
	return true;
}

//線分と線分の交差判定
function isIntSegSeg( _seg1, _seg2 ){

	var crossPdt1 = ( _seg1[ 1 ].x-_seg1[ 0 ].x )*( _seg2[ 0 ].y-_seg1[ 0 ].y )-( _seg1[ 1 ].y-_seg1[ 0 ].y )*( _seg2[ 0 ].x-_seg1[ 0 ].x );
	var crossPdt2 = ( _seg1[ 1 ].x-_seg1[ 0 ].x )*( _seg2[ 1 ].y-_seg1[ 0 ].y )-( _seg1[ 1 ].y-_seg1[ 0 ].y )*( _seg2[ 1 ].x-_seg1[ 0 ].x );
	var crossPdt3 = ( _seg2[ 1 ].x-_seg2[ 0 ].x )*( _seg1[ 0 ].y-_seg2[ 0 ].y )-( _seg2[ 1 ].y-_seg2[ 0 ].y )*( _seg1[ 0 ].x-_seg2[ 0 ].x );
	var crossPdt4 = ( _seg2[ 1 ].x-_seg2[ 0 ].x )*( _seg1[ 1 ].y-_seg2[ 0 ].y )-( _seg2[ 1 ].y-_seg2[ 0 ].y )*( _seg1[ 1 ].x-_seg2[ 0 ].x );
	if( crossPdt1*crossPdt2 < 0.0000001 ){
		if( crossPdt3*crossPdt4 < 0.0000001 ){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}

}

//線分と線分の交点
function intSegSeg( _seg1, _seg2 ){

	if( isIntSegSeg( _seg1, _seg2 ) ){
		var crossPdt1 = Math.abs( ( _seg1[ 1 ].x-_seg1[ 0 ].x )*( _seg2[ 0 ].y-_seg1[ 0 ].y )-( _seg1[ 1 ].y-_seg1[ 0 ].y )*( _seg2[ 0 ].x-_seg1[ 0 ].x ) );
		var crossPdt2 = Math.abs( ( _seg1[ 1 ].x-_seg1[ 0 ].x )*( _seg2[ 1 ].y-_seg1[ 0 ].y )-( _seg1[ 1 ].y-_seg1[ 0 ].y )*( _seg2[ 1 ].x-_seg1[ 0 ].x ) );
		var crossPdt3 = Math.abs( ( _seg2[ 1 ].x-_seg2[ 0 ].x )*( _seg1[ 0 ].y-_seg2[ 0 ].y )-( _seg2[ 1 ].y-_seg2[ 0 ].y )*( _seg1[ 0 ].x-_seg2[ 0 ].x ) );
		var crossPdt4 = Math.abs( ( _seg2[ 1 ].x-_seg2[ 0 ].x )*( _seg1[ 1 ].y-_seg2[ 0 ].y )-( _seg2[ 1 ].y-_seg2[ 0 ].y )*( _seg1[ 1 ].x-_seg2[ 0 ].x ) );
		var t = crossPdt3/( crossPdt3+crossPdt4 );
		if( -1 <= t && t <= 1 ){
			return( new THREE.Vector3( _seg1[ 0 ].x+( _seg1[ 1 ].x-_seg1[ 0 ].x )*t,
				_seg1[ 0 ].y+( _seg1[ 1 ].y-_seg1[ 0 ].y )*t, 0 ) );
		}
	}
	return( new THREE.Vector3( 0, 0, 0 ) );

}

//点のポリゴンへのないほう判定
function isInPointTri( _point, _Triangle ){

	var inCount = 0;
	for( var i = 0; i < 3; i++ ){
		var _v1 = new THREE.Vector3().sub( _Triangle[ i ], _point ).normalize();
		var _v2 = new THREE.Vector3().sub( _Triangle[ ( i+1 )%3 ], _Triangle[ i ] ).normalize();
		_v1 = _v1.crossSelf( _v2 );
		if( _v1.z > 0.0000001 )inCount++;
		else if( _v1.z < -0.0000001 )inCount--;
	}
	if( Math.abs( inCount ) > 1 )return true;
	return false;

}

//点のポリゴンへの内包判定
function inPointTri( _point, _Triangle ){

	if( isInPointTri( _point, _Triangle ) ){
		var _normal = new THREE.Vector3().cross( new THREE.Vector3().sub( _Triangle[ 0 ], _Triangle[ 1 ] ), new THREE.Vector3().sub( _Triangle[ 2 ], _Triangle[ 1 ] ) );
		_normal.normalize();
		var _plane = new THREE.Vector4( _normal.x,
						_normal.y,
						_normal.z,
						_normal.dot( _Triangle[ 1 ] ) );
		return intLinePlane( _plane, _point, new THREE.Vector3( 0, 0, 1 ) );
	}else{
		return new THREE.Vector3( 0, 0, 0 );
	}

}


//下記のpostMainDBのハードコーディング版
function postMainDBtest(){

	var testOperation="{line:[00,01,10,11,]}{path:[[11,22],[22,33],[33,44],[44,55],[55,66]]}";
	var testResult=[12];
	testResult[0]= 100;
	testResult[1]= 101;
	testResult[2]= 110;
	testResult[3]= 111;

	testResult[4]= 1000;
	testResult[5]= 2000;
	testResult[6]= 3000;
	testResult[7]= 4000;

	testResult[8]=10;
	testResult[9]=100;
	testResult[10]=1000;
	testResult[11]=10000;

	postMainDB(testOperation,testResult);

}

//databaseにajaxで送信
function postMainDB(_operations,_results){

	var data={
		id : "NULL",
		datetime: "NULL",
		operations: _operations,
		results00 : _results[0],
		results01 : _results[1],
		results02 : _results[2],
		results03 : _results[3],
		results10 : _results[4],
		results11 : _results[5],
		results12 : _results[6],
		results13 : _results[7],
		results20 : _results[8],
		results21 : _results[9],
		results22 : _results[10],
		results23 : _results[11]
	};

	$.ajax({
		type: "post",
		dataType : 'html',
		url: "./cgi/insertMain.php",
		data: data,
		success: function() {
			return false;
		}
	});

}

function collectResults(_network){

	//threshold 必要
	var calcResult=[12];

	for( var i = 0; i < TEras.length; i++ ){//loops 4 times
		var singleResult = _network.Distmap[ TEras[ i ] ];
		var totalLength = 0.0, safeNodes=0;
		for( var j = 0; j < singleResult.length; i++ ){
			if( singleResult[ j ] < threshold ) safeNodes++;
			totalLength += singleResult[  j];
		}
		calcResult[i] = safeNodes;	
		//safe nodes
		calcResult[4+i] = totalLength;	
		//overall length
		calcResult[8+i] = totalAddLength;
		//add Length;
	}
	return calcResult;

}

function reset(){ //?

	network3D = network3D_ORG.clone();
	network3D.setDistmap( network3D.isDistmap() );
	DistMaps = network3D.Distmap[ TEras[ TMode-1 ] ];
	resetNodeColor();
	if( selectNode > -1 ) changeNodeColor( selectNode );
	resetPath( network3D.Pathes );
	resetPathColor( network3D.Pathes );
	changePathColor( network3D.Pathes );
	colorSetted = false;

}

//Node Class
THREE.Node = function( _x, _y, _z ){

	this.position = new THREE.Vector3( _x, _y, _z );
	this.index = -1;
	this.Connects = [];
	this.onGround = true;
	this.SAFE = { M29 : true, S08 : true, S35 : true, H23 : true };

};

THREE.Node.prototype = {

	construcor: THREE.Node, 

//3次元座標の入力
	set: function( _x, _y, _z ){
		this.position = new THREE.Vector3( _x, _y, _z );
	}, 

//x座標の入力
	setX: function( _x ){
		this.position.x = _x;
	}, 

//y座標の入力
	setY: function( _y ){
		this.position.y = _y;
	}, 

//z座標の入力
	setZ: function( _z ){
		this.position.z = _z;
	}, 

//インデックス番号の入力
	setIndex: function( _index ){
		this.index = _index;
	}, 

//隣接･接続状態の入力
	setConnects: function( _Connects ){
		this.Connects = [];
		for( var i = 0; i < _Connects.length; i++ ){
			this.Connects[ i ] = _Connects[ i ];
		}
	}, 

//津波の安全フラグの入力
	setSafe: function( _isSafe ){
		this.SAFE.M29 = _isSafe[ 0 ];
		this.SAFE.S08 = _isSafe[ 1 ];
		this.SAFE.S35 = _isSafe[ 2 ];
		this.SAFE.H23 = _isSafe[ 3 ];
	}, 

//明治29年津波の安全フラグの入力
	setSafeM29: function( _isSafe ){
		this.SAFE.M29 = _isSafe;
	}, 

//昭和8年津波の安全フラグの入力
	setSafeS08: function( _isSafe ){
		this.SAFE.S08 = _isSafe;
	}, 

//昭和35年津波の安全フラグの入力
	setSafeS35: function( _isSafe ){
		this.SAFE.S35 = _isSafe;
	}, 

//平成23年津波の安全フラグの入力
	setSafeH23: function( _isSafe ){
		this.SAFE.H23 = _isSafe;
	}, 

//明治29年津波の安全フラグの変更
	changeSafeM29: function(){
		if( !this.SAFE.M29 ) this.SAFE.M29 = false;
		else this.SAFE.M29 = true;
	}, 

//昭和08年津波の安全フラグの変更
	changeSafeS08: function(){
		if( !this.SAFE.S08 ) this.SAFE.S08 = false;
		else this.SAFE.S08 = true;
	}, 

//昭和35年津波の安全フラグの変更
	changeSafeS35: function(){
		if( !this.SAFE.S35 ) this.SAFE.S35 = false;
		else this.SAFE.S35 = true;
	}, 

//平成23年津波の安全フラグの変更
	changeSafeH23: function(){
		if( !this.SAFE.H23 ) this.SAFE.H23 = false;
		else this.SAFE.H23 = true;
	}, 

//津波の安全フラグのを津波浸水域から設定
	isSafe: function( _Polygons ){
		var _isSafe = [ this.isSafeM29( _Polygons[ 0 ] ), 
				this.isSafeS08( _Polygons[ 1 ] ), 
				this.isSafeS35( _Polygons[ 2 ] ), 
				this.isSafeH23( _Polygons[ 3 ] ) ];
		return _isSafe;
	}, 

//明治29年津波の安全フラグのを津波浸水域から設定
	isSafeM29: function( _Polygons ){
		var _safeFLG = true;
		for( var i = 0; i < _Polygons.length; i++ ){
			if( _Polygons[ i ][ 0 ] == 0 ){ 
				if( isInPointPoly( this.position, _Polygons[ i ][ 1 ] ) )_safeFLG = false;
			}
		}
		for( var i = 0; i < _Polygons.length; i++ ){
			if( _Polygons[ i ][ 0 ] == 1 ){ 
				if( isInPointPoly( this.position, _Polygons[ i ][ 1 ] ) )_safeFLG = true;
			}
		}
		return _safeFLG;
	}, 

//昭和8年津波の安全フラグのを津波浸水域から設定
	isSafeS08: function( _Polygons ){
		var _safeFLG = true;
		for( var i = 0; i < _Polygons.length; i++ ){
			if( _Polygons[ i ][ 0 ] == 0 ){ 
				if( isInPointPoly( this.position, _Polygons[ i ][ 1 ] ) )_safeFLG = false;
			}
		}
		for( var i = 0; i < _Polygons.length; i++ ){
			if( _Polygons[ i ][ 0 ] == 1 ){ 
				if( isInPointPoly( this.position, _Polygons[ i ][ 1 ] ) )_safeFLG = true;
			}
		}
		return _safeFLG;
	}, 

//昭和35年津波の安全フラグのを津波浸水域から設定
	isSafeS35: function( _Polygons ){
		var _safeFLG = true;
		for( var i = 0; i < _Polygons.length; i++ ){
			if( _Polygons[ i ][ 0 ] == 0 ){ 
				if( isInPointPoly( this.position, _Polygons[ i ][ 1 ] ) )_safeFLG = false;
			}
		}
		for( var i = 0; i < _Polygons.length; i++ ){
			if( _Polygons[ i ][ 0 ] == 1 ){ 
				if( isInPointPoly( this.position, _Polygons[ i ][ 1 ] ) )_safeFLG = true;
			}
		}
		return _safeFLG;
	}, 

//平成23年津波の安全フラグのを津波浸水域から設定
	isSafeH23: function( _Polygons ){
		var _safeFLG = true;
		for( var i = 0; i < _Polygons.length; i++ ){
			if( _Polygons[ i ][ 0 ] == 0 ){ 
				if( isInPointPoly( this.position, _Polygons[ i ][ 1 ] ) )_safeFLG = false;
			}
		}
		for( var i = 0; i < _Polygons.length; i++ ){
			if( _Polygons[ i ][ 0 ] == 1 ){ 
				if( isInPointPoly( this.position, _Polygons[ i ][ 1 ] ) )_safeFLG = true;
			}
		}
		return _safeFLG;
	}, 

//隣接･接続情報の追加
	addConnects: function( _index, _isActive, _dist ){
		this.Connects.push( [ _index, _isActive, _dist ] );
	}, 

//3次元点への距離取得
	distTo: function( _v ){
		return this.position.distanceTo( _v );
	}, 

//地形メッシュへのノードの投影
	projection: function( _GeoMesh ){
		this.position = _GeoMesh.projectPoint( this.position );
	}

};

//Path Class
THREE.Path = function( _start, _end ){

	this.start = _start;
	this.end = _end;
	this.index = [];
	this.isActive = -1;
	this.length = -1;
	this.polyline = [];

};

THREE.Path.prototype = {

	construcor: THREE.Path, 

//始点･終点のインデックスの入力
	set: function( _start, _end ){
		this.start = _start;
		this.end = _end;
	}, 

//接続フラグの入力
	setActive: function( _isActive ){
		this.isActive = _isActive;
	}, 

//表示ポリラインの入力
	setPolyline: function( _polyline ){
		this.polyline = [];
		for( var i = 0; i < _polyline.length; i++ ){
			this.polyline[ i ] = _polyline[ i ];
		}
	}, 

//距離の入力
	setLen: function( _length ){
		this.length = _length;
	}, 

//ポリラインの長さの計算
	pathLen: function(){
		var _pathLen = 0;
		for( var i = 0; i < this.polyline.length-1; i++ ){
			_pathLen += this.polyline[ i ].distanceTo( this.polyline[ i+1 ] );
		}
		return _pathLen;
	}, 

//地形メッシュへのパスの投影
	projection: function( _GeoMesh ){
		this.polyline = _GeoMesh.projectLine( this.polyline );
	}

};

//Network Class
THREE.Network = function( _Nodes, _Pathes ){

//ノード配列の登録
	this.Nodes = [];
	for( i = 0; i < _Nodes.length; i++ ){
		this.Nodes[ i ] = new THREE.Node( _Nodes[ i ][ 0 ],  _Nodes[ i ][ 1 ],  _Nodes[ i ][ 2 ] );
	}

//パス配列の登録
	this.Pathes = [];
	for( i = 0; i < _Pathes.length; i++ ){
		this.Pathes[ i ] = new THREE.Path( _Pathes[ i ][ 0 ],  _Pathes[ i ][ 1 ] );
		this.Pathes[ i ].setActive( 1 );
		this.Pathes[ i ].setPolyline( [ this.Nodes[ this.Pathes[ i ].start ].position, this.Nodes[ this.Pathes[ i ].end ].position ] );
		this.Pathes[ i ].setLen( this.Nodes[ this.Pathes[ i ].start ].distTo( this.Nodes[ this.Pathes[ i ].end ].position ) );
	}

//ノード配列を元にパス配列の隣接･接続情報を登録
	for( var i = 0; i < this.Pathes.length; i++ ){
		this.Nodes[ this.Pathes[ i ].start ].addConnects( this.Pathes[ i ].end, this.Pathes[ i ].isActive, this.Pathes[ i ].length );
		this.Nodes[ this.Pathes[ i ].end ].addConnects( this.Pathes[ i ].start, this.Pathes[ i ].isActive, this.Pathes[ i ].length );
	}

	this.Distmap = { M29 : [], S08 : [], S35 : [], H23 : [] };
	this.SafeNodes = { M29 : [], S08 : [], S35 : [], H23 : [] }

};

THREE.Network.prototype = {

	construcor: THREE.Network, 

//ノード配列、パス配列の入力
	set: function( _Nodes, _Pathes ){
		this.Nodes = [];
		for( var i = 0; i < _Nodes.length; i++ ){
			this.Nodes[ i ] = _Nodes[ i ];
		}
		this.Pathes = [];
		for( var i = 0; i < _Pathes.length; i++ ){
			this.Pathes[ i ] = _Pathes[ i ];
		}
	}, 

//ノードの追加
	addNode: function( _Node ){
		this.Nodes.push( _Node );
	}, 

//パスの追加
	addPath: function( _Path ){
		this.Pathes.push( _Path );
		for( var i = 0; i < this.Nodes.length; i++ ){
			if( _Path.start == i ){
				this.Nodes[ i ].addConnects( _Path.end, _Path.isActive, _Path.length );
			}
			if( _Path.end == i ){
				this.Nodes[ i ].addConnects( _Path.start, _Path.isActive, _Path.length );
			}
		}
	}, 

//パスの長さ情報更新
	updatePathLen: function(){
		for( i = 0; i < this.Pathes.length; i++ ){
			this.Pathes[ i ].setLen( this.Pathes[ i ].pathLen() );
		}
	}, 

//地形メッシュへのネットワークの投影
	projection: function( _GeoMesh ){
		for( var i = 0; i < this.Nodes.length; i++ ){
			this.Nodes[ i ].projection( _GeoMesh );
			if( this.Nodes[ i ].position.isZero() )document.getElementById( 'text' ).innerHTML += "i: "+i+" error!!<br>";
		}
		
		for( var i = 0; i < this.Pathes.length; i++ ){
			this.Pathes[ i ].projection( _GeoMesh );
		}
		
	},

//複製
	clone: function(){
		_Nodes = [];
		for( var i = 0; i < this.Nodes.length; i++ ){
			_Nodes[ i ] = [ this.Nodes[ i ].position.x, this.Nodes[ i ].position.y, this.Nodes[ i ].position.z ];
			_Nodes[ i ].index = this.Nodes[ i ].index;
		}
		_Pathes = [];
		for( var i = 0; i < this.Pathes.length; i++ ){
			_Pathes[ i ] = [ this.Pathes[ i ].start, this.Pathes[ i ].end ];
			for( var j = 0; j < this.Pathes[ i ].index.length; j++ ){
				_Pathes[ i ].index.push( this.Pathes[ i ].index[ j ] );
			}
		}
		var _network = new THREE.Network( _Nodes, _Pathes );
		for( var i = 0; i < _network.Nodes.length; i++ ){
			_network.Nodes[ i ].setIndex( this.Nodes[ i ].index );
			_network.Nodes[ i ].setConnects( this.Nodes[ i ].Connects );
			_network.Nodes[ i ].setSafe( [ this.Nodes[ i ].SAFE.M29, this.Nodes[ i ].SAFE.S08, this.Nodes[ i ].SAFE.S35, this.Nodes[ i ].SAFE.H23 ] );
		}
		for( var i = 0; i < _network.Pathes.length; i++ ){
			_network.Pathes[ i ].setActive( 1 );
			_network.Pathes[ i ].setPolyline( this.Pathes[ i ].polyline );
			_network.Pathes[ i ].setLen( this.Pathes[ i ].length );
		}
		_network.setSafeNode( [ this.SafeNodes.M29, this.SafeNodes.S08, this.SafeNodes.S35, this.SafeNodes.H23 ] );
		_network.setDistmap( [ this.Distmap.M29, this.Distmap.S08, this.Distmap.S35, this.Distmap.H23 ] );
		return _network;
	}, 

//津波で安全だった地点を取得
	setSafe: function( _Polygons ){
		this.setSafeM29( _Polygons[ 0 ] );
		this.setSafeS08( _Polygons[ 1 ] );
		this.setSafeS35( _Polygons[ 2 ] );
		this.setSafeH23( _Polygons[ 3 ] );
	}, 

//明治29年津波で安全だった地点を取得
	setSafeM29: function( _Polygons ){
		for( var i = 0; i < this.Nodes.length; i++ ){
			this.Nodes[ i ].setSafeM29( this.Nodes[ i ].isSafeM29( _Polygons ) );
		}
		this.setSafeNodeM29( this.isSafeNodeM29( _Polygons ) );
	}, 

//昭和8年津波で安全だった地点を取得
	setSafeS08: function( _Polygons ){
		for( var i = 0; i < this.Nodes.length; i++ ){
			this.Nodes[ i ].setSafeS08( this.Nodes[ i ].isSafeS08( _Polygons ) );
		}
		this.setSafeNodeS08( this.isSafeNodeS08( _Polygons ) );
	}, 

//昭和35年津波で安全だった地点を取得
	setSafeS35: function( _Polygons ){
		for( var i = 0; i < this.Nodes.length; i++ ){
			this.Nodes[ i ].setSafeS35( this.Nodes[ i ].isSafeS35( _Polygons ) );
		}
		this.setSafeNodeS35( this.isSafeNodeS35( _Polygons ) );
	}, 

//平成23年津波で安全だった地点を取得
	setSafeH23: function( _Polygons ){
		for( var i = 0; i < this.Nodes.length; i++ ){
			this.Nodes[ i ].setSafeH23( this.Nodes[ i ].isSafeH23( _Polygons ) );
		}
		this.setSafeNodeH23( this.isSafeNodeH23( _Polygons ) );
	}, 

//津波で安全だった地点を取得
	isSafeNode: function(){
		return [ this.isSafeNodeM29(), 
			 this.isSafeNodeS08(), 
			 this.isSafeNodeS35(), 
			 this.isSafeNodeH23() ];
	}, 

//明治29年津波で安全だった地点を取得
	isSafeNodeM29: function(){
		_safeNodes = [];
		for( var i = 0; i < this.Nodes.length; i++ ){
			if( this.Nodes[ i ].SAFE.M29 )_safeNodes.push( i );
		}
		return _safeNodes;
	}, 

//昭和8年津波で安全だった地点を取得
	isSafeNodeS08: function(){
		_safeNodes = [];
		for( var i = 0; i < this.Nodes.length; i++ ){
			if( this.Nodes[ i ].SAFE.S08 )_safeNodes.push( i );
		}
		return _safeNodes;
	}, 

//昭和35年津波で安全だった地点を取得
	isSafeNodeS35: function(){
		_safeNodes = [];
		for( var i = 0; i < this.Nodes.length; i++ ){
			if( this.Nodes[ i ].SAFE.S35 )_safeNodes.push( i );
		}
		return _safeNodes;
	}, 

//平成23年津波で安全だった地点を取得
	isSafeNodeH23: function(){
		_safeNodes = [];
		for( var i = 0; i < this.Nodes.length; i++ ){
			if( this.Nodes[ i ].SAFE.H23 )_safeNodes.push( i );
		}
		return _safeNodes;
	}, 

//津波で安全だった地点を取得
	setSafeNode: function( _SafeNodes ){
		this.setSafeNodeM29( _SafeNodes[ 0 ] );
		this.setSafeNodeS08( _SafeNodes[ 1 ] );
		this.setSafeNodeS35( _SafeNodes[ 2 ] );
		this.setSafeNodeH23( _SafeNodes[ 3 ] );
	}, 

//明治29年津波で安全だった地点を取得
	setSafeNodeM29: function( _SafeNodes ){
		for( var i = 0; i < _SafeNodes.length; i++ ){
			this.SafeNodes.M29[ i ] = _SafeNodes[ i ];
		}
	}, 

//昭和8年津波で安全だった地点を取得
	setSafeNodeS08: function( _SafeNodes ){
		for( var i = 0; i < _SafeNodes.length; i++ ){
			this.SafeNodes.S08[ i ] = _SafeNodes[ i ];
		}
	}, 

//昭和35年津波で安全だった地点を取得
	setSafeNodeS35: function( _SafeNodes ){
		for( var i = 0; i < _SafeNodes.length; i++ ){
			this.SafeNodes.S35[ i ] = _SafeNodes[ i ];
		}
	}, 

//平成23年津波で安全だった地点を取得
	setSafeNodeH23: function( _SafeNodes ){
		for( var i = 0; i < _SafeNodes.length; i++ ){
			this.SafeNodes.H23[ i ] = _SafeNodes[ i ];
		}
	}, 

//津波で安全だった地点を取得
	addSafeNode: function( _nodeIndex ){
		this.addSafeNodeM29( _nodeIndex );
		this.addSafeNodeS08( _nodeIndex );
		this.addSafeNodeS35( _nodeIndex );
		this.addSafeNodeH23( _nodeIndex );
	}, 

//明治29年津波で安全だった地点を取得
	addSafeNodeM29: function( _nodeIndex ){
		this.SafeNodes.M29.push( _nodeIndex );
	}, 

//昭和8年津波で安全だった地点を取得
	addSafeNodeS08: function( _nodeIndex ){
		this.SafeNodes.S08.push( _nodeIndex );
	}, 

//昭和35年津波で安全だった地点を取得
	addSafeNodeS35: function( _nodeIndex ){
		this.SafeNodes.S35.push( _nodeIndex );
	}, 

//平成23年津波で安全だった地点を取得
	addSafeNodeH23: function( _nodeIndex ){
		this.SafeNodes.H23.push( _nodeIndex );
	}, 

	isDistmap: function(){
		return [ this.isDistmapM29(), 
			 this.isDistmapS08(), 
			 this.isDistmapS35(), 
			 this.isDistmapH23() ];
	}, 

	isDistmapM29: function(){
		return this.dijkstra( this.SafeNodes.M29 );
	}, 

	isDistmapS08: function(){
		return this.dijkstra( this.SafeNodes.S08 );
	}, 

	isDistmapS35: function(){
		return this.dijkstra( this.SafeNodes.S35 );
	}, 

	isDistmapH23: function(){
		return this.dijkstra( this.SafeNodes.H23 );
	}, 

	setDistmap: function( _Distmap ){
		this.setDistmapM29( _Distmap[ 0 ] );
		this.setDistmapS08( _Distmap[ 1 ] );
		this.setDistmapS35( _Distmap[ 2 ] );
		this.setDistmapH23( _Distmap[ 3 ] );
	}, 

	setDistmapM29: function( _Distmap ){
		this.Distmap.M29 = [];
		for( var i = 0; i < _Distmap.length; i++ ){
			this.Distmap.M29[ i ] = _Distmap[ i ];
		}
	}, 

	setDistmapS08: function( _Distmap ){
		this.Distmap.S08 = [];
		for( var i = 0; i < _Distmap.length; i++ ){
			this.Distmap.S08[ i ] = _Distmap[ i ];
		}
	}, 

	setDistmapS35: function( _Distmap ){
		this.Distmap.S35 = [];
		for( var i = 0; i < _Distmap.length; i++ ){
			this.Distmap.S35[ i ] = _Distmap[ i ];
		}
	}, 

	setDistmapH23: function( _Distmap ){
		this.Distmap.H23 = [];
		for( var i = 0; i < _Distmap.length; i++ ){
			this.Distmap.H23[ i ] = _Distmap[ i ];
		}
	}, 

//ネットワークに対しダイクストラ法による経路距離計算
	dijkstra: function( _StartNodes ){
		var _DistMaps = [];
		var _CulcMaps = [];
		//計算用Map配列と経路距離Map配列の初期化
		for( var i in this.Nodes ){
			_CulcMaps[ i ] = 1;
			_DistMaps[ i ] = -1;
		}

		var _startNodeLen = 0;
		//計算用Map配列と経路距離Map配列から始点群を除外
		for( var i in _StartNodes ){
			_DistMaps[ _StartNodes[ i ] ] = 0;
			_startNodeLen++;
		}

		while( true ){
			//始点群から経路距離Map配列の更新
			for( i = 0; i < _startNodeLen; i++ ){
				var _connectNode = 0;
				//document.getElementById( 'text' ).innerHTML += "i: "+i+" nodeConnect: "+_StartNodes[ i ];
				//document.getElementById( 'text' ).innerHTML += ", "+this.Nodes[ _StartNodes[ i ] ].Connects.length+"<br>";
				for( var j = 0; j < this.Nodes[ _StartNodes[ i ] ].Connects.length; j++ )_connectNode++;
				if( _connectNode > 0 ){
					for( j = 0; j < _connectNode; j++ ){
						var _dist = this.Nodes[ _StartNodes[ i ] ].Connects[ j ][ 2 ];
						if( _DistMaps[ this.Nodes[ _StartNodes[ i ] ].Connects[ j ][ 0 ] ] == -1 ){
							_DistMaps[ this.Nodes[ _StartNodes[ i ] ].Connects[ j ][ 0 ] ] = _dist+_DistMaps[ _StartNodes[ i ] ];
							_CulcMaps[ this.Nodes[ _StartNodes[ i ] ].Connects[ j ][ 0 ] ] = 0;
						}else if( _DistMaps[ this.Nodes[ _StartNodes[ i ] ].Connects[ j ][ 0 ] ] > _dist+_DistMaps[ _StartNodes[ i ] ] ){
							_DistMaps[ this.Nodes[ _StartNodes[ i ] ].Connects[ j ][ 0 ] ] = _dist+_DistMaps[ _StartNodes[ i ] ];
							_CulcMaps[ this.Nodes[ _StartNodes[ i ] ].Connects[ j ] ] = 0;
						}
					}
				}
			}

			//始点群候補の選定
			var _closestDist = meshW*meshH;
			var _closestNode = -1;
			var culcNum=0;
			for( i = 0; i < nodeLen; i++ ){
				if( _CulcMaps[ i ] == 0 ){
					culcNum++;
					var _connectNode = 0;
					for( var j in this.Nodes[ i ].Connects )_connectNode++;
					if( _connectNode == 0 ){
						_CulcMaps[ i ] = 1;
					}else{
						if( _closestDist > _DistMaps[ i ] && _DistMaps[ i ] >= 0 ){
							_closestNode = i;
							_closestDist = _DistMaps[ i ];
						}
					}
				}
			}
			//document.getElementById( 'text' ).innerHTML += " "+culcNum;

			//document.getElementById( 'text' ).innerHTML += "closestNode: "+_closestNode+"<br>";
			_StartNodes = [];
			//始点群の更新と計算用Map配列から始点群を除外
			if( _closestNode >= 0 ){
				_StartNodes = [ _closestNode ];
				_CulcMaps[ _closestNode ] = 1;
				_startNodeLen = _StartNodes.length;
			}
			else break;
		}

		//経路距離Map配列のリターン
		return( _DistMaps );
	}

};

//GeoMesh Class
THREE.GeoMesh = function( _Vertices, _U, _V ){

	this.Vertices = [];
	for( var i = 0; i < _Vertices.length; i++ ){
		this.Vertices[ i ] = new THREE.Vector3( _Vertices[ i ][ 0 ], _Vertices[ i ][ 1 ], _Vertices[ i ][ 2 ] );
	}
	this.U = _U;
	this.V = _V;

};

THREE.GeoMesh.prototype = {

	construcor: THREE.GeoMesh, 

//UVメッシュのUを入力
	setU: function( _U ){
		this.U = _U;
	},

//UVメッシュのVを入力
	setV: function( _V ){
		this.V = _V;
	},

//UVメッシュの座標情報を入力
	setVertices: function( _Vertices ){
		this.Vertices = [];
		for( var i = 0; i < _Vertices.length; i++ ){
			this.Vertices[ i ] = new THREE.Vector3( _Vertices[ i ][ 0 ], _Vertices[ i ][ 1 ], _Vertices[ i ][ 2 ] );
		}
	}, 

//メッシュ上への点の投影
	projectPoint: function( _point ){
		for( var i = 0; i < this.V; i++ ){
			for( var j = 0; j < this.U; j++ ){
				for( var k = 0; k < 2; k++ ){
					var _face = [ this.Vertices[ (  j+k  )+(  i  )*( this.U+1 ) ], 
						      this.Vertices[ ( j+1-k )+( i+k )*( this.U+1 ) ], 
						      this.Vertices[ (  j+k  )+( i+1 )*( this.U+1 ) ] ];
					var _prjPoint = inPointTri( _point, _face );
					if( _prjPoint.lengthSq() > 0 ){
						return _prjPoint;
					}
				}
			}
		}
		return new THREE.Vector3( 0, 0, 0 );
	}, 

//メッシュ上への線分の投影
	projectLine: function( _line ){
		var _isBreak = [ false, false ];
		var _startNodeU = -1;
		var _startNodeV = -1;
		var _startNodeM = -1;
		var _startPoint;
		var _endNodeU = -1;
		var _endNodeV = -1;
		var _endNodeM = -1;
		var _endPoint;
		//始点と終点の投影･情報登録
		for( var i = 0; i < this.V; i++ ){
			for( var j = 0; j < this.U; j++ ){
				for( var k = 0; k < 2; k++ ){
					var _face = [ this.Vertices[ (  j+k  )+(  i  )*( this.U+1 ) ], 
						      this.Vertices[ ( j+1-k )+( i+k )*( this.U+1 ) ], 
						      this.Vertices[ (  j+k  )+( i+1 )*( this.U+1 ) ] ];
					
					if( !_isBreak[ 0 ] ){
						var _pStartPoint = inPointTri( _line[ 0 ], _face );
						if( _pStartPoint.lengthSq() > 0 ){
							_isBreak[ 0 ] = true;
							_startNodeU = j;
							_startNodeV = i;
							_startNodeM = k;
							_startPoint = _pStartPoint.clone();
							if( _isBreak[ 0 ] && _isBreak[ 1 ] ){
								break;
							}
						}
					}
					if( !_isBreak[ 1 ] ){
						var _pEndPoint = inPointTri( _line[ 1 ], _face );
						if( _pEndPoint.lengthSq() > 0 ){
							_isBreak[ 1 ] = true;
							_endNodeU = j;
							_endNodeV = i;
							_endNodeM = k;
							_endPoint = _pEndPoint.clone();
							if( _isBreak[ 0 ] && _isBreak[ 1 ] ){
								break;
							}
						}
					}
				}
				if( _isBreak[ 0 ] && _isBreak[ 1 ] )break;
			}
			if( _isBreak[ 0 ] && _isBreak[ 1 ] )break;
		}

		//始点と終点の間にあるポリゴン境界との交点探索
		//発見されたポリゴン境界との交点から、
		//次に交点が現れるであろうポリゴンを推測し、
		//それを次の探索対象ポリゴンとし、
		//そのポリゴン境界と線分の交点を探索する。

		//探索用の仮始点の登録
		var _targetU = _startNodeU;
		var _targetV = _startNodeV;
		var _targetM = _startNodeM;
		//始点をポリラインに登録する
		var _polyline = [ _startPoint ];
		var _moveDir = -1;
		var count = 0;
		while( true ){
			var _isInteracted = false;
			//探索対象ポリゴンが終点を含んでいる場合
			if( _targetU == _endNodeU && _targetV == _endNodeV && _targetM == _endNodeM ){
				//終点をポリラインに登録し、whileループから離脱
				if( new THREE.Vector3().subVectors( _polyline[ _polyline.length-1 ], _endPoint ).lengthSq() > 0.0000001 ){
					_polyline.push( _endPoint );
				}
				break;
			}
			//探索対象のポリゴンを作成
			_face = [ this.Vertices[ (  _targetU+_targetM  )+(     _targetV      )*( this.U+1 ) ], 
				  this.Vertices[ ( _targetU+1-_targetM )+( _targetV+_targetM )*( this.U+1 ) ], 
				  this.Vertices[ (  _targetU+_targetM  )+(    _targetV+1     )*( this.U+1 ) ] ];
			var _normal = new THREE.Vector3().crossVectors( new THREE.Vector3().subVectors( _face[ 0 ], _face[ 1 ] ), 
								 new THREE.Vector3().subVectors( _face[ 2 ], _face[ 1 ] ) );
			_normal.normalize();
			var _plane = new THREE.Vector4( _normal.x, 
							_normal.y, 
							_normal.z, 
							_normal.dot( _face[ 1 ] ) );
			var _intPoint = new THREE.Vector3();
			//前回探索対象だったポリゴンの状態と交点の方向から今回の探索行動を選択
			if( _targetM == 0 ){
				if( _moveDir != 2 ){
					_intPoint = intSegSeg( [ new THREE.Vector3( _line[ 0 ].x, _line[ 0 ].y, 0 ), 
								 new THREE.Vector3( _line[ 1 ].x, _line[ 1 ].y, 0 ) ], 
							       [ new THREE.Vector3( _face[ 1 ].x, _face[ 1 ].y, 0 ), 
								 new THREE.Vector3( _face[ 0 ].x, _face[ 0 ].y, 0 ) ] );
					if( _intPoint.lengthSq() > 0.0000001 ){
						if( _targetV-1 < 0 ){
							_moveDir = 2;
							continue;
						}else{
							_targetV -= 1;
							_targetM = 1;
							_moveDir = 0;
							_intPoint = intLinePlane( _plane, _intPoint, new THREE.Vector3( 0, 0, 1 ) );
							if( new THREE.Vector3().subVectors( _polyline[ _polyline.length-1 ], _intPoint ).lengthSq() > 0.0000001 ){
								_polyline.push( _intPoint );
							}
							_isInteracted = true;
							continue;
						}
					}
				}
				if( _moveDir != 4 ){
					_intPoint = intSegSeg( [ new THREE.Vector3( _line[ 0 ].x, _line[ 0 ].y, 0 ), 
								 new THREE.Vector3( _line[ 1 ].x, _line[ 1 ].y, 0 ) ], 
							       [ new THREE.Vector3( _face[ 2 ].x, _face[ 2 ].y, 0 ), 
								 new THREE.Vector3( _face[ 1 ].x, _face[ 1 ].y, 0 ) ] );
					if( _intPoint.lengthSq() > 0.0000001 ){
						_targetM = 1;
						_moveDir = 4;
						_intPoint = intLinePlane( _plane, _intPoint, new THREE.Vector3( 0, 0, 1 ) );
						if( new THREE.Vector3().subVectors( _polyline[ _polyline.length-1 ], _intPoint ).lengthSq() > 0.0000001 ){
							_polyline.push( _intPoint );
						}
						_isInteracted = true;
						continue;
					}
				}
				if( _moveDir != 1 ){
					_intPoint = intSegSeg( [ new THREE.Vector3( _line[ 0 ].x, _line[ 0 ].y, 0 ), 
								 new THREE.Vector3( _line[ 1 ].x, _line[ 1 ].y, 0 ) ], 
							       [ new THREE.Vector3( _face[ 0 ].x, _face[ 0 ].y, 0 ), 
								 new THREE.Vector3( _face[ 2 ].x, _face[ 2 ].y, 0 ) ] );
					if( _intPoint.lengthSq() > 0.0000001 ){
						if( _targetU-1 < 0 ){
							_moveDir = 1;
							continue;
						}else{
							_targetU -= 1;
							_targetM = 1;
							_moveDir = 3;
							_intPoint = intLinePlane( _plane, _intPoint, new THREE.Vector3( 0, 0, 1 ) );
							if( new THREE.Vector3().subVectors( _polyline[ _polyline.length-1 ], _intPoint ).lengthSq() > 0.0000001 ){
								_polyline.push( _intPoint );
							}
							_isInteracted = true;
							continue;
						}
					}
				}
			}else{
				if( _moveDir != 4 ){
					_intPoint = intSegSeg( [ new THREE.Vector3( _line[ 0 ].x, _line[ 0 ].y, 0 ), 
								 new THREE.Vector3( _line[ 1 ].x, _line[ 1 ].y, 0 ) ], 
							       [ new THREE.Vector3( _face[ 1 ].x, _face[ 1 ].y, 0 ), 
								 new THREE.Vector3( _face[ 0 ].x, _face[ 0 ].y, 0 ) ] );
					if( _intPoint.lengthSq() > 0.0000001 ){
						_targetM = 0;
						_moveDir = 4;
						_intPoint = intLinePlane( _plane, _intPoint, new THREE.Vector3( 0, 0, 1 ) );
						if( new THREE.Vector3().subVectors( _polyline[ _polyline.length-1 ], _intPoint ).lengthSq() > 0.0000001 ){
							_polyline.push( _intPoint );
						}
						_isInteracted = true;
						continue;
					}
				}
				if( _moveDir != 0 ){
					_intPoint = intSegSeg( [ new THREE.Vector3( _line[ 0 ].x, _line[ 0 ].y, 0 ), 
								 new THREE.Vector3( _line[ 1 ].x, _line[ 1 ].y, 0 ) ], 
							       [ new THREE.Vector3( _face[ 2 ].x, _face[ 2 ].y, 0 ), 
								 new THREE.Vector3( _face[ 1 ].x, _face[ 1 ].y, 0 ) ] );
					if( _intPoint.lengthSq() > 0.0000001 ){
						if( _targetV+1 >= this.V ){
							_moveDir = 0;
							continue;
						}else{
							_targetV += 1;
							_targetM = 0;
							_moveDir = 2;
							_intPoint = intLinePlane( _plane, _intPoint, new THREE.Vector3( 0, 0, 1 ) );
							if( new THREE.Vector3().subVectors( _polyline[ _polyline.length-1 ], _intPoint ).lengthSq() > 0.0000001 ){
								_polyline.push( _intPoint );
							}
							_isInteracted = true;
							continue;
						}
					}
				}
				if( _moveDir != 3 ){
					_intPoint = intSegSeg( [ new THREE.Vector3( _line[ 0 ].x, _line[ 0 ].y, 0 ), 
								 new THREE.Vector3( _line[ 1 ].x, _line[ 1 ].y, 0 ) ], 
							       [ new THREE.Vector3( _face[ 0 ].x, _face[ 0 ].y, 0 ), 
								 new THREE.Vector3( _face[ 2 ].x, _face[ 2 ].y, 0 ) ] );
					if( _intPoint.lengthSq() > 0.0000001 ){
						if( _targetU+1 >= this.U ){
							_moveDir = 3;
							continue;
						}else{
							_targetU += 1;
							_targetM = 0;
							_moveDir = 1;
							_intPoint = intLinePlane( _plane, _intPoint, new THREE.Vector3( 0, 0, 1 ) );
							if( new THREE.Vector3().subVectors( _polyline[ _polyline.length-1 ], _intPoint ).lengthSq() > 0.0000001 ){
								_polyline.push( _intPoint );
							}
							_isInteracted = true;
							continue;
						}
					}
				}
			}

			//その回の探索で交点が見つからなかったときの処理
			if( !_isInteracted ){
				if( _moveDir > -1 ){
					if( _moveDir == 0 ){
						_targetV += 1;
						_moveDir = 2;
					}else if( _moveDir == 1 ){
						_targetU += 1;
						_moveDir = 3;
					}else if( _moveDir == 2 ){
						_targetV -= 1;
						_moveDir = 0;
					}else if( _moveDir == 3 ){
						_targetU -= 1;
						_moveDir = 1;
					}
					if( _targetM == 0 ){
						_targetM = 1;
					}else if( _targetM == 1 ){
						_targetM = 0;
					}
				}
			}

			//whileループからの強制離脱
			
			count++;
			if( count > 20 ){
				//document.getElementById( 'text' ).innerHTML += "count: "+count+" <br>";
				break;
			}
			
		}
		return _polyline;
	}

};
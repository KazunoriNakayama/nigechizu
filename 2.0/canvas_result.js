//draw();

function drawConsole( _displayData ){
	var canvas = document.getElementById("result_canvas");
	canvas.setAttribute( 'width', '712' );
	canvas.setAttribute( 'height', '576' );
	var result = new Graphics2D( initializeContext( canvas ), 712, 576 );
	with( result ){
		//ここだけなんかプロセッシングっぽくシテイルヨー。
		//background(0,0,0);
		fill(255,255,255);
		stroke(255,255,255);
		var division = 10.0;
		drawUnits( true, 0,3, division );//目盛（上か？、軸線のｙ、足の長さ、分割数）
		var step = width/division;
		for( var i = 0; i <= division; i++ ){
			lineDashed( step*i, 0, step*i, height );
		}
		drawUnits( false, height, 3, division );

		var topChart = new Chart2D( 0, 0, width, height/3.0-6 );
		topChart.setLabels("安全避難地点増加数","","");
		topChart.setPadding( 25, 3, 3 );

		var data = [];
		var _maxX = 0;
		var _minY = 0;
		var _maxY = 0;
		if( !_displayData ){
			dataNum = 201;
			data = [dataNum];
			for( var i = 0; i < dataNum; i++ ){
				   data[ i ] = new Array();
				   data[ i ][ 0 ] = parseFloat(i+".0")*20.0;
				   data[ i ][ 1 ] = Math.random()*100.0;
			}
			_maxX = 10000;
			_maxY = 100;
		}else{
			for( var i = 0; i < _displayData.length; i++ ){
				data[ i ] = [];
				data[ i ][ 0 ] = parseFloat( i+".0" )*50.0;
				data[ i ][ 1 ] = _displayData[ i ][ 3 ]*1.0;
				if( i == 0 )_minY = data[ i ][ 1 ];
				if( _maxY < data[ i ][ 1 ] )_maxY = data[ i ][ 1 ];
				if( _minY > data[ i ][ 1 ] )_minY = data[ i ][ 1 ];
			}
			_maxX = _displayData.length*50.0;
		}
		topChart.setDataLimits( 0, _maxX, _minY, _maxY);
		topChart.setData( data );
		topChart.flipVertical();

		setChart( topChart );
		chartBorder( true );
		writePolyline( true );
		drawChart();

		var middleChart = new Chart2D( 0, height/3.0+3, width, (height/3.0)*2.0-3 );
		middleChart.setLabels("削減避難時間","","");
		middleChart.setPadding( 25, 3, 3 );

		data = [];
		_maxX = 0;
		_minY = 0;
		_maxY = 0;
		if( !_displayData ){
			for(var i = 0;i<dataNum;i++){
				data[ i ] = new Array();
				data[ i ][ 0 ] = parseFloat(i+".0")*20.0;
				data[ i ][ 1 ] = Math.random()*100.0;
				_maxX = 10000;
				_maxY = 100;
			}
		}else{
			
			for( var i = 0; i < _displayData.length; i++ ){
				data[ i ] = [];
				data[ i ][ 0 ] = parseFloat( i+".0" )*50.0;
				data[ i ][ 1 ] = _displayData[ i ][ 4 ]*1.0;
				if( i == 0 )_minY = data[ i ][ 1 ];
				if( _maxY < data[ i ][ 1 ] )_maxY = data[ i ][ 1 ];
				if( _minY > data[ i ][ 1 ] )_minY = data[ i ][ 1 ];
			}
			_maxX = _displayData.length*50.0;
		}
		middleChart.setDataLimits( 0, _maxX, _minY, _maxY );
		middleChart.setData( data );

		setChart( middleChart );
		chartBorder( true );
		writePolyline( true );
		drawChart();

		var bottomChart = new Chart2D(0,(height/3.0)*2.0+6,width,height);
		bottomChart.setLabels("整備コスト","","");
		bottomChart.setPadding( 25, 3, 3 );

		data = [];
		_maxX = 0;
		_minY = 0;
		_maxY = 0;
		if( !_displayData ){
			for( var i = 0; i < dataNum; i++ ){
				data[ i ] = new Array();
				data[ i ][ 0 ] = parseFloat(i+".0")*20.0;
				data[ i ][ 1 ] = Math.random()*100.0;
				_maxX = 10000;
				_maxY = 100;
			}
		}else{
			for( var i = 0; i < _displayData.length; i++ ){
				data[ i ] = [];
				data[ i ][ 0 ] = parseFloat( i+".0" )*50.0;
				data[ i ][ 1 ] = _displayData[ i ][ 5 ]*1.0;
				if( i == 0 )_minY = data[ i ][ 1 ];
				if( _maxY < data[ i ][ 1 ] )_maxY = data[ i ][ 1 ];
				if( _minY > data[ i ][ 1 ] )_minY = data[ i ][ 1 ];
			}
			_maxX = _displayData.length*50.0;
		}
		bottomChart.setDataLimits( 0, _maxX, _minY, _maxY );
		bottomChart.setData( data );
		bottomChart.flipVertical();

		setChart( bottomChart );
		chartBorder( true );
		writePolyline( true );
		drawChart();
	}
	updateRanking( _displayData );
}

function updateRanking( _displayData ){
	var _tNColor = "#ffffff", _tTColor = "#ffffff", _tCColor = "#ffffff";
	var _sortData = [];
	for( var i = 0; i < _displayData.length; i++ ){
		_sortData[ i ] = [];
		for( var j = 0; j < _displayData[ i ].length; j++ ){
			if( j == 2 ){
				_sortData[ i ][ j ] = [];
				if( _displayData[ i ][ j ].length > 0 ){
					for( var k = 0; k < _displayData[ i ][ j ].length; k++ ){
						_sortData[ i ][ j ][ k ] = [];
						var _tower = [], _line = [];
						if( _displayData[ i ][ j ][ k ][ 'tower' ].length > 0 ){
							for( var l = 0; l < _displayData[ i ][ j ][ k ][ 'tower' ].length; l++ ){
								_tower[ l ] = _displayData[ i ][ j ][ k ][ 'tower' ][ l ];
							}
						}
						if( _displayData[ i ][ j ][ k ][ 'line' ].length > 0 ){
							for( var l = 0; l < _displayData[ i ][ j ][ k ][ 'line' ].length; l++ ){
								_line[ l ] = [ _displayData[ i ][ j ][ k ][ 'line' ][ l ][ 0 ], _displayData[ i ][ j ][ k ][ 'line' ][ l ][ 1 ] ];
							}
						}
						_sortData[ i ][ j ][ k ].push( { 'tower': _tower, 'line': _line } );
					}
				}
			}else{
				_sortData[ i ][ j ] = _displayData[ i ][ j ];
			}
		}
	}
	switch( rankingMode ){
		case 0: 
			_sortData.sort( function( a, b ){ return b[ 0 ]-a[ 0 ]; } );
			break;
		case 1: 
			_sortData.sort( function( a, b ){ return b[ 3 ]-a[ 3 ]; } );
			_tNColor = "#ffcc00";
			break;
		case 2: 
			_sortData.sort( function( a, b ){ return a[ 4 ]-b[ 4 ]; } );
			_tTColor = "#ffcc00";
			break;
		case 3: 
			_sortData.sort( function( a, b ){ return b[ 5 ]-a[ 5 ]; } );
			_tCColor = "#ffcc00";
			break;
	}
	for( var i = 0; i < 6; i++ ){
		updateDisplay( 
			_sortData[ i ][ 3 ], 
			_sortData[ i ][ 4 ], 
			_sortData[ i ][ 5 ], 
			"time: "+_sortData[ i ][ 1 ]+" id: "+_sortData[ i ][ 0 ], 
			i+1 
		);
		jQuery( ".tN-ranking-"+( i+1 ) ).css( 'color', _tNColor );
		jQuery( ".tT-ranking-"+( i+1 ) ).css( 'color', _tTColor );
		jQuery( ".tC-ranking-"+( i+1 ) ).css( 'color', _tCColor );
	}

}
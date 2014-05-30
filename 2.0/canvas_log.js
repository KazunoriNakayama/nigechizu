//draw();

function drawLog( _displayData, _dataIndex ){
	var canvas = document.getElementById( "log_canvas" );
	canvas.setAttribute( 'width', window.innerWidth );
	canvas.setAttribute( 'height', window.innerHeight );
	var result = new Graphics2D( initializeContext( canvas ), window.innerWidth, window.innerHeight );
	with( result ){
		//ここだけなんかプロセッシングっぽくシテイルヨー。
		//background(0,0,0);
		fill( 255, 255, 255, 0.8 );
		font( "Arial", 20 );
		text( "date: "+/*_displayData[ _dataIndex ][ 1 ]+*/" id: "+_displayData[ _dataIndex ][ 0 ], width-320, 45 );
		text( "安全避難地点: "+_displayData[ _dataIndex ][ 3 ], width-220, 65 );
		text( "総避難時間: "+~~( _displayData[ _dataIndex ][ 4 ]/40 ), width-200, 85 );
		text( "整備コスト: "+~~( _displayData[ _dataIndex ][ 5 ] ), width-190, 105 );

		if( showAllLog ){
			stroke( 255, 255, 255, 0.1 );
			strokeWeight( 1.0 );
			for( var i = 0; i < _displayData.length; i++ ){
				if( _displayData[ i ][ 2 ].length > 0 ){
					var _lastIndex = _displayData[ i ][ 2 ].length-1;
					if( _displayData[ i ][ 2 ][ _lastIndex ][ 'tower' ].length > 0 ){
						for( var j = 0; j < _displayData[ i ][ 2 ][ _lastIndex ][ 'tower' ].length; j++ ){
							var vector = network3D.Nodes[ _displayData[ i ][ 2 ][ _lastIndex ][ 'tower' ][ j ] ].position.clone();
							var vector2 = vector.clone();

							vector.x = vector.x*scale.x+base.x;
							vector.y = vector.y*scale.y+base.y;
							vector.z = vector.z*scale.z+base.z+1;
							vector = projector.projectVector( vector, camera );
							vector.x = canvasW/2+canvasW*vector.x/2;
							vector.y = canvasH/2-canvasH*vector.y/2;

							vector2.x = vector2.x*scale.x+base.x;
							vector2.y = vector2.y*scale.y+base.y;
							vector2.z = ( vector2.z+20 )*scale.z+base.z+1
							vector2 = projector.projectVector( vector2, camera );
							vector2.x = canvasW/2+canvasW*vector2.x/2;
							vector2.y = canvasH/2-canvasH*vector2.y/2;
							line( vector.x, vector.y, vector2.x, vector2.y );
						}
					}
					if( _displayData[ i ][ 2 ][ _lastIndex ][ 'line' ].length > 0 ){
						for( var j = 0; j < _displayData[ i ][ 2 ][ _lastIndex ][ 'line' ].length; j++ ){
							var vector = network3D.Nodes[ _displayData[ i ][ 2 ][ _lastIndex ][ 'line' ][ j ][ 0 ] ].position.clone();
							var vector2 = network3D.Nodes[ _displayData[ i ][ 2 ][ _lastIndex ][ 'line' ][ j ][ 1 ] ].position.clone();

							vector.x = vector.x*scale.x+base.x;
							vector.y = vector.y*scale.y+base.y;
							vector.z = vector.z*scale.z+base.z+1;
							vector = projector.projectVector( vector, camera );
							vector.x = canvasW/2+canvasW*vector.x/2;
							vector.y = canvasH/2-canvasH*vector.y/2;

							vector2.x = vector2.x*scale.x+base.x;
							vector2.y = vector2.y*scale.y+base.y;
							vector2.z = vector2.z*scale.z+base.z+1;
							vector2 = projector.projectVector( vector2, camera );
							vector2.x = canvasW/2+canvasW*vector2.x/2;
							vector2.y = canvasH/2-canvasH*vector2.y/2;
							line( vector.x, vector.y, vector2.x, vector2.y );
						}
					}
				}
			}
		}

		stroke( 255, 180, 0, 1.0 );
		strokeWeight( 1.5 );
		//console.log( _dataIndex );
		if( _displayData[ _dataIndex ][ 2 ].length > 0 ){
			var _lastIndex = _displayData[ _dataIndex ][ 2 ].length-1;
			if( _displayData[ _dataIndex ][ 2 ][ _lastIndex ][ 'tower' ].length > 0 ){
				for( var i = 0; i < _displayData[ _dataIndex ][ 2 ][ _lastIndex ][ 'tower' ].length; i++ ){
					var vector = network3D.Nodes[ _displayData[ _dataIndex ][ 2 ][ _lastIndex ][ 'tower' ][ i ] ].position.clone();
					var vector2 = vector.clone();

					vector.x = vector.x*scale.x+base.x;
					vector.y = vector.y*scale.y+base.y;
					vector.z = vector.z*scale.z+base.z+1;
					vector = projector.projectVector( vector, camera );
					vector.x = canvasW/2+canvasW*vector.x/2;
					vector.y = canvasH/2-canvasH*vector.y/2;

					vector2.x = vector2.x*scale.x+base.x;
					vector2.y = vector2.y*scale.y+base.y;
					vector2.z = ( vector2.z+20 )*scale.z+base.z+1
					vector2 = projector.projectVector( vector2, camera );
					vector2.x = canvasW/2+canvasW*vector2.x/2;
					vector2.y = canvasH/2-canvasH*vector2.y/2;
					line( vector.x, vector.y, vector2.x, vector2.y );
				}
			}
			if( _displayData[ _dataIndex ][ 2 ][ _lastIndex ][ 'line' ].length > 0 ){
				for( var i = 0; i < _displayData[ _dataIndex ][ 2 ][ _lastIndex ][ 'line' ].length; i++ ){
					var vector = network3D.Nodes[ _displayData[ _dataIndex ][ 2 ][ _lastIndex ][ 'line' ][ i ][ 0 ] ].position.clone();
					var vector2 = network3D.Nodes[ _displayData[ _dataIndex ][ 2 ][ _lastIndex ][ 'line' ][ i ][ 1 ] ].position.clone();

					vector.x = vector.x*scale.x+base.x;
					vector.y = vector.y*scale.y+base.y;
					vector.z = vector.z*scale.z+base.z+1;
					vector = projector.projectVector( vector, camera );
					vector.x = canvasW/2+canvasW*vector.x/2;
					vector.y = canvasH/2-canvasH*vector.y/2;

					vector2.x = vector2.x*scale.x+base.x;
					vector2.y = vector2.y*scale.y+base.y;
					vector2.z = vector2.z*scale.z+base.z+1;
					vector2 = projector.projectVector( vector2, camera );
					vector2.x = canvasW/2+canvasW*vector2.x/2;
					vector2.y = canvasH/2-canvasH*vector2.y/2;
					line( vector.x, vector.y, vector2.x, vector2.y );
				}
			}
		}
	}
}
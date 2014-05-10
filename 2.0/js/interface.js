var naviStatus=false;
var howTo = false;

$('#header').click(
	function(){
		if(naviStatus){
			//地図表示（デフォルト）
			$('#navichange').fadeOut('fast',function(){
			   $('#navichange').attr("src","./img/the_log.png");
			   $('#navichange').fadeIn('fast');
				naviStatus=false;
			});
			$('#navigation').fadeOut('fast',function(){
				$('#currentResult').fadeIn('fast');
			});
			$('#results').fadeOut('fast');

			$('#header').fadeOut('fast',function(){
				$('#header').width(249);
				$('#header').fadeIn('fast');
			});
			$('#footer').fadeOut('fast',function(){
				$('#footer').width(249);
				$('#footer').fadeIn('fast');
			});

		}else{
			//データ表示
			$('#navichange').fadeOut('fast',function(){
				$('#navichange').attr("src","./img/back_to_the_map.png");
				$('#navichange').fadeIn('fast');
				naviStatus=true;
			});
			$('#currentResult').fadeOut('fast',function(){
				$('#navigation').fadeIn('fast');
				$('#results').fadeIn('fast');
			});
			$('#header').fadeOut('fast',function(){
				$('#header').width(983);
				$('#header').fadeIn('fast');
			});
			$('#footer').fadeOut('fast',function(){
				$('#footer').width(983);
				$('#footer').fadeIn('fast');
			});
		}
	}
);

$('#footer').click(
	function() {
		if(howTo){
			$('#howTo').fadeIn('fast');
			howTo = false;
		}else{
			$('#howTo').fadeOut('fast');
			howTo = true;
		}
	}
);

$('#howTo').click(
	function(){
		$('#howTo').fadeOut('fast');
		//alert('hi');
		howTo = true;
	}
);
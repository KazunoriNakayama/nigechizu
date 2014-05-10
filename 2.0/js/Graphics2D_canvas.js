// little snipplets for drawing using the "canvas" element

function initializeContext( _canvas ) {
	if (!_canvas || !_canvas.getContext) {
		return false;
	} else {
		return _canvas.getContext( '2d' );
		//canvas = _canvas.getContext( '2d' );
	}
}

function Graphics2D(_ctx, _w, _h) {
	this.ctx = _ctx;
	this.width = _w;
	this.height = _h;
	this.isFill = true;
	this.fillR = 0, this.fillG = 0, this.fillB = 0;
	this.strokeR = 255, this.strokeG = 255, this.strokeB = 255;
	this.isStroke = true;
	this.ctx.fillStyle = "rgb(" + this.fillR + "," + this.fillG + "," + this.fillB + ")";
	this.ctx.strokeStyle = "rgb(" + this.strokeR + "," + this.strokeG + "," + this.strokeB + ")";
	this.ctx.lineWidth = 1.0;
	this.ctx.font = "12px 'Arial'";

	this.fr = 1000.0 / 30.0;
}

Graphics2D.prototype.frameRate = function (_fps) {
	this.fr = 1000.0 / _fps;
}

Graphics2D.prototype.line = function (_sx, _sy, _ex, _ey) {
	this.ctx.beginPath();
	this.ctx.moveTo(_sx, _sy);
	this.ctx.lineTo(_ex, _ey);
	this.ctx.stroke();
	this.ctx.closePath();
};

Graphics2D.prototype.lineDashed = function (_sx, _sy, _ex, _ey) {
	var segment = 3.0;
	var t = 0.0
	var deltaT = segment / this.distance(_sx, _sy, _ex, _ey);
	var flag = true;
	while (t < 1.0) {
		var tempSX = (_ex - _sx) * t + _sx;
		var tempSY = (_ey - _sy) * t + _sy;
		t += deltaT;
		var tempEX = (_ex - _sx) * t + _sx;
		var tempEY = (_ey - _sy) * t + _sy;
		if (flag) {
			this.line(tempSX, tempSY, tempEX, tempEY);
			flag = false;
		} else {
			flag = true;
		}
	}
};

Graphics2D.prototype.stroke = function (_r, _g, _b, _a) {
	this.isStroke = true;
	this.strokeR = _r;
	this.strokeG = _g;
	this.strokeB = _b;
	if( typeof _a === 'undefined' ){
		this.ctx.strokeStyle = "rgb(" + this.strokeR + "," + this.strokeG + "," + this.strokeB + ")";
	}else{
		this.strokeA = _a;
		this.ctx.strokeStyle = "rgba("+this.strokeR+","+this.strokeG+","+this.strokeB+", "+this.strokeA+")";
	}
};

Graphics2D.prototype.noFill = function () {
	this.isFill = false;
};

Graphics2D.prototype.noStroke = function () {
	this.isStroke = false;
};

Graphics2D.prototype.fill = function (_r, _g, _b, _a) {
	this.isFill = true;
	this.fillR = _r;
	this.fillG = _g;
	this.fillB = _b;
	if( typeof _a === 'undefined' ){
		this.ctx.fillStyle = "rgb(" + this.strokeR + "," + this.strokeG + "," + this.strokeB + ")";
	}else{
		this.strokeA = _a;
		this.ctx.fillStyle = "rgba("+this.strokeR+","+this.strokeG+","+this.strokeB+", "+this.strokeA+")";
	}
};

Graphics2D.prototype.rect = function (_sx, _sy, _dx, _dy) {
	if (this.isFill) {
		this.ctx.fillRect(_sx, _sy, _dx, _dy);
	}

	if (this.isStroke) {
		this.ctx.rect(_sx, _sy, _dx - 1, _dy - 1);
		this.ctx.stroke();
	}
};

Graphics2D.prototype.strokeWeight = function (_float) {
	this.ctx.lineWidth = _float;
};

Graphics2D.prototype.font = function (_fontFamily, _size) {
	this.ctx.font = _size + "px '" + _fontFamily + "'";
};

Graphics2D.prototype.text = function (_string, _x, _y) {
	this.ctx.fillText(_string, _x, _y);
};

Graphics2D.prototype.clear = function () {
	this.ctx.clearRect(0, 0, this.width, this.height);
};

Graphics2D.prototype.background = function (_r, _g, _b, _a) {
	if( typeof _a ==='undefined' ){
		this.ctx.fillStyle = "rgb(" + _r + "," + _g + "," + _b + ")";
	}else{
		this.ctx.fillStyle = "rgba(" + _r + "," + _g + "," + _b + "," + _a + ")";
	}
	this.ctx.fillRect(0, 0, this.width, this.height);
	this.ctx.fillStyle = "rgb(" + this.fillR + "," + this.fillG + "," + this.fillB + ")";
};

Graphics2D.prototype.point=function(_sx,_sy){
	this.ctx.beginPath();
	this.ctx.arc(_sx,_sy,2,this.radians(0),this.radians(360),true);
	this.ctx.fill();
}

Graphics2D.prototype.draw = function () {

};

Graphics2D.prototype.loop = function () {
	setInterval(this.draw(), this.fr);
};

Graphics2D.prototype.println = function (_string) {
	console.log("" + _string);
};

Graphics2D.prototype.radians = function(_degrees){
	return _degrees*(Math.PI/180.0);
};

//////////////////////////////////////////////
//ここからあんまし汎用性無し？
/////////////////////////////////////////////

Graphics2D.prototype.drawUnits = function (_isTop, _y, _h, _division) {
	//horizontal axis line
	this.line(0, _y, this.width, _y);
	var step = this.width / _division;
	for (var i = 0; i < _division + 1; i++) {
		if (_isTop) {
			this.line(step * i, _y, step * i, _y + _h);
		} else {
			this.line(step * i, _y, step * i, _y - _h);
		}
	}
};


Graphics2D.prototype.distance = function (_sx, _sy, _ex, _ey) {
	return Math.sqrt((_sx - _ex) * (_sx - _ex) + (_sy - _ey) * (_sy - _ey));
};

//
// グラフを描くためのクラス
//

Chart2D = function (_sx, _sy, _ex, _ey) {
	this.label =  "";
	this.xLabel = "";
	this.yLabel = "";
	this.sx=_sx;
	this.sy=_sy;
	this.ex=_ex;
	this.ey=_ey;
	this.horizontalPadding=10;
	this.verticalPadding=10;
	this.padTop=10;
	this.padBottom=10;
	this.padRight=10;
	this.padLeft=10;
	this.minX = 0.0, this.maxX = 100.0;
	this.minY = 0.0, this.maxY = 100.0;
	this.data=[];
	this.normalizedData=[];
	this.dataCoordinates=[];
};

Chart2D.prototype.setDataLimits=function(_minX, _maxX, _minY, _maxY)
{
	this.minX = _minX;
	this.maxX = _maxX;
	this.minY = _minY;
	this.maxY = _maxY;
};

Chart2D.prototype.setLabels=function(_label,_labelX,_labelY){
	this.label=_label;
	this.xLabel=_labelX;
	this.yLabel=_labelY;
};

Chart2D.prototype.setPadding=function(_var1,_var2,_var3,_var4){
	if(typeof _var1==="undefined"&&typeof _var2==="undefined"&&typeof _var3==="undefined"&&typeof _var4==="undefined"){
		this.padTop=10;
		this.padBottom=10;
		this.padRight=10;
		this.padLeft=10;
	}else if(typeof _var2==="undefined"&&typeof _var3==="undefined"&&typeof _var4==="undefined"){
		this.padTop=_var1;
		this.padBottom=_var1;
		this.padRight=_var1;
		this.padLeft=_var1;
	}else if(typeof _var3==="undefined"&&typeof _var4==="undefined"){
		if(typeof _var1==="undefined"){
			this.padTop=10;
			this.padBottom=10;
		}else{
			this.padTop=_var1;
			this.padBottom=_var1;
		}
		this.padRight=_var2;
		this.padLeft=_var2;
	}else if(typeof _var4=="undefined"){
		if(typeof _var1==="undefined"){
			this.padTop=10;
		}else{
			this.padTop=_var1;
		}
		if(typeof _var2==="undefined"){
			this.padRight=10;
			this.padLeft=10;
		}else{
			this.padRight=_var2;
			this.padLeft=_var2;
		}
		this.padBottom=_var3;
	}else{
		if(typeof _var1==="undefined")this.padTop=10;
		else this.padTop=_var1;
		if(typeof _var2==="undefined")this.padRight=10;
		else this.padRight=_var2;
		if(typeof _var3==="undefined")this.padBottom=10;
		else this.padBottom=_var3;
		this.padLeft=_var4;
	}
	//console.log("" + this.padTop);
	//console.log("" + this.padBottom);
	//console.log("" + this.padRight);
	//console.log("" + this.padLeft);
};

Chart2D.prototype.setData=function(_array){
	this.data=_array;
	this.normalizedData=[this.data.length];
	for(var i=0;i<this.data.length;i++){
		var xT=(this.data[i][0]-this.minX)/parseFloat((this.maxX-this.minX));
		var yT=(this.data[i][1]-this.minY)/parseFloat((this.maxY-this.minY));
		this.normalizedData[i]=new Array();
		this.normalizedData[i]=[xT,yT];
	}
};

Chart2D.prototype.setDataCoordinates=function(){
	//console.log("normalizedData length:"+this.normalizedData.length);
	var result=new Array(this.normalizedData.length);
	//console.log(result.length);
	for(var i=0;i<result.length;i++){
		//var tempX=this.sx+this.horizontalPadding+(this.ex-this.sx-this.horizontalPadding*2)*this.normalizedData[i][0];
		//var tempY=this.sy+this.verticalPadding+(this.ey-this.sy-this.verticalPadding*2)*this.normalizedData[i][1];
		var tempX=this.sx+this.padLeft+(this.ex-this.sx-this.padLeft-this.padRight)*this.normalizedData[i][0];
		var tempY=this.sy+this.padTop+(this.ey-this.sy-this.padTop-this.padBottom)*this.normalizedData[i][1];
		result[i]=new Array();
		result[i]=[tempX,tempY];
	}
	this.dataCoordinates=result;
};

Chart2D.prototype.flipVertical=function(){
	for(var i=0;i<this.normalizedData.length;i++){
		this.normalizedData[i]=[this.normalizedData[i][0],1-this.normalizedData[i][1]];
	}
}

Chart2D.prototype.flipHorizontal=function(){
	for(var i=0;i<this.data.length;i++){
		this.normalizedData[i]=[1-this.normalizedData[i][0],this.normalizedData[i][1]];
	}
}

//
// Graphics2Dで描画する
//

Graphics2D.prototype.setChart=function(_chart2D){
	this.chart=_chart2D;
	this.writeChartBorder=true;
	this.polyline=false;
}

Graphics2D.prototype.chartBorder=function(_flag){
	this.writeChartBorder=(_flag);
}

Graphics2D.prototype.writePolyline=function(_flag){
	this.polyline=_flag;
}

Graphics2D.prototype.drawChart=function(){
	//draw the border
	if(this.writeChartBorder){
		this.noFill();
		this.rect(this.chart.sx,this.chart.sy,this.chart.ex-this.chart.sx,this.chart.ey-this.chart.sy);
	}
	//draw the labels
	if(!(this.chart.label=="")){
		this.font('serif',12);
		this.text(this.chart.label,(this.chart.sx+this.chart.ex)/2.0,this.chart.sy+13);
	}
	if(!(this.chart.xLabel=="")){
		this.font('serif',12);
		this.text(this.chart.xLabel,(this.chart.sx+this.chart.ex)/2.0,this.chart.ey-13);
	}
	if(!(this.chart.yLabel=="")){
		this.font('serif',12);
		this.text(this.chart.yLabel,this.chart.sx+13,(this.chart.sy+this.chart.ey)/2.0);
	}
	//draw the data
	this.chart.setDataCoordinates();

	if(this.polyline){
		for(var i=0;i<this.chart.dataCoordinates.length-1;i++){
			this.line(
				this.chart.dataCoordinates[i][0],
				this.chart.dataCoordinates[i][1],
				this.chart.dataCoordinates[i+1][0],
				this.chart.dataCoordinates[i+1][1]
			);
		}
	}

	for(var i=0;i<this.chart.dataCoordinates.length;i++){
		this.point(this.chart.dataCoordinates[i][0],this.chart.dataCoordinates[i][1]);
	}

}

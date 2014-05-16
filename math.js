Math.toRad = function(a) {
	return a * Math.PI / 180;
}
Math.ellipse=function(t,o) {
	return {
		x:o.x_radius*Math.cos(2*Math.PI*t/o.time+o.start_angle)*Math.cos(o.rotation)-o.y_radius*Math.sin(2*Math.PI*t/o.time+o.start_angle)*Math.sin(o.rotation)+o.x_offset,
		y:o.x_radius*Math.cos(2*Math.PI*t/o.time+o.start_angle)*Math.sin(o.rotation)+o.y_radius*Math.sin(2*Math.PI*t/o.time+o.start_angle)*Math.cos(o.rotation)+o.y_offset
	}
}
Math.peraph=function(p,a) {
	return {
		smaj:(p+a)/2,
		ecc:(a-p)/(a+p),
		smin:.5*(p+a)*Math.sqrt(1-Math.pow((a-p)/(a+p),2)),
		foci:(a-p)
	}
}
Math.auToKm=function(au) {
	return au*1.496*Math.pow(10,8);
}
Math.kmToAu=function(km) {
	return km*6.685*Math.pow(10,-9);
}
Math.der=function(f, x, dx) {
	return (f(x+(dx || .0000001))-f(x))/(dx || .0000001);
}
Math.distance=function(a,b) {
	return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2));
}
Math.newtonsMethod=function(c,i,a,b) {
	for(var k=0;k<i;k++) {
		c=c-a(c)/(b?b(c):Math.der(a,c));
	}
	return c;
}
Math.ten=function(p) {
	return Math.pow(10,p);
}
Math.posRR=function(radius,radian) {
	return {x:radius*Math.cos(radian),y:radius*Math.sin(radian)}
}
Math.G=6.67384*Math.pow(10,-20);
Math.keplerianMotion=function(a,t) {
	/* Mean motion in radians per year */
	var mm=2*Math.PI/a.time;
	/* Mean anomaly in radians */
	var m=(mm*t);
	/* Eccentric anomaly in radians */
	var e=Math.newtonsMethod(a.ecc>.8?Math.PI:m,20,function(r){return r-a.ecc*Math.sin(r)-m},function(r){return 1-a.ecc*Math.cos(r)});
	/* True anomaly in radians */
	var tr=2*Math.atan2(Math.sqrt(1-a.ecc)*Math.cos(e/2),Math.sqrt(1+a.ecc)*Math.sin(e/2));
	/* Radius in AU */
	return {radius:(a.smaj*(1-Math.pow(a.ecc,2)))/(1+a.ecc*Math.cos(tr)),radian:tr};
}
jQuery.fn.planetaryMotion=function(x,y,au) {
	var el=$(this);
	el.data("keplerianData", {time:0,x_origin:x,y_origin:y,au:au});
	return setInterval(function(){
		var k=Math.keplerianMotion($(el).data("planetData"),$(el).data("keplerianData").time);
		var p=Math.posRR(k.radius*au,k.radian);
		$(el).css({
			"position":"absolute",
			"top":(-p.y+$(el).data("keplerianData").y_origin)+"px",
			"left":(p.x+$(el).data("keplerianData").x_origin+$(el).data("planetData").foci*au)+"px"
		});
		$(el).data("keplerianData").time++;
	},1);
}
jQuery.fn.revolve=function(o) {
	o=$.extend({
		x_radius:100,
		y_radius:100,
		time:2*Math.PI,
		start_angle:0,
		rotation:0,
		x_offset:0,
		y_offset:0,
		during:function(){},
		displays:2*Math.PI/50
	},o)
	o.x_radius=parseFloat(o.x_radius);
	o.y_radius=parseFloat(o.y_radius);
	o.x_offset=parseFloat(o.x_offset);
	o.y_offset=parseFloat(o.y_offset);
	o.start_angle=Math.toRad(parseFloat(o.start_angle));
	o.rotation=Math.toRad(parseFloat(o.rotation));
	o.time=parseFloat(o.time);
	o.displays=parseFloat(o.displays);
	o.displays=o.displays>o.time?o.time:o.displays;
	var el=$(this);
	$(el).data("timeElapsed", 0);
	$(el).data("revolution", o)
	return setInterval(function() {
		var t=parseFloat($(el).data("timeElapsed"));
		var d=$(el).data("revolution");
		var e=Math.ellipse(t, d);
		$(el).css({
			"position":"absolute",
			"top":e.y+"px",
			"left":e.x+"px"
		});
		d.during($(el), t);
		$(el).data("timeElapsed", t+d.time/d.displays);
	}, o.time/o.displays);
}

Math.toRad = function(a) {
	return a * Math.PI / 180;
}
Math.ellipse=function(t,o) {
	return {
		x:o.x_radius*Math.cos(2*Math.PI*t/o.time+o.start_angle)*Math.cos(o.rotation)-o.y_radius*Math.sin(2*Math.PI*t/o.time+o.start_angle)*Math.sin(o.rotation)+o.x_offset,
		y:o.x_radius*Math.cos(2*Math.PI*t/o.time+o.start_angle)*Math.sin(o.rotation)+o.y_radius*Math.sin(2*Math.PI*t/o.time+o.start_angle)*Math.cos(o.rotation)+o.y_offset
	}
}
Math.foci=function(a,b) {
	return Math.sqrt(Math.pow(Math.max(a,b),2)-Math.pow(Math.min(a,b),2));
}
Math.peraph=function(p,a) {
	return {
		smaj:(p+a)/2,
		ecc:(a-p)/(a+p),
		smin:.5*(p+a)*Math.sqrt(1-Math.pow((a-p)/(a+p),2)),
		foci:(a-p)
	}
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

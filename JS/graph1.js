$(document).ready(function () {
	
	var raddep = [];
	
	$.ajax({
		method: "GET",
		url: "/data2",
		//dataType: "json",
		success: function(data) {
		for (var i = 0 ; i <= data.length - 1 ; i++){	
			raddep.push( { text : "Année : " + (data[i].ann).toString(10), count : (data[i].cpt) } );
		}
	
  var bubbleChart = new d3.svg.BubbleChart({
    supportResponsive: true,
    //container: => use @default
    size: 500,
    //viewBoxSize: => use @default
    innerRadius: 500 / 3.4,
    //outerRadius: => use @default
    radiusMin: 37,
    //radiusMax: use @default
    //intersectDelta: use @default
    //intersectInc: use @default
    //circleColor: use @default
    data: {
      items: 
        raddep
      ,
      eval: function (item) {return item.count;},
      classed: function (item) {return item.text.split(" ").join("");}
    },
    plugins: [
	/*
      {
        name: "central-click",
        options: {
          text: "(Plus de détails)",
          style: {
            "font-size": "12px",
            "font-style": "italic",
            "font-family": "Source Sans Pro, sans-serif",
            //"font-weight": "700",
            "text-anchor": "middle",
            "fill": "white"
          },
          attr: {dy: "65px"},
          //centralClick: function() {
            //alert("Il y a ");
          //}
        }
      },
	  */
      {
        name: "lines",
        options: {
          format: [
            {// Line #0
              textField: "count",
              classed: {count: true},
              style: {
                "font-size": "28px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "0px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            },
            {// Line #1
              textField: "text",
              classed: {text: true},
              style: {
                "font-size": "10px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "20px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            }
          ],
          centralFormat: [
            {// Line #0
              style: {"font-size": "50px"},
              attr: {}
            },
            {// Line #1
              style: {"font-size": "30px"},
              attr: {dy: "40px"}
            }
          ]
        }
      }]
  });
  
  		}	
	});
  
});

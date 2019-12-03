window.onload = function () {
		
		// DRAW TRIANGLES
		
		canvasWidth = $(window).width();
		canvasHeight = $(window).height() /* *0.68 */;
		
		 
		triangleNumberY = 19;
		triangleNumberX = 9;
		triangleBaseSize = (canvasWidth / triangleNumberX*1.4);  //1.2
		distY = canvasHeight / triangleNumberY;   //height of each grid section (distribution)
		distX = canvasWidth / triangleNumberX;
	
	    s = Snap(600,600);
	     
	    triangleNum = 1;
	    topOpacity = 1;
	     
	    for(i = 0; i < triangleNumberY; i++){
	    	for(j = 0; j < triangleNumberX; j++){
		    	triangleOpacity = 0;
		    	randomStroke = (Math.random()*1 + 0.4)
	     		triangleBaseSizeRand = (Math.random() + 0.3) * triangleBaseSize;
		     	window['triangle'+triangleNum] = s.polygon(distX*j, distY*i, distX*j+triangleBaseSizeRand, distY*i, distX*j+triangleBaseSizeRand, distY*i+triangleBaseSizeRand).attr({ fill: "white", stroke: "rgb(150,150,150)", opacity: triangleOpacity});
		     	
		     	//rotate triangles a random degree
		     	centrePointX = distX*j+(triangleBaseSizeRand/2);
		     	centrePointY = distY*i+(triangleBaseSizeRand/2);
		     	rotateAmount = Math.random()*360 + 1;
		     	rotateString = 'r'+rotateAmount+','+centrePointX+','+centrePointY;
		     	window['triangle'+triangleNum].transform(rotateString); 
		     	
		     	triangleNum++;
		     }
	     }
	     
	     // VARIABLES FOR SLIDER EVENTS
	     
	     totalTriangles = triangleNum;
	     fadeTime = 400;
	     density = 0;
	     plastics = 0;
	     
	     // CREATE AND SHUFFLE DENSITY ARRAY
	     
	     densityArray = [];
	     
		 for(i = 1; i < totalTriangles; i++){
			 densityArray.push(i);
		 }
		 shuffle(densityArray);
		 
		 function shuffle(a) {
			for (let i = a.length - 1; i > 0; i--) {
			    const j = Math.floor(Math.random() * (i + 1));
			    [a[i], a[j]] = [a[j], a[i]];
			}
		 	return a;
		 } 
	    
	     // EVENT HANDLER - SLIDER
	     
		 $(document).on('input', 'input[type="range"]', function(e) {
			 if(this.id == "density"){
				 switch(parseInt(this.value)){
					 case 0:
					 	for(i = 0; i < densityArray.length; i++) {
						 	window['triangle'+densityArray[i]].stop().animate({opacity: 0},fadeTime);
						}
						$('#density-label span').empty().append("Clear");
						density = 0;
						break;
					 case 1:
					 	for(i = 0; i < densityArray.length; i++) {
							if(i<densityArray.length*0.1){
								window['triangle'+densityArray[i]].stop().animate({opacity: topOpacity},fadeTime);
							} else {
								window['triangle'+densityArray[i]].stop().animate({opacity: 0},fadeTime);
							}
						}
						$('#density-label span').empty().append("Very Low");
						density = 0.1;
						break;
					 case 2:
						for(i = 0; i < densityArray.length; i++) {
							if(i<densityArray.length*0.2){
								window['triangle'+densityArray[i]].stop().animate({opacity: topOpacity},fadeTime);
							} else {
								window['triangle'+densityArray[i]].stop().animate({opacity: 0},fadeTime);
							}
						}
						$('#density-label span').empty().append("Low");
						density = 0.2;
						break;
					case 3:
						for(i = 0; i < densityArray.length; i++) {
							if(i<densityArray.length*0.3){
								window['triangle'+densityArray[i]].stop().animate({opacity: topOpacity},fadeTime);
							} else {
								window['triangle'+densityArray[i]].stop().animate({opacity: 0},fadeTime);
							}
						}
						$('#density-label span').empty().append("Medium");
						density = 0.3;
						break;
					case 4:
						for(i = 0; i < densityArray.length; i++) {
							if(i<densityArray.length*0.5){
								window['triangle'+densityArray[i]].stop().animate({opacity: topOpacity},fadeTime);
							} else {
								window['triangle'+densityArray[i]].stop().animate({opacity: 0},fadeTime);
							}
						}
						$('#density-label span').empty().append("High");
						density = 0.5;
						break;
					case 5:
						for(i = 0; i < densityArray.length; i++) {
							if(i<densityArray.length*0.8){
								window['triangle'+densityArray[i]].stop().animate({opacity: topOpacity},fadeTime);
							} else {
								window['triangle'+densityArray[i]].stop().animate({opacity: 0},fadeTime);
							}
						}
						$('#density-label span').empty().append("Very High");
						density = 0.8;
						break;
				 }
				 plasticsUpdate(density);
			 }
			 if (this.id == "plastics"){
			 	switch(parseInt(this.value)){
					case 0:
				 		for(i = 0; i < densityArray.length; i++) {
							window['triangle'+densityArray[i]].stop().animate({fill: 'white'},500);
						}
						$('#plastics-label span').empty().append("0%");
						break;
					case 1:
				 		for(i = 0; i < densityArray.length; i++) {
							if(i<densityArray.length*0.15*density){
								window['triangle'+densityArray[i]].stop().animate({fill: 'rgb(220,220,220)'},500);
							} else {
								window['triangle'+densityArray[i]].stop().animate({fill: 'white'},500);
							}
						}
						$('#plastics-label span').empty().append("20%");
						plastics = 0.15;
						break;
					case 2:
				 		for(i = 0; i < densityArray.length; i++) {
							if(i<densityArray.length*0.35*density){
								window['triangle'+densityArray[i]].stop().animate({fill: 'rgb(220,220,220)'},500);
							} else {
								window['triangle'+densityArray[i]].stop().animate({fill: 'white'},500);
							}
						}
						$('#plastics-label span').empty().append("40%");
						plastics = 0.35;
						break;
					case 3:
				 		for(i = 0; i < densityArray.length; i++) {
							if(i<densityArray.length*0.55*density){
								window['triangle'+densityArray[i]].stop().animate({fill: 'rgb(220,220,220)'},500);
							} else {
								window['triangle'+densityArray[i]].stop().animate({fill: 'white'},500);
							}
						}
						$('#plastics-label span').empty().append("60%");
						plastics = 0.5;
						break;
					case 4:
				 		for(i = 0; i < densityArray.length; i++) {
							if(i<densityArray.length*0.7*density){
								window['triangle'+densityArray[i]].stop().animate({fill: 'rgb(220,220,220)'},500);
							} else {
								window['triangle'+densityArray[i]].stop().animate({fill: 'white'},500);
							}
						}
						$('#plastics-label span').empty().append("80%");
						plastics = 0.7;
						break;
				 	case 5:
				 		for(i = 1; i < densityArray.length; i++) {
							window['triangle'+densityArray[i]].stop().animate({fill: 'rgb(220,220,220)'},500);
						}
						$('#plastics-label span').empty().append("100%");
						break;
					}
				}
		});  
		
		// UPDATE OPACITY OF TRIANGLES (PLASTICS) ON DENSITY UPDATE
		
		function plasticsUpdate(density){
			console.log("plastics " + plastics + " - density " + density)
			for(i = 0; i < densityArray.length; i++) {
				if(i<densityArray.length*plastics*density){
					window['triangle'+densityArray[i]].animate({fill: 'rgb(220,220,220)'},500);
				} else {
					window['triangle'+densityArray[i]].animate({fill: 'white'},500);
				}
			}
		}

	}
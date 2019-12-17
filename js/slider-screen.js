window.onload = function () {
	
	// DRAW TRIANGLES

	canvasWidth = $(window).width();
	canvasHeight = $(window).height();

	triangleNumberY = 16;
	triangleNumberX = 8;
	triangleBaseSize = (canvasWidth / triangleNumberX) / 1.2;
	console.log(triangleBaseSize);
	distY = canvasHeight / triangleNumberY;   //height of each grid section (distribution)
	distX = canvasWidth / triangleNumberX;

	s = Snap(600, 600);

	triangleNum = 1;

	for (i = 0; i < triangleNumberY; i++) {
		for (j = 0; j < triangleNumberX; j++) {
			triangleOpacity = 0;
			triangleBaseSizeRand = (Math.random() * 1 + 0.8) * triangleBaseSize;
			window['triangle' + triangleNum] = s.polygon(distX * j, distY * i, distX * j + triangleBaseSizeRand, distY * i, distX * j + triangleBaseSizeRand, distY * i + triangleBaseSizeRand).attr({ fill: "white", stroke: "rgb(50,50,50)", opacity: triangleOpacity });

			//rotate triangles a random degree
			centrePointX = distX * j + (triangleBaseSizeRand / 2);
			centrePointY = distY * i + (triangleBaseSizeRand / 2);
			rotateAmount = Math.random() * 360 + 1;
			rotateString = 'r' + rotateAmount + ',' + centrePointX + ',' + centrePointY;
			window['triangle' + triangleNum].transform(rotateString);

			triangleNum++;
		}
	}

	// VARIABLES FOR SLIDER EVENTS

	totalTriangles = triangleNum;
	fadeTime = 400;
	density = 0;
	plastics = 0;
	checkSubmission();
	// CREATE AND SHUFFLE DENSITY ARRAY

	densityArray = [];

	for (i = 1; i < totalTriangles; i++) {
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

	$(document).on('input', 'input[type="range"]', function (e) {
		if (this.id == "density") {
			switch (parseInt(this.value)) {
				case 0:
					for (i = 0; i < densityArray.length; i++) {
						window['triangle' + densityArray[i]].stop().animate({ opacity: 0 }, fadeTime);
					}
					density = 0;
					$('#density-label span').empty().append("Clear");
					$('#density_level').val("Clear");
					break;
				case 1:
					for (i = 0; i < densityArray.length; i++) {
						if (i < densityArray.length * 0.1) {
							window['triangle' + densityArray[i]].stop().animate({ opacity: 0.5 }, fadeTime);
						} else {
							window['triangle' + densityArray[i]].stop().animate({ opacity: 0 }, fadeTime);
						}
					}
					density = 0.1;
					$('#density-label span').empty().append("Very Low");
					$('#density_level').val("Very Low");
					break;
				case 2:
					for (i = 0; i < densityArray.length; i++) {
						if (i < densityArray.length * 0.2) {
							window['triangle' + densityArray[i]].stop().animate({ opacity: 0.5 }, fadeTime);
						} else {
							window['triangle' + densityArray[i]].stop().animate({ opacity: 0 }, fadeTime);
						}
					}
					$('#density-label span').empty().append("Low");
					$('#density_level').val("Low");
					density = 0.2;
					break;
				case 3:
					for (i = 0; i < densityArray.length; i++) {
						if (i < densityArray.length * 0.3) {
							window['triangle' + densityArray[i]].stop().animate({ opacity: 0.5 }, fadeTime);
						} else {
							window['triangle' + densityArray[i]].stop().animate({ opacity: 0 }, fadeTime);
						}
					}
					$('#density-label span').empty().append("Medium");
					$('#density_level').val("Medium");
					density = 0.3;
					break;
				case 4:
					for (i = 0; i < densityArray.length; i++) {
						if (i < densityArray.length * 0.5) {
							window['triangle' + densityArray[i]].stop().animate({ opacity: 0.5 }, fadeTime);
						} else {
							window['triangle' + densityArray[i]].stop().animate({ opacity: 0 }, fadeTime);
						}
					}
					$('#density-label span').empty().append("High");
					$('#density_level').val("High");
					density = 0.5;
					break;
				case 5:
					for (i = 0; i < densityArray.length; i++) {
						if (i < densityArray.length * 0.7) {
							window['triangle' + densityArray[i]].stop().animate({ opacity: 0.5 }, fadeTime);
						} else {
							window['triangle' + densityArray[i]].stop().animate({ opacity: 0 }, fadeTime);
						}
					}
					$('#density-label span').empty().append("Very High");
					$('#density_level').val("Very High");
					density = 0.7;
					break;
			}
			plasticsUpdate(density);
		}
		if (this.id == "plastics") {
			switch (parseInt(this.value)) {
				case 0:
					for (i = 0; i < densityArray.length; i++) {
						window['triangle' + densityArray[i]].stop().animate({ fill: 'white' }, 500);
					}
					$('#plastics-label span').empty().append("0%");
					$('#plastics_level').val("0");
					plastics = 0;
					break;
				case 1:
					for (i = 0; i < densityArray.length; i++) {
						if (i < densityArray.length * 0.15 * density) {
							window['triangle' + densityArray[i]].stop().animate({ fill: 'rgb(220,220,220)' }, 500);
						} else {
							window['triangle' + densityArray[i]].stop().animate({ fill: 'white' }, 500);
						}
					}
					$('#plastics-label span').empty().append("20%");
					$('#plastics_level').val("20");
					plastics = 0.15;
					break;
				case 2:
					for (i = 0; i < densityArray.length; i++) {
						if (i < densityArray.length * 0.3 * density) {
							window['triangle' + densityArray[i]].stop().animate({ fill: 'rgb(220,220,220)' }, 500);
						} else {
							window['triangle' + densityArray[i]].stop().animate({ fill: 'white' }, 500);
						}
					}
					$('#plastics-label span').empty().append("40%");
					$('#plastics_level').val("40");
					plastics = 0.3;
					break;
				case 3:
					for (i = 0; i < densityArray.length; i++) {
						if (i < densityArray.length * 0.5 * density) {
							window['triangle' + densityArray[i]].stop().animate({ fill: 'rgb(220,220,220)' }, 500);
						} else {
							window['triangle' + densityArray[i]].stop().animate({ fill: 'white' }, 500);
						}
					}
					$('#plastics-label span').empty().append("60%");
					$('#plastics_level').val("60");
					plastics = 0.5;
					break;
				case 4:
					for (i = 0; i < densityArray.length; i++) {
						if (i < densityArray.length * 0.7 * density) {
							window['triangle' + densityArray[i]].stop().animate({ fill: 'rgb(220,220,220)' }, 500);
						} else {
							window['triangle' + densityArray[i]].stop().animate({ fill: 'white' }, 500);
						}
					}
					$('#plastics-label span').empty().append("80%");
					$('#plastics_level').val("80");
					plastics = 0.7;
					break;
				case 5:
					for (i = 1; i < densityArray.length; i++) {
						window['triangle' + densityArray[i]].stop().animate({ fill: 'rgb(220,220,220)' }, 500);
					}
					$('#plastics-label span').empty().append("100%");
					$('#plastics_level').val("100");
					plastics = 1;
					break;
			}

			densityUpdate(plastics);
		}
		checkSubmission();
	});

	// UPDATE OPACITY OF TRIANGLES (PLASTICS) ON DENSITY UPDATE

	function plasticsUpdate(density) {
		console.log("update plastics")
		for (i = 0; i < densityArray.length; i++) {
			if (i < densityArray.length * plastics * density) {
				window['triangle' + densityArray[i]].animate({ fill: 'rgb(220,220,220)'}, 500);
			} else {
				window['triangle' + densityArray[i]].animate({ fill: 'rgb(255,255,255)' }, 500);
			}
		}
	}

	function densityUpdate(plastics) {
		for (i = 0; i < densityArray.length; i++) {
			if (i < densityArray.length * plastics * density) {
				window['triangle' + densityArray[i]].animate({ fill: 'rgb(220,220,220)' }, 500);
			} else {
				window['triangle' + densityArray[i]].animate({ fill: 'rgb(255,255,255)' }, 500);
			}
		}
	}
	function checkSubmission() {
		plasticsSlider = document.getElementById("plastics");
		if (density == 0) {
			plasticsSlider.disabled = true;
			plasticsSlider.value = 0;
			plasticsSlider.style.opacity = 0.3;
			plasticsSlider.style.opacity = 0.3;
			$('#plastics-label span').empty().append("0%");
			$('#submit_text').empty().append("Set Sliders");
			$('#ship-container').removeClass('sidenav-trigger');
			$('#ship-container').css("opacity",0.5);
		} else {
			plasticsSlider.disabled = false;
			plasticsSlider.style.opacity = 1;
			plasticsSlider.style.opacity = 1;
			$('#submit_text').empty().append("Submit Report");
			$('#ship-container').addClass('sidenav-trigger');
			$('#ship-container').css("opacity",1);
		}
	}
	$('#density_level').val("Clear");
	$('#plastics_level').val("0");
	$("#ship-container").on('mouseover', function () {
		if(density!=0) $(this).css('box-shadow', '0 14px 28px rgba(0,0,0,0.15), 0 5px 5px rgba(0,0,0,0.22)');
	 }).on('mouseout', function () {
		$(this).css('box-shadow', 'none');
	});

}
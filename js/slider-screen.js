window.onload = function () {
	//variables
	var startTime;
	var endTime;

	//init side menus
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
    const forms = document.querySelectorAll('.side-form');
	M.Sidenav.init(forms, {edge: 'left'})

	
	
	//offline data
	db.enablePersistence()
        .catch(function (err) {
            if (err.code == 'failed-precondition') {
                // probably multible tabs open at once
                console.log('persistance failed');
            } else if (err.code == 'unimplemented') {
                // lack of browser support for the feature
                console.log('persistance not available');
            }
		});
		
	//get location
	getLocation();
	
	
	//init labels
	$('#density_level').val("Clear");
	$('#plastics_level').val("0");

	//ship container interaction
	$("#ship-container").on('mouseover', function () {//hover for desktop
		if(density!=0) $(this).css('box-shadow', '0 14px 28px rgba(0,0,0,0.15), 0 5px 5px rgba(0,0,0,0.22)');
	 }).on('mouseout', function () {
		$(this).css('box-shadow', 'none');
	}).on('click', function () {//set wait message based on cookie
		if(Cookies.get('submit') != 'yes'){
			document.getElementById('submit').style.opacity = 1;
		}else{
			endTime = new Date();
			document.getElementById('submit').style.opacity = 0.6;
			var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
			var resultInMinutes = 30-(Math.round(difference / 60000));
			document.getElementById('wait-msg').innerHTML = "Please wait " + resultInMinutes + " minutes until next submission";
		}
	});
	
    //add location report to data base
	const form = document.querySelector('.location');
    form.addEventListener('submit', evt => {
        evt.preventDefault();
        lat = parseFloat(form.lat.value);
		long = parseFloat(form.long.value);
        if(Cookies.get('submit') != 'yes'){//if form not submitted in last 30 mins
			if (isLatitude(lat) && isLongitude(long) && form.density_level.value != 'Clear') {//basic form validation
				const location = {//create location object
					date: form.date.value,
					coords: new firebase.firestore.GeoPoint(lat, long),
					density: form.density_level.value,
					plastics: form.plastics_level.value
				}
				db.collection('locations').add(location)//submit location to database
					.catch(err => console.log(err));

				//reset form fields
				form.lat.value = '';
				form.long.value = '';
				form.density_level.value = 'Clear';
				form.plastics_level.value = '0';
				//reset sliders
				resetSliders();
				//success message on interface
				document.getElementById('submit-msg').innerHTML = "Report successfully deployed";
				setTimeout(function(){ 
					document.getElementById('submit-msg').innerHTML= " ";
				}, 3000);
				//set new cookie
				var in30Minutes = 1/48;
				Cookies.set('submit', 'yes', {
					expires: in30Minutes
				});
				//set start time for wait message
				startTime = new Date();
				//get new location data
				getLocation();
				
			} else {
				//set validation messages
				if (isLongitude() == false) {
					form.long.value = 'Invaild input - try again';
				}
				if (isLatitude() == false) {
					form.lat.value = 'Invaild input - try again';
				}
				if(form.density_level.value == 'Clear' || form.density_level.value == 'Invalid Input - Set Sliders' ){
					form.density_level.value = 'Invalid Input - Set Sliders'
				}
				if(form.plastics_level.value == '' || form.plastics_level.value == 'Invalid Input - Set Sliders'){
					form.plastics_level.value = 'Invalid Input - Set Sliders'
				}
				getLocation();
			}
		}
    });

    //reset sliders
    function resetSliders(){
        $('#plastics').val("0");
        $('#density').val("0");
        $('#plastics-label span').empty().append("0%");
        $('#density-label span').empty().append("Clear");
        $('#submit_text').empty().append("Set Sliders");
        $('#ship-container').removeClass('sidenav-trigger');
        $('#ship-container').css("opacity",0.5);
        clearTriangles();   
    }

    //Geolocation functionality
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
        } else {
            console.log("Geolocation not supported");
        }
    }
	//set geoloaction form fields
	const latInput = document.getElementById('lat');
    const longInput = document.getElementById('long');
    function geoSuccess(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        lat = lat.toFixed(5);
        long = long.toFixed(5);

        if (isLatitude(lat) && isLongitude(long)) {
            inputLocationDetails(lat, long);
        }
        else {
            inputLocationDetails(0, 0);
        }
    }
    function isLatitude(lat) {
        return isFinite(lat) && Math.abs(lat) <= 90;
    }

    function isLongitude(lng) {
        return isFinite(lng) && Math.abs(lng) <= 180;
	}
	
    const inputLocationDetails = (lat, long) => {
        latInput.value = lat;
        longInput.value = long;
    }
	//Error logs if location can't be obtained
    function geoError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log("User denied permission");
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("postion currently unvailable");
                break;
            case error.TIMEOUT:
                console.log("postion currently unvailable");
                break;
            case error.UNKOWN_ERROR:
                console.log("An unknown error occured");
                break;
        }
    }

    

	//get date
    const dateInput = document.getElementById('date');
    today = new Date();
    date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    dateInput.value = date;
	
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
	//clear triangles after form submission
	function clearTriangles(){
		for (i = 0; i < densityArray.length; i++) {
			window['triangle' + densityArray[i]].animate({ opacity: 0 }, fadeTime);
			window['triangle' + densityArray[i]].animate({ fill: 'white' }, 500);
		}
		plastics = 0;
		density = 0;
		plasticsUpdate(density);
		densityUpdate(plastics);
	}
	//checks whether sliders have been set, prevents form opening if not
	plasticsSlider = document.getElementById("plastics");
	function checkSubmission() {
		if (density == 0) {
			plasticsSlider.disabled = true;
			plasticsSlider.value = 0;
			plasticsSlider.style.opacity = 0.3;
			$('#plastics-label span').empty().append("0%");
			$('#submit_text').empty().append("Set Sliders");
			$('#ship-container').removeClass('sidenav-trigger');
			$('#ship-container').css("opacity",0.5);
		} else {
			plasticsSlider.disabled = false;
			plasticsSlider.style.opacity = 1;
			$('#submit_text').empty().append("Submit Report");
			$('#ship-container').addClass('sidenav-trigger');
			$('#ship-container').css("opacity",1);
		}
	}
	
}
plasticsSlider = document.getElementById("plastics");
plasticsSlider.disabled = true;
plasticsSlider.value = 0;
plasticsSlider.style.opacity = 0.3;
$('#plastics-label span').empty().append("0%");
$('#submit_text').empty().append("Set Sliders");
$('#ship-container').removeClass('sidenav-trigger');
$('#ship-container').css("opacity",0.5);
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('service worker registered', reg))
        .catch((err) => console.log('service worker not registered', err))
}
/*
//IOS Install Prompt
// Detects if device is on iOS 
const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test( userAgent );
  }
  // Detects if device is in standalone mode
  const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
  
  // Checks if should display install popup notification:
  if (isIos() && !isInStandaloneMode()) {
    let a2hsBtnIos = document.querySelector(".ad2hs-prompt-ios");
    a2hsBtnIos.style.display = "block";
    a2hsBtnIos.addEventListener("click", dismissIosHomeScreen);
  }
  function dismissIosHomeScreen(){
    let a2hsBtnIos = document.querySelector(".ad2hs-prompt-ios");
    a2hsBtnIos.style.display = "none";
  }

var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
if(isAndroid && !isInStandaloneMode()) {
	//Chrome Install Prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      showAddToHomeScreen();
    });
    function addToHomeScreen() {
      let a2hsBtn = document.querySelector(".ad2hs-prompt");  // hide our user interface that shows our A2HS button
      a2hsBtn.style.display = 'none';  // Show the prompt
      deferredPrompt.prompt();  // Wait for the user to respond to the prompt
      deferredPrompt.userChoice
        .then(function(choiceResult){
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });}
    function showAddToHomeScreen() {
      let a2hsBtn = document.querySelector(".ad2hs-prompt");
      a2hsBtn.style.display = "block";
      a2hsBtn.addEventListener("click", addToHomeScreen);
    }
}
*/

//Geolocation functionality
function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  }else{
    console.log("Geolocation not supported");
  }
}

function geoSuccess(position){
  var lat = position.coords.latitude;
  var long = position.coords.longitude; 
  lat = lat.toFixed(5);
  long = long.toFixed(5);
  
  if(isLatitude(lat) && isLongitude(long)){
    inputLocationDetails(lat, long);
  }
  else{
    inputLocationDetails(0, 0);
  }
}
function isLatitude(lat) {
  return isFinite(lat) && Math.abs(lat) <= 90;
}

function isLongitude(lng) {
  return isFinite(lng) && Math.abs(lng) <= 180;
}

function geoError(error){
  switch(error.code){
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

getLocation();

var count;
document.addEventListener('DOMContentLoaded', function() {
  count = 0;
}, false);

const latInput = document.getElementById('lat');
const longInput = document.getElementById('long');
const inputLocationDetails = (lat, long) => {
    latInput.value = lat;
    longInput.value = long;
}


const dateInput = document.getElementById('date');
var today = new Date();
var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
dateInput.value = date;

//Sliders
var formDensity = document.getElementById('density_level');
formDensity.value = "Clear";
var sliderDensity = document.getElementById('density');
sliderDensity.oninput = function() {
  if(this.value == 0){
    formDensity.value = "Clear";
  }else if(this.value == 1){
    formDensity.value = "Very Low";
  }else if(this.value == 2){
    formDensity.value = "Medium";
  }else if(this.value == 3){
    formDensity.value = "High";
  }else{
    formDensity.value = "Very High";
  }
  checkSubmission();
}
var formPlastics = document.getElementById('plastics_level');
formPlastics.value = 0;
sliderPlastics = document.getElementById('plastics');
sliderPlasticsLabel = document.getElementById('plastics-label');
sliderPlastics.oninput = function() {
  formPlastics.value = this.value*2*10;
  checkSubmission();
}
function checkSubmission(){
  var submit = document.getElementById('submit_text');
  if(sliderDensity.value == 0){
    sliderPlastics.disabled = true;
    sliderPlastics.style.opacity = 0.3;
    sliderPlasticsLabel.style.opacity = 0.3;
    $('#submit_text').empty().append("Set Sliders");
    $('#ship-container').removeClass('sidenav-trigger');
  }else{
    sliderPlastics.disabled = false;
    sliderPlastics.style.opacity =1;
    sliderPlasticsLabel.style.opacity =1;
    $('#submit_text').empty().append("Submit Report");
    $('#ship-container').addClass('sidenav-trigger');
  }
}
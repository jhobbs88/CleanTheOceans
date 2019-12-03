document.addEventListener('DOMContentLoaded', function(){
    //nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
    //add location
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, {edge: 'left'})
});

//render location data
/*const locations = document.querySelector('.locations');
const renderLocation = (data, id) => {
    console.log(data.coords._lat);
    const html = `
        <div class="card-panel location white row" data-id="${id}">
            <img src="/img/icons/icon-256.png" alt="location thumb">
            <div class="location-details">
                <div class="location-lat"><b>Latitude: </b>${data.coords._lat}</div>
                <div class="location-long"><b>Longitude: </b>${data.coords._long}</div>
                <div class="location-density"><b>Pollution Density: </b>${data.density}</div>
                <div class="location-percentage"><b>Plastic Percentage: </b>${data.plastics}%</div>
            </div>
            <div class="location-delete">
                <i class="material-icons" data-id="${id}">delete_outline</i>
            </div>
        </div>
    `;
    locations.innerHTML += html;
};

//remove location from dom
const removeLocation= (id) => {
    const location = document.querySelector(`.location[data-id=${id}]`);
    console.log(location);
    location.remove();
};
*/

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
sliderPlastics.oninput = function() {
  formPlastics.value = this.value*2*10;
  checkSubmission();
}

function checkSubmission(){
  var submit = document.getElementById('submit_text');
  if(sliderDensity.value == 0 && formPlastics.value == 0){
    submit.style.opacity = "0.2";
  }else{
    submit.style.opacity = "1";
  }
}

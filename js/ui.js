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
var sDensity = document.getElementById('density-level');
var oDensity = document.getElementById('density');
var labelDensity = document.getElementById('density-label');
oDensity.value = "Clear";
sDensity.oninput = function() {
  if(this.value < 10){
    oDensity.value = "Clear";
    labelDensity.innerHTML = "Pollution Level - Clear";
  }else if(this.value < 35){
    oDensity.value = "Light";
    labelDensity.innerHTML = "Pollution Level - Light";
  }else if(this.value < 60){
    oDensity.value = "Medium";
    labelDensity.innerHTML = "Pollution Level - Medium";
  }else if(this.value < 85){
    oDensity.value = "Heavy";
    labelDensity.innerHTML = "Pollution Level - Heavy";
  }else{
    oDensity.value = "Dense";
    labelDensity.innerHTML = "Pollution Level - Dense";
  }
}
var sPlastics = document.getElementById('plastics-level');
var oPlastics = document.getElementById('plastics');
var labelPlastics = document.getElementById('plastics-label');
oPlastics.value = 0;
sPlastics.oninput = function() {
  oPlastics.value = this.value;
  labelPlastics.innerHTML = "Plastics Percentage - "+this.value+"%";
}
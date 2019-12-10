getLocation();
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
count = 0;
//realtime listener gets changes to db in realtime
const debugMsg = document.querySelector('.messages');
db.collection('locations').onSnapshot((snapshot) => {
    count++;
    snapshot.docChanges().forEach(change => {
        if (count == 1) {
            debugMsg.innerHTML = "Connection Established";

        } else {
            if (change.type === 'added') {
                //add to page
                debugMsg.innerHTML = "Report successfully deployed";
            }
            if (change.type === 'removed') {
                //remove from page
                debugMsg.innerHTML = "Report successfully deleted";
            }
        }

    });
})
//add location report to data base
const form = document.querySelector('.location');
form.addEventListener('submit', evt => {
    evt.preventDefault();
    lat = parseFloat(form.lat.value);
    long = parseFloat(form.long.value);
    if (isLatitude(lat) && isLongitude(long)) {
        const location = {
            coords: new firebase.firestore.GeoPoint(lat, long),
            density: form.density - level.value,
            plastics: form.plastics - level.value
        }
        db.collection('locations').add(location)
            .catch(err => console.log(err));

        form.lat.value = '';
        form.long.value = '';
        form.density_level.value = '';
        form.plastics_level.value = '';
        getLocation();
    } else {
        if (isLongitude() == false) {
            form.long.value = 'Invaild input - try again';
        }
        if (isLatitude() == false) {
            form.lat.value = 'Invaild input - try again';
        }
        getLocation();
    }

});

//Geolocation functionality
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    } else {
        console.log("Geolocation not supported");
    }
}

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

const latInput = document.getElementById('lat');
const longInput = document.getElementById('long');
const inputLocationDetails = (lat, long) => {
    latInput.value = lat;
    longInput.value = long;
}


const dateInput = document.getElementById('date');
today = new Date();
date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
dateInput.value = date;


//offline data
db.enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // probably multible tabs open at once
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
  });

//realtime listener gets changes to db in realtime
const debugMsg = document.querySelector('.messages');
db.collection('locations').onSnapshot((snapshot) => {
    count++;
    snapshot.docChanges().forEach(change => {
        if(count == 1){
            debugMsg.innerHTML = "Connection Established";
            
        }else{
            if(change.type === 'added'){
                //add to page
                debugMsg.innerHTML = "Report successfully deployed";
            }
            if(change.type === 'removed'){
                //remove from page
                debugMsg.innerHTML = "Report successfully deleted";
            }
        }
        
    });
    console
})
//add location
const form = document.querySelector('.location');
form.addEventListener('submit', evt => {
    evt.preventDefault();
    lat = parseFloat(form.lat.value);
    long = parseFloat(form.long.value);
    if(isLatitude(lat) && isLongitude(long)){
        const location = {
            coords: new firebase.firestore.GeoPoint(lat,long),
            density: form.density-level.value,
            plastics: form.plastics-level.value
        }
        db.collection('locations').add(location)
        .catch(err => console.log(err));
    
        form.lat.value = '';
        form.long.value = '';
        form.density_level.value = '';
        form.plastics_level.value = '';
        getLocation();
    }else{
        if(isLongitude()==false){
            form.long.value = 'Invaild input - try again';
        }
        if(isLatitude()==false){
            form.lat.value = 'Invaild input - try again';
        }
        getLocation();
    }
    
});
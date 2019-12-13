if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then((reg) => console.log('service worker registered', reg))
    .catch((err) => console.log('service worker not registered', err))
}

//IOS Install Prompt
// Detects if device is on iOS 
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}
// Detects if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// Checks if should display install popup notification:

if (isIos() && !isInStandaloneMode() && Cookies.get('dismissed') != 'yes') {
  let a2hsBtnIos = document.querySelector(".ad2hs-prompt-ios");
  a2hsBtnIos.style.display = "block";
  a2hsBtnIos.addEventListener("click", dismissIosHomeScreen);
}
function dismissIosHomeScreen() {
  Cookies.set('dismissed', 'yes', { expires: 7 })
  let a2hsBtnIos = document.querySelector(".ad2hs-prompt-ios");
  a2hsBtnIos.style.display = "none";
}

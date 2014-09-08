// localStorage.test = '1234';
var successURL = 'https://www.facebook.com/connect/login_success.html';
// function(tabId, changeInfo, tab)
function onFacebookLogin(tabId, changeInfo, tab) {
    console.log('log in : '+tab.url);
    // localStorage.app_id = '7854 4';
    if (tab.url.indexOf(successURL) == 0) {
        var params = tab.url.split('#')[1];
        access = params.split('&')[0]
        console.log('before');
        console.log('test : '+access);
        localStorage['accessToken'] = access;
        chrome.tabs.onUpdated.removeListener(onFacebookLogin);
    }
}
chrome.tabs.onUpdated.addListener(onFacebookLogin);

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello"){
        var params = sender.tab.url.split('#')[1];
        access = params.split('&')[0]
        sendResponse({farewell: access});
    }
});



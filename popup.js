// console.log('start pop up');
// localStorage.test = '5556';
// if (localStorage.accessToken) {
//             var graphUrl = "https://graph.facebook.com/me?" + localStorage.accessToken + "&callback=displayUser";
//             console.log(localStorage.accessToken);
//             console.log(graphUrl);
            // var script = document.createElement("script");
            // script.src = graphUrl;
            // document.body.appendChild(script);
 
            // function displayUser(user) {
            //     console.log(user);
            // }
// }

function loginfacebook(callback) {
    console.log('login face');
    var props = {
        'url' : "https://www.facebook.com/dialog/oauth?"
                                + "display=popup&"
                                + "client_id=244166932405822&"
                                + "redirect_uri=https://www.facebook.com/connect/login_success.html&"
                                + "scope=publish_actions&" + "response_type=token",
        'height' : 400,
        'width' : 580
    }

    chrome.windows.create(props, function(windowObj){
        // console.log("Here's the window object.");
        // chrome.tabs.getAllInWindow(null, function(tabs) {
        //     console.log('inner all...');
        // });
    });

}

function initIFrame() {
	console.log('init frame');
	localStorage.app_id = 'popup page';
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, 
	function(tabs) {
		loginfacebook(initIFrame);
	});
}

document.addEventListener('DOMContentLoaded', function() {
	initIFrame();
});
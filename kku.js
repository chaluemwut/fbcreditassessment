
var server_url = "https://www.fbcredibility.com/sdc/fbapi";
// var server_url = 'https://www.sdc.com/sdc/fbapi';

function templateRating(counter){
	ret = '<div style=height:100%>';
	ret += ' <div>';
	ret += '<input type="radio" id="radio'+counter+'" value="1" name="radio'+counter+'"/>';
	ret += '<input type="radio" id="radio'+counter+'" value="2" name="radio'+counter+'"/>';
	ret += '<input type="radio" id="radio'+counter+'" value="3" name="radio'+counter+'"/>';
	ret += '<input type="radio" id="radio'+counter+'" value="4" name="radio'+counter+'"/>';
	ret += '<input type="radio" id="radio'+counter+'" value="5" name="radio'+counter+'"/>';
	ret += '<input type="radio" id="radio'+counter+'" value="6" name="radio'+counter+'"/>';
	ret += '<input type="radio" id="radio'+counter+'" value="7" name="radio'+counter+'"/>';
	ret += '<input type="radio" id="radio'+counter+'" value="8" name="radio'+counter+'"/>';
	ret += '<input type="radio" id="radio'+counter+'" value="9" name="radio'+counter+'"/>';
	ret += '<input type="radio" id="radio'+counter+'" value="10" name="radio'+counter+'"/>';
	ret += '<button id=sub_'+counter+'>submit</button>';
	ret += ' </div>';
	ret += ' <div style="margin-left:80px">';
	ret += ' <img src="'+chrome.extension.getURL('rating2.png')+'"/>';
	ret += ' </div>';
	ret += '<div>';
	return ret;
}

function createRatingAssessment(divId, linkId){
	var textContent = templateRating(divId);
	textContent += '<input type="hidden" id=fb_link_'+divId+' value="'+linkId+'"/>'
	return templateDiv(divId, textContent);
}

function templateDiv(divId, textContent){
	ret = '<div id=kku_'+divId+' style="position: relative; margin-top: 10px; margin-bottom: 20px; width:100%; height:25px;">';
	ret += '<div class="inline" style="position: relative; margin-top: 3px; color:#FF8000">FB Credibility</div>';
	ret += textContent;
	ret += '</div>';
	return ret;	
}

function getObjId(link){
	var first = link.substring(0,1);
	console.log(first);
	if(first == '/'){ //is posts type
		var short_url = link.split('/');
		if(short_url[2] == 'posts'){
			return short_url[3];
		}
		if(short_url[2] == 'photos'){
			return short_url[4];
		}
	}
	var base_url = link.replace("https://www.facebook.com/","");
	// https://www.facebook.com/OpenSourceForU/photos/a.112258614432.84824.58079349432/10152716463189433/?type=1
	var photo_type = base_url.split('/');
	if(photo_type[1] == 'photos'){
		return photo_type[3];
	}

	// video
	// https://www.facebook.com/video.php?v=10152712805877450
	var video_type = base_url.substring(0,9);
	console.log(video_type);
	if(video_type == 'video.php'){
		return base_url.replace("video.php?v=","");
	}

	//permalink permalink.php?story_fbid=910840168926902&id=100000027825211
	var permalink_type = base_url.substring(1,14);
	console.log('per link : '+permalink_type);
	if(permalink_type == 'permalink.php'){
		var permalink_data = base_url.replace("permalink.php?story_fbid=","");
		var permalink_list = permalink_data.split('&');
		return permalink_list[0].substring(1, permalink_list[0].length);
	}

	return 'none';
}

$(document).ready(function () {
	chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
		localStorage.accessToken = response.farewell;
	});

	var counter=0;
	setInterval(function(){
		// console.log('start script update');
		// console.log('local token : '+localStorage.accessToken);
		if(!localStorage.accessToken){
			return;
		}
		$("[class*='userContentWrapper']").each(function(i){
			var sub_stream = $(this);
			var clearfix = $(sub_stream).find("[class='clearfix _5x46']");
			var info_source = $(clearfix).find("a");
			// console.log(clearfix.text());
			
			if($(clearfix).find("[id^='kku_']").length){
				// console.log('found');
			} else {
				var index_count = $(sub_stream).children().length;
				var link_id = $(clearfix).find("span[class='fsm fwn fcg'] > a[class='_5pcq']");
				console.log('link '+link_id.attr('href'));
				clearfix.append(createRatingAssessment(counter, link_id.attr('href')));
				$("#sub_"+counter).click(function(){
					var obj = $(this);
					// console.log('counter '+obj.attr('id'));
					var obj_id = obj.attr('id').replace("sub_","");
					var data = $("#radio"+obj_id+":checked");
					var post_obj = $(sub_stream).find("#fb_link_"+obj_id);
					var post_id = getObjId(post_obj.val());
					// console.log('post id '+post_id);
					// console.log(post_id.val());
					// var token = localStorage.accessToken.replace('access_token=','')
					var token = localStorage.accessToken
					var urlCall = server_url+"?rating="+data.val()+"&obj_id="+post_id+"&return_id="+obj_id+"&token="+token;
					console.log('url '+urlCall);
					$.ajax({
						type: "GET",
						async: true,
						url: urlCall,
						withCredentials: true,
						success: function(result){
							console.log(result);
							ret_id = result['return_id'];
							description = result['description'];
							var data = '';
							if (result['status'] == 0) {
								data = '<div id=msg_'+ret_id+' style="color:green;">'+description+'</div>';
							} else {
								data = '<div id=msg_'+ret_id+' style="color:red;">'+description+'</div>';
							}
							$('#kku_'+ret_id).append(data);
							// $('#msg_'+ret_id).addClass('inline');
						}
					});
				});
				counter++;
			}
		});
		// console.log('end script');
	}, 3000);

});
console.log('end script');

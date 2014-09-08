
var server_url = "https://www.sdc.com/sdc/fbapi";

function templateRating(counter){
	ret = '<div>';
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
	ret += '</div>';
	return ret;
}

function createRatingAssessment(divId, linkId){
	var textContent = templateRating(divId);
	textContent += '<input type="hidden" id=fb_link_'+divId+' value="'+linkId+'"/>'
	return templateDiv(divId, textContent);
}

function templateDiv(divId, textContent){
	ret = '<div id=kku_'+divId+' style="position: relative; margin-top: 5px; width:100%; height:18px;">';
	ret += '<div class="inline" style="position: relative; margin-top: 3px;">FB Credibility</div>';
	ret += textContent;
	ret += '</div>';
	return ret;	
}

function getObjId(link){
	var first = link.substring(0,1);
	console.log(first);
	if(first == '/'){
		return link.split('/')[3];
	}
	return 'nono';
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
					console.log('post id '+post_id);
					// console.log(post_id.val());
					var token = localStorage.accessToken.replace('access_token=','')
					var urlCall = server_url+"?rating="+data.val()+"&obj_id="+post_id+"&token="+token;
					console.log('url '+urlCall);
					$.ajax({
						type: "GET",
						async: true,
						url: urlCall,
						withCredentials: true,
						success: function(result){
							console.log(result);
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

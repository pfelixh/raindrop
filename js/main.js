$(document).ready(function() {


	// Dot animation
		var dots = document.querySelectorAll('.dot')
		var colors = ['#fff2f2', '#fff2f2', '#fff2f2']
		function animateDots() {
		  for(var i=0; i<dots.length; i++) {
		    dynamics.animate(dots[i], {
		      translateY: -10,
		      backgroundColor: colors[i]
		    }, {
		      type: dynamics.forceWithGravity,
		      bounciness: 800,
		      elasticity: 200,
		      duration: 2000,
		      delay: i * 450
		    })
		  }
		  dynamics.setTimeout(animateDots, 3000)
		}
		animateDots()


	/**
	 * jQuery.ajax mid - CROSS DOMAIN AJAX 
	 * ---
	 * @author James Padolsey (http://james.padolsey.com)
	 * @version 0.11
	 * @updated 12-JAN-10
	 * ---
	 * Note: Read the README!
	 * ---
	 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
	 */
		jQuery.ajax = (function(_ajax){
		    
		    var protocol = location.protocol,
		        hostname = location.hostname,
		        exRegex = RegExp(protocol + '//' + hostname),
		        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
		        query = 'select * from html where url="{URL}" and xpath="*"';
		    
		    function isExternal(url) {
		        return !exRegex.test(url) && /:\/\//.test(url);
		    }
		    
		    return function(o) {
		        
		        var url = o.url;
		        
		        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
		            
		            // Manipulate options so that JSONP-x request is made to YQL
		            
		            o.url = YQL;
		            o.dataType = 'json';
		            
		            o.data = {
		                q: query.replace(
		                    '{URL}',
		                    url + (o.data ?
		                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
		                    : '')
		                ),
		                format: 'xml'
		            };
		            
		            // Since it's a JSONP request
		            // complete === success
		            if (!o.success && o.complete) {
		                o.success = o.complete;
		                delete o.complete;
		            }
		            
		            o.success = (function(_success){
		                return function(data) {
		                    
		                    if (_success) {
		                        // Fake XHR callback.
		                        _success.call(this, {
		                            responseText: (data.results[0] || '')
		                                // YQL screws with <script>s
		                                // Get rid of them
		                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
		                        }, 'success');
		                    }
		                    
		                };
		            })(o.success);
		            
		        }
		        
		        return _ajax.apply(this, arguments);
		        
		    };
		    
		})(jQuery.ajax);


	// Get Date
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		if(dd<10) {
		    dd='0'+dd
		} 
		if(mm<10) {
		    mm='0'+mm
		} 
		today = yyyy+mm+dd;
		console.log(today);


	// Call Moves
		activity(today);
	// Repeat every 10sec (to refresh location)
		setTimeout(function() {
		    activity(today);
		}, 10000);


	// Moves
		function activity(date) {
		    $.ajax({
		        url: "https://api.moves-app.com/api/1.1/user/places/daily/"+date+"?access_token=7hACUBaguM0UI497MrDKJlvYPHu5813EErwFM6UJ7wURsI2d8iLj1BZ0R7Hru2gH",
		        type: 'GET',
		        success: function(res) {
		            log = res.responseText.length;

		            // Isolate latitute, longitute from Moves JSON
		            // If the JSON is below 70 characters, there is no data for the tested day yet
		            if (log > 70) {
		                latPlus = res.responseText.match(/lat":(.*)/)[1];
		                myRegexp = /^.{0,13}/;
		                lat = myRegexp.exec(latPlus);
		                lonPlus = res.responseText.match(/lon":(.*)/)[1];
		                lon = myRegexp.exec(lonPlus);

		                // Pass location to Instagram API call
		                nL(lat[0], lon[0]);
		            } else {
		                latalt = 48.148821;
		                lonalt = 11.573576;
		                nL(latalt, lonalt);
		            }
		        }
		    });            
		}

	
	// Instagram	
		function nL(latitude, longitude) {
			iCall = "https://api.instagram.com/v1/media/search?lat="+latitude+"&lng="+longitude+"&distance=1000&access_token=213551.c886f2d.0fe3ef38bfd341de86f0629024e0a053";
			$.ajax({
				type: "GET", 
				dataType: "jsonp",
				cache: false,
				url: ""+iCall+"",
				success: function(data) {
					locationB = [];
					$(".iLoc").attr("src", latitude+", "+longitude);
					// if img scr === 0, next li
					for (var i = 0; i < 40; i++) {			
						rImg = $(".lB li:nth-child(" + i + ") img").attr("src");
						
						if (rImg === 0) {
		    			} else {
		    				for (var r = i; r < 12+i; r++) {			
								locationB[r] = data.data[r].images.standard_resolution.url;
							}
							for (var j = i+1; j < 13+i; j++) {			
								$(".lB li:nth-child(" + j + ") img").attr("src", locationB[j-1]);
							}
		    			}
					}
				}
			});
		}

	// Insert image function
		state = 1;
		stateB = 1;
		function rainDrop(randColumn) {
			if (state === 20) {
				stateB = 1;
				$(".inv" + randColumn).css("top", "+=380");
				imageScr = $(".lB li:nth-child("+stateB+") img").attr("src");
				$(".lC li:nth-child("+state+")").append("<img src='" + imageScr + "'></img>");
				$(".lC li:nth-child("+state+")").css({'top' : 126+'px',"left" : randColumn+"px", 'opacity' : 1});
				$(".lC li:nth-child("+state+")").addClass("inv" + randColumn);
				state = state + 1;
				stateB = stateB + 1;
			} else if (state > 20) {
				$(".inv" + randColumn).css("top", "+=380");
				imageScr = $(".lB li:nth-child("+stateB+") img").attr("src");
				$(".lC li:nth-child("+state+")").append("<img src='" + imageScr + "'></img>");
				$(".lC li:nth-child("+state+")").css({'top' : 126+'px',"left" : randColumn+"px", 'opacity' : 1});
				$(".lC li:nth-child("+state+")").addClass("inv" + randColumn);
				state = state + 1;
				stateB = stateB + 1;
			} else {
				$(".inv" + randColumn).css("top", "+=380");
				imageScr = $(".lB li:nth-child("+state+") img").attr("src");
				$(".lC li:nth-child("+state+")").append("<img src='" + imageScr + "'></img>");
				$(".lC li:nth-child("+state+")").css({'top' : 126+'px',"left" : randColumn+"px", 'opacity' : 1});
				$(".lC li:nth-child("+state+")").addClass("inv" + randColumn);
				state = state + 1;
			}
		}

	// Return column
		function column() {
			var values = [60 , 440, 820];
			valueToUse = values[Math.floor(Math.random() * values.length)];
		   	return valueToUse;
		}

	// Main
		(function loop() {
		    var rand = Math.round(Math.random() * (15000 - 5000)) + 2000;
		    setTimeout(function() {
		    	
		    	rainDrop(column());
				loop();
		    	
		    }, rand);
		}());

	// Load first three images right away
		setTimeout(function() {
		    rainDrop(60);
		    rainDrop(440);
		    rainDrop(820);
		}, 1800);

});

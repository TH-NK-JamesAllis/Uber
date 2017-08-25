 $(document).ready(function(){
     
     
     $('.button a').on('click',function(e){

         $(this).html('loading...');
         e.preventDefault();
         var src = $('#source').val();
         var dest = $('#destination').val();
         getJourneyEstimate(src,dest);
     })


     function getHomeAddress(){

        var request = $.ajax({
            method: "GET",
            url: "api/gethome",
        })

        request.done(function(data) {
            
            if(!data.error){
                $('.home-address span').html(data.address);
            }
            else{
                $('.home-address span').html("error");
            }

        });
            
        request.fail(function( jqXHR, textStatus ) {
            console.log( "Request failed: " + textStatus );
        });
     }

     getHomeAddress();





     function getHistory(){

        var request = $.ajax({
            method: "GET",
            url: "api/gethistory",
        })

        request.done(function(data) {
            
            if(data.error){
                $('.history').html("error");
            }
            else{
                writeHistory(data.history);
            }

        });
            
        request.fail(function( jqXHR, textStatus ) {
            console.log( "Request failed: " + textStatus );
        });
     }

     getHistory();



     function writeHistory(history){
         var html = "<ul>";

         for(var i=0;i<history.length;i++){
             var duration = secondsToMinutesAndSeconds((history[i].end_time - history[i].start_time));
             var distance = Math.round( history[i].distance * 10) / 10 +" miles";

             html+="<li>"+
             "<span class='start'>Start place: "+history[i].start_city.display_name+"</span>"+
             "<span class='time'>Time: "+duration+"</span>"+
             "<span class='distance'>Distance: "+distance+"</span>"+
             "</li>";


             //getRequestDetails(history[i].request_id);
             getPostcode();


         }

         html += "</ul>";

         $('.history').html(html);
     }


     function getRequestDetails(id){
        var request = $.ajax({
            method: "GET",
            url: "api/getrequestbyid",
            data: { id:id }
        });

        request.done(function(data) {
            console.log(data)
        });

        request.fail(function( jqXHR, textStatus ) {
            console.log( "Request failed: " + textStatus );
        });
     }


     function getPostcode(){
        var request = $.ajax({
            method: "GET",
            url: "https://api.postcodes.io/postcodes",
            data: { lon: '-1.6178', lat: '54.9783' }
        });

        request.done(function(data) {
            console.log(data.result[0].postcode)
        });

        request.fail(function( jqXHR, textStatus ) {
            console.log( "Request failed: " + textStatus );
        });


     }


     function secondsToMinutesAndSeconds(secs) {
         //console.log(millis)
        var minutes = Math.floor(secs / 60);
        var seconds = secs - minutes * 60;
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }



     function getJourneyEstimate(src,dest){

        var request = $.ajax({
            method: "GET",
            url: "api/journey",
            data: { src: src, dest: dest }
        }) 

        request.done(function(data) {
            //console.log("success");
            //console.log(data);

            $('.button a').html('Submit');

            if(!data.error){
                $('.result span.duration').html(data.duration);

                $('.result span.eta').html(data.eta);
                
                setMapDirection();
            }
            else{
                $('.result span').html("error");
            }

        });
            
        request.fail(function( jqXHR, textStatus ) {
            console.log( "Request failed: " + textStatus );
        });
        
        
     }
     

     function setMapDirection(){
        directionsDisplay.setMap(map);

        calculateAndDisplayRoute(directionsService, directionsDisplay)
       
        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
            directionsService.route({
                origin: document.getElementById('source').value,
                destination: document.getElementById('destination').value,
                travelMode: 'DRIVING'
            }, function(response, status) {
                if (status === 'OK') {
                    console.log(response)
                    directionsDisplay.setDirections(response);
                    setTimeout(function(){
                        $('#map').css({
                            opacity:1
                        });
                    },1000)
                    
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }
     }
          
})
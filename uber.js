var Uber = require('node-uber');
var express = require('express')
var app = express();
var path = require('path');
var fs = require('fs');
var https = require('https');

app.use(express.static('public'));


https.createServer({
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-cert.pem')
}, app).listen(3000, function () {
  console.log('Example app listening on port 3000!')
});


/*app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})*/



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/login', function(request, response) {
  var url = uber.getAuthorizeUrl(['history','profile', 'request', 'places']);
  response.redirect(url);
});

app.get('/callback', function(request, response) {
   uber.authorizationAsync({authorization_code: request.query.code})
   .spread(function(access_token, refresh_token, authorizedScopes, tokenExpiration) {
     // store the user id and associated access_token, refresh_token, scopes and token expiration date
     console.log('New access_token retrieved: ' + access_token);
     console.log('... token allows access to scopes: ' + authorizedScopes);
     console.log('... token is valid until: ' + tokenExpiration);
     console.log('... after token expiration, re-authorize using refresh_token: ' + refresh_token);


     // redirect the user back to your actual app
     response.redirect('/');
   })
   .error(function(err) {
       console.log("error")
     console.error(err);
   });
});

app.get('/api/journey', function (req, res) {
    getPriceForRoute(req.query.src,req.query.dest).then(function(duration){

        getETAforAddress(req.query.src).then(function(eta){
            res.send({ duration: duration,eta:eta,error:false });
        }).catch(function(err) {
            res.send({ duration: duration,eta:null,error:false });
        });
        

    }).catch(function(err) {
        res.send({ error:true });
    });
})

app.get('/api/gethome', function (req, res) {
    getHomeAddress().then(function(address){
        res.send({ address: address,error:false });
    }).catch(function(err) {
        
        res.send({ error:true });
    });
})


app.get('/api/gethistory', function (req, res) {
    getHistory().then(function(history){
        res.send(history);
    }).catch(function(err) {
        res.send({ error:true });
    });
})

app.get('/api/getrequestbyid', function (req, res) {
    getRequestById(req.query.id).then(function(requestdetails){
        res.send(requestdetails);
    }).catch(function(err) {
        res.send({ error:true });
    });
})







var uber = new Uber({
  client_id: 'Lw1yKgehKHMy4p7BmqDoedtMkyajdz9-',
  client_secret: 'zWxxzBj9hyVXpdisqhEWu0FT7qfr9T_eGbXCL1DR',
  server_token: 'YrZ7jBAFF9S771eq1XCnzJNgI38WkazKHeZEEuVE',
  //redirect_uri: 'http://localhost:3000/callback',
  redirect_uri: 'https://10.146.1.49:3000/callback',
  name: 'BabyDriverApp',
  language: 'en_US', // optional, defaults to en_US
  sandbox: true, // optional, defaults to false
  proxy: 'PROXY URL' // optional, defaults to none
});

//console.log(uber)

//var url = uber.getAuthorizeUrl(['history','profile', 'request', 'places']);
  //console.log(url)


function getETAforAddress(src){
    return new Promise(function (resolve, reject) {
        uber.estimates.getETAForAddressAsync(src).then(function(res) {
            var eta = res.times[0].estimate/60;
            resolve(eta);
        })
        .catch(function(err) {
            console.error(err);
            reject();  
        });
    })
}




function getPriceForRoute(src,dest){
    return new Promise(function (resolve, reject) {

        uber.estimates.getPriceForRouteByAddressAsync(src,dest).then(function(res) {
            var duration = res.prices[0].duration/60;
            resolve(duration);
            
        })
        .catch(function(err) { 
            console.error(err);
            reject(); 
        });
    })
}


function getHomeAddress(){
    return new Promise(function (resolve, reject) {
        uber.places.getHomeAsync().then(function(res) {
            resolve(res.address);
        }).catch(function(err) {
             console.error(err);
             reject();
        });
    })
}

function getHistory(){
    return new Promise(function (resolve, reject) {
        uber.user.getHistoryAsync(0, 5).then(function(res) {
            resolve(res);
        }).catch(function(err) {
             console.error(err);
             reject();
        });
    })
}


function getRequestById(id){
    return new Promise(function (resolve, reject) {
        uber.requests.getByIDAsync(id).then(function(res) { 
            resolve(res);
        }).catch(function(err) {
             console.error(err);
             reject();
        });
    })
}
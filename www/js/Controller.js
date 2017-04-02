var objects={};
angular.module('dbProject.controllers', ['rmHoldButton'])
.controller('registerUser', ['$scope', 'myService', '$location', '$rootScope','$cordovaGeolocation','$ionicPopup','$ionicLoading', function ($scope, myService, $location, $rootScope, $cordovaGeolocation,$ionicPopup,$ionicLoading) {
    // $rootScope.location = $location.path();

$scope.slideHasChanged=function(i){
if(i===1){
initialize();
}

}
$scope.submit=function(username,password,email,contact,address){

console.log(username,password,email,contact,address)
if(username !== undefined && password !== undefined && email !== undefined && contact !== undefined && address !== undefined &&  $scope.shopLat !== undefined &&  $scope.shopLong !== undefined){
   
var abc={username:username,password:password,email:email,mobileNo:contact,address:address,lat: $scope.shopLat, lng: $scope.shopLong};
     myService.registerUser(abc).success(function(res){



            if (res == "Used") {
                alert("This user has already an accout")
                $location.path('/register')
            }
            else {
                console.log("inElse");
                $rootScope.loggedIn = true;
                $location.path("/login");
            }
        });

}
else{
  alert('Please fill the form properly');
}
}

    console.log("Hello World")
    $scope.username = '';
    $scope.email = '';
    $scope.password = '';
  
  var slong=0;
 var marker;
 
  var latLng;
var mapOptions;
var map=null;
   
           function initialize(){
          if(map===null){
          console.log('call');
              latLng=new google.maps.LatLng(24.8615,67.0099)

              mapOptions = {
                        center: latLng,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                      };
     map = new google.maps.Map(document.getElementById("map_nearest"), mapOptions);
    $scope.map=map;

         var centerControlDiv = document.createElement('div');
                  var centerControl = new CenterControl(centerControlDiv, map);

                        centerControlDiv.index = 1;
                map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);


         

                   
google.maps.event.addListenerOnce($scope.map, 'idle', function(){
map.addListener('click', function(e) {
          placeMarkerAndPanTo(e.latLng, map);
        });
}) 
}
        }
 
  function placeMarkerAndPanTo(latLng, map) {

  console.log(latLng.lat(),latLng.lng());
  if(!marker){
        marker = new google.maps.Marker({
          position: latLng,
          icon:'img/ic.png',
          map: map
        });
        marker.setMap(map);
         $scope.shopLat=latLng.lat();
        $scope.shopLong=latLng.lng();
      }
      else{
        marker.setPosition(latLng);
console.log("ASD",marker.getPosition());

        $scope.shopLat=latLng.lat();
        $scope.shopLong=latLng.lng();
      }
      }


function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #000000';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.5)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to Find Your Self';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'cursive';
  controlText.style.fontSize = '15px';
  controlText.style.lineHeight = '35px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.classList.add("ion-navigate");
  controlText.innerHTML = 'Find Me';
  controlUI.appendChild(controlText);
  controlUI.addEventListener('click', function() {
  // Setup the click event listeners: simply set the map to Chicago.
      var options = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
  // latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);


 
  var pos=new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  console.log(pos)
       map.panTo(pos);
     if(!marker){
        marker = new google.maps.Marker({
          position: pos,
          icon:'img/ic.png',
          map: map
        });
        marker.setMap(map);
         $scope.shopLat=pos.lat();
        $scope.shopLong=pos.lng();
      }
      else{
        marker.setPosition(pos);
console.log("ASD",marker.getPosition());

        $scope.shopLat=pos.lat();
        $scope.shopLong=pos.lng();
      }
        marker.setMap(map);

 

  }, function(error){
 
      var alertPopup = $ionicPopup.alert({
       title: 'GPS Error',
       template: 'Please Open your Geo Location'
     });
     alertPopup.then(function(res) {
    
     });
       // $timeout(function() { $state.go($state.current, {}, {reload: true});}, 3);

  });
  
 });
}


      
    $scope.register = function (form) {
     var abc={username:$scope.username,email:$scope.email,password:$scope.password}
   
        console.log("IwantToRegister")
        console.log(abc);

        console.log(abc);

        if(form.$valid){
        myService.registerUser(abc).success(function(res){



            if (res == "Used") {
                alert("This user has already an accout")
                $location.path('/register')
            }
            else {
                console.log("inElse");
                $rootScope.loggedIn = true;
                $location.path("/login");
            }
        })};

    }


}]).controller('loginUser',['$scope','myService','$location',function($scope,myService,$location)
    {

  //  $rootScope.location = $location.path();

    $scope.login=function(form) {
        console.log("i AM login")

        var userObj = {username: $scope.username, password: $scope.password};
        console.log("loggin in ka object", userObj);
        if (form.$valid) {
            myService.login(userObj).success(function (res) {
                console.log(res);
                console.log(res);
                if (res.error) {
                    alert("Error")
                    $scope.username = "";
                    $scope.password = "";
                    $location.path('/login')

                }
                else {
                    //   $rootScope.loggedIn=true;
                    $location.path('/home')

                }
            });
        }
    }
  
}])

.controller('adminloginUser',['$scope','myService','$location','$window',function($scope,myService,$location,$window)
    {

  //  $rootScope.location = $location.path();

    $scope.login=function(form) {
        if($scope.username=="itsmemz" && $scope.password=="itsmemz"){
   
           $location.path("/adminShops");
         $window.location.reload(true);
        }
        else{
          alert("try again");
        }
    }

  
}])


.controller('Friends',['$scope','myService','$location','$window',function($scope,myService,$location,$window)
    {


  
}])

.controller('Authentication', ['$scope', 'myService','$location', function ($scope, myService,$location) {
  
    console.log($scope.page);

  myService.isAuthenticated().success(function (res) {
    console.log("Authentication Called");
        if(res==true){
             $location.path('watchproducts')
        }
        else{
             $location.path('home')
        }
           

    });


}]).controller('adminShops', ['$scope', 'myService','$location','$state','$window','$ionicPopup','$timeout', function ($scope, myService,$location,$state,$window,$ionicPopup,$timeout) {
    var shopname=[];
  var shoparea=[];
  var shopcover=[];
  var shopcategory=[];
  var shopid=[];
  var shoplong=[];
  var shoplat=[];
  var shopaddr=[];
  var myData ;
  myService.getnotVerifiedShops().success(function(res){
console.log(res);
    for(var i in res){
        shopname.push(res[i].shopName);
        shoparea.push(res[i].shopArea);
        shopcover.push(res[i].shopCover);
        shopcategory.push(res[i].categoryName);
        shoplong.push(res[i].shopLong);
        shoplat.push(res[i].shopLat);
         shopaddr.push(res[i].shopAddr);
        shopid.push(res[i]._id);
      }
      myData = shopname.map(function(value, index) {
    return {
        name: value,
        area: shoparea[index],
       longi:shoplong[index],
       lat:shoplat[index],
        cover: shopcover[index],
        addr: shopaddr[index],
        category:shopcategory[index],
        _id:shopid[index]
    }

  })
      console.log(myData);

       $scope.places=myData;
     });
      $scope.approve=function(mobj){
        console.log(mobj);
          var obj={vid:mobj._id,shopName:mobj.name,shopAddr:mobj.addr, shopArea:mobj.area,shopLong:mobj.longi, shopLat:mobj.lat, category:mobj.category, shopCover:mobj.cover};
        console.log(obj);
      myService.sendVerifiedShop(obj).success(function(res){
        if (res == true) {
                var alertPopup = $ionicPopup.alert({
              title: 'Verified Successfully',
              template: 'This shop is now Visible '
              });
     alertPopup.then(function(res) {
       $window.location.reload(true);
     });
            $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
   }, 5000);

            }
            else  {
                 var alertPopup = $ionicPopup.alert({
              title: 'Error !',
              template: 'Try again'
              });
     alertPopup.then(function(res) {
       $window.location.reload(true);
     });
            $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
   }, 5000);
            }
        });
      }
      $scope.hello1=function(){
var alertPopup = $ionicPopup.alert({
              title: 'Are You A Shop Keeper ?',
              template: 'Now You can also show your shop on the Map !'
              });
     alertPopup.then(function(res) {
    var asd = $ionicPopup.alert({
              title: 'Hurry !',
              template: 'Fill out the form correctly !'
              });
     asd.then(function(res) {
    var aPopup = $ionicPopup.alert({
              title: 'Instructions ',
              template: '<ul><li>1-Please stand near to the shop, to detect your exact location</li><li>2-You should open your GPS.</li><li>3-Please be appropriate with the details</li><li>4-Please upload a clear image of your Shop (Name should be visible) </li><li>5-Image size should be less than 30 MB</li><li>6-Please Select the categories wisely, so that your shop can be categorized</li></u>'
              });
     aPopup.then(function(res) {
   
     });
     });
     });
            $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
   }, 4000);
 }
      $scope.reject=function(mobj){
          console.log(mobj);
          var obj={vid:mobj._id,shopName:mobj.name,shopAddr:mobj.addr, shopArea:mobj.area,shopLong:mobj.longi, shopLat:mobj.lat, category:mobj.category, shopCover:mobj.cover};
        console.log(obj);
      myService.rejected(obj).success(function(res){
        if (res == true) {
                  var alertPopup = $ionicPopup.alert({
              title: 'Rejected Successfully !',
              template: 'This shop is now Successfully removed from the database'
              });
     alertPopup.then(function(res) {
       $window.location.reload(true);
     });
            $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
   }, 5000);

            }
            else  {
               var alertPopup = $ionicPopup.alert({
              title: 'Error !',
              template: 'Try Again.'
              });
     alertPopup.then(function(res) {
       $window.location.reload(true);
     });
            $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
   }, 5000);
            }
        });
      }     


 $scope.deliver=function(){
     var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p> For Delivery in Karachi,<br><br><br> Please Contact on:<br> <a href="tel:+923332571546">+92-3332571546</a></p><p style="font-size:10px"> <i>* Delivery charges may apply according to your location and minimum of 500rs delivery is required. </i></p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
  }

}]).controller('shopProfile', ['$scope', 'myService','$location','$window','$ionicPopup','$timeout','$cordovaGeolocation', '$ionicLoading', function ($scope, myService,$location,$window,$ionicPopup,$timeout,$cordovaGeolocation, $ionicLoading) {   
  var slat=0;
  var slong=0;
     $scope.doRefresh = function() {
$window.location.reload(true);
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
    
  }
  initialize2();
function initialize2() {
/*  
var options = { timeout: 30000, enableHighAccuracy: true, maximumAge: 10000 };
                 console.log("here")
          //event.preventDefault();
       
      if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(function(position) {
    locate=true;
            var geocoder = new google.maps.Geocoder();
             geocoder.geocode({
              "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            },
            function(results, status) {
              if (status == google.maps.GeocoderStatus.OK){
                $scope.from=results[0].formatted_address
                slat=results[0].geometry.location.lat();
                slong=results[0].geometry.location.lng()
                console.log("Here"+results[0].geometry.location);
              }
              else
              console.log("error");
            });
            pos=new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                 mapOptions = {
                  center:pos,
                zoom: 15,
               mapTypeId: google.maps.MapTypeId.ROADMAP
              };

        },onError,options);


    } else {
        // Browser doesn't support Geolocation
        alert("Please Open Your GPS");
        handleNoGeolocation(false);
    }*/
    var pyrmont;
 var mapOptions
var ind=null;
     ionic.Platform.ready(function(){        
     
         
        var posOptions = {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 10000
        };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            slat  = position.coords.latitude;
            slong = position.coords.longitude;
             $scope.shopLat=slat;
                $scope.shopLong=slong;
             locate=true;
             pos = new google.maps.LatLng(slat, slong);
             console.log("here"+pos);
            var mapOptions = {
                center: pos,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };          
             
                   
             
   
                  
             
        }, function(err) {
          
            onError();
            console.log(err);
        });
    });               
}
var locate=false;

function onError(){
locate=false;
var myhe=$ionicPopup.alert({
       title: 'Error',
       template: 'Please open your GPS and come back !'
     });
     myhe.then(function(res) {
       myhe.close();
     });}

         $scope.colors = {autoParts: false, Batteries: false,Electronics: false, bicyleShop: false,
         bikeShop: false, carShop: false,
       Rental: false, showRooms: false,
       Washing: false, Books: false,
       fitnessEquipments: false, Stationary: false,
       sportsWear: false, sportsAccesories: false,Cafe: false, chaatGolaShop: false,Dhaba: false, Coconut: false,
       frenchFries : false,
       Restaurants: false, Soup: false,gentGarments: false, Watches: false,gentsUnderGarments: false, gentShoes: false,
       Perfume: false, eyeWear: false,ladiesGarments: false, ladiesUnderGarments: false,ladiesShoes: false, Cosmetics: false,
       artificialJewelery: false, handBag_purse_keyChain: false,kidGarments: false, kidShoes: false,babyProducts: false, Toys: false,
       Groceries: false, Sweets: false,Vegetables: false, bakery: false,Fruits: false, pharmacy: false,
       aquarium: false, movieGames: false,Gifts: false, dairyProduct: false,Tobacco: false, mobileCards: false,
       Computer: false, electronicAppliances: false,electricItems: false, Furniture: false,Hardware: false, Paints: false,
       Sanitary: false, Mobile: false,hospital: false, airport: false,amusement_park: false, travel_agency: false,
       art_gallery : false, atm: false,zoo: false, bank: false,bar: false, beauty_salon: false,
       bowling_alley: false, bus_station: false,campground: false, casino: false,cemetery: false, church: false,
       city_hall: false, courthouse: false,embassy: false, fire_station: false,furniture_store: false, gas_station: false,
       gym: false, hair_care: false,hindu_temple: false, real_estate_agency: false,laundry: false,   library: false, liquor_store: false,locksmith: false, mosque: false,
       veterinary_care: false, movie_theater: false,museum: false, night_club: false,park: false, pet_store: false,
       university: false, physiotherapist: false,post_office: false, school: false,shopping_mall: false, spa: false,
       stadium: false, train_station: false ,caterers : false, Chinese:false ,BBQ:false,fastFood:false};
var cat=[];
 $scope.stepsModel = [];

    $scope.imageUpload = function(element){
        var reader = new FileReader();
        reader.onload = $scope.imageIsLoaded;

        reader.readAsDataURL(element.files[0]);

    }

    $scope.imageIsLoaded = function(e){
        $scope.$apply(function() {
            $scope.stepsModel.push(e.target.result);
              console.log($scope.stepsModel);
        });
    }
  $scope.SendShop=function(shopName,shopArea,shopAddr,shopLong,shopLat){
console.log(shopName,shopArea,shopAddr,shopLong,shopLat);
console.log("check");
 var j=0
 for(var d in $scope.colors){
  if($scope.colors[d] == true)
  {

    cat.push(d);
    
  }
 }

  $scope.hello1=function(){
var alertPopup = $ionicPopup.alert({
              title: 'Are You A Shop Keeper ?',
              template: 'Now You can also show your shop on the Map !'
              });
     alertPopup.then(function(res) {
    var asd = $ionicPopup.alert({
              title: 'Hurry !',
              template: 'Fill out the form correctly !'
              });
     asd.then(function(res) {
    var aPopup = $ionicPopup.alert({
              title: 'Instructions ',
              template: '<ul><li>1-Please stand near to the shop, to detect your exact location</li><li>2-You should open your GPS.</li><li>3-Please be appropriate with the details</li><li>4-Please upload a clear image of your Shop (Name should be visible) </li><li>5-Image size should be less than 30 MB</li><li>6-Please Select the categories wisely, so that your shop can be categorized</li></u>'
              });
     aPopup.then(function(res) {

     });
     });
     });
            $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
   }, 4000);
 }

         for(var as=0;as<cat.length;as++){
  var obj={shopName:shopName,shopAddr:shopAddr, shopArea:shopArea,shopLong:shopLong, shopLat:shopLat, category:cat[as], shopCover:$scope.stepsModel[0]};
      myService.sendShop(obj).success(function(res){
        if (res == true) {
              var alertPopup = $ionicPopup.alert({
              title: 'Submitted',
              template: '<p>Your Shop have been submitted for the Verification</p><p>Please Contact Us:  <br><a href="tel:+923332571546">+92-3332571546</a>'
              });
     alertPopup.then(function(res) {
       $window.location.reload(true);
     });
            $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
   }, 10000);
            }
            else  {
                  var alertPopup = $ionicPopup.alert({
              title: 'Error !',
              template: 'Sorry fill out the form again , and check your Internet Connection'
              });
     alertPopup.then(function(res) {
       $window.location.reload(true);
     });
            $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
   }, 5000);
            }
        });
    } 
   
         $scope.colors = {autoParts: false, Batteries: false,Electronics: false, bicyleShop: false,
         bikeShop: false, carShop: false,
       Rental: false, showRooms: false,
       Washing: false, Books: false,
       fitnessEquipments: false, Stationary: false,
       sportsWear: false, sportsAccesories: false,Cafe: false, chaatGolaShop: false,Dhaba: false, Coconut: false,
       frenchFries : false,
       Restaurants: false, Soup: false,gentGarments: false, Watches: false,gentsUnderGarments: false, gentShoes: false,
       Perfume: false, eyeWear: false,ladiesGarments: false, ladiesUnderGarments: false,ladiesShoes: false, Cosmetics: false,
       artificialJewelery: false, handBag_purse_keyChain: false,kidGarments: false, kidShoes: false,babyProducts: false, Toys: false,
       Groceries: false, Sweets: false,Vegetables: false, bakery: false,Fruits: false, pharmacy: false,
       aquarium: false, movieGames: false,Gifts: false, dairyProduct: false,Tobacco: false, mobileCards: false,
       Computer: false, electronicAppliances: false,electricItems: false, Furniture: false,Hardware: false, Paints: false,
       Sanitary: false, Mobile: false,hospital: false, airport: false,amusement_park: false, travel_agency: false,
       art_gallery : false, atm: false,zoo: false, bank: false,bar: false, beauty_salon: false,
       bowling_alley: false, bus_station: false,campground: false, casino: false,cemetery: false, church: false,
       city_hall: false, courthouse: false,embassy: false, fire_station: false,furniture_store: false, gas_station: false,
       gym: false, hair_care: false,hindu_temple: false, real_estate_agency: false,laundry: false,   library: false, liquor_store: false,locksmith: false, mosque: false,
       veterinary_care: false, movie_theater: false,museum: false, night_club: false,park: false, pet_store: false,
       university: false, physiotherapist: false,post_office: false, school: false,shopping_mall: false, spa: false,
       stadium: false, train_station: false ,caterers : false};

}
  $scope.deliver=function(index){
      myService.reqUser().success(function(res){
        if (res == false) {
          $location.path("/login");

}
            else  {
              console.log(res);
                  if(index===1){
              var myObj={user:res, msg:"My House is on Fire, Need Help!!"};
               console.log(myObj);
 myService.sendEmail(myObj).success(function(res){

   var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and Fire Brigade Station</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });
    
   }
   else if(index===2){
                  var myObj={user:res, msg:"Attacked by Robbers, Need Help!!"};
 myService.sendEmail(myObj).success(function(res){
  
var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and Police Station</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });

   }
else{
 var myObj={user:res, msg:"Health Emergency, Need Help!!"};
 myService.sendEmail(myObj).success(function(res){
  
var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and nearby Hospital</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });
  
}

            }
          });

   }

}]).controller('getDetails', ['$scope', 'myService', '$stateParams', '$location','$window','$ionicPopup','$timeout',function ($scope, myService,$stateParams,$location,$window,$ionicPopup,$timeout){
  //$window.location.reload(true);
    $scope.doRefresh = function() {
$window.location.reload(true);
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
    
  }
    $scope.id = $stateParams.id;
    console.log($stateParams);
    var userId=[];
    var Review=[];
    var myDate=[];
        var myrate=[];
      // set the rate and max variables
  $scope.rating = 4;
  $scope.data = {
    rating : 3,
    max: 5
  }
    $scope.hello1=function(){
var alertPopup = $ionicPopup.alert({
              title: 'Are You A Shop Keeper ?',
              template: 'Now You can also show your shop on the Map !'
              });
     alertPopup.then(function(res) {
    var asd = $ionicPopup.alert({
              title: 'Hurry !',
              template: 'Fill out the form correctly !'
              });
     asd.then(function(res) {
    var aPopup = $ionicPopup.alert({
              title: 'Instructions ',
              template: '<ul><li>1-Please stand near to the shop, to detect your exact location</li><li>2-You should open your GPS.</li><li>3-Please be appropriate with the details</li><li>4-Please upload a clear image of your Shop (Name should be visible) </li><li>5-Image size should be less than 30 MB</li><li>6-Please Select the categories wisely, so that your shop can be categorized</li></u>'
              });
     aPopup.then(function(res) {
  
     });
     });
     });
            $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
   }, 4000);
 }
$scope.$watch('data.rating', function() {
  console.log('New value: '+$scope.data.rating);
}); 
    $scope.SendDetails = function(Product,review,rate){
        console.log(Product);
        console.log("Ye review hai",review,rate);
    
        var myobject={review : review , Shop : Product,rate:rate};

         myService.sendReview(myobject).success(function (res) {
          if(res==true){
            alert("Your Review Added");

           $window.location.reload(true);
          }
          else{
                var alertPopup = $ionicPopup.alert({
              title: 'Login First !',
              template: 'Oh Snap You Have To Login To Add A Review !'
              });
     alertPopup.then(function(res) {
       $location.path("login");
   
    
     });
            $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
   }, 2000);

            

          }


    });

    };

   $scope.readOnly = true;
    myService.getShopsWithId($scope.id).success(function (res) {
      console.log("here");
           console.log(res.Shop);
        $scope.product = res.Shop;
        console.log($scope.product);
 
        if(res.Review !== "No_Review"){
        for(var i in res.Review){
          userId.push(res.Review[i].UserId);
          Review.push(res.Review[i].UserReview);
          myDate.push(res.Review[i].date);
          myrate.push(res.Review[i].UserRating);

        }
         var myData = userId.map(function(value, index) {
    return {
        name: value,
        review: Review[index],
        date: myDate[index],
        rate: myrate[index]
      }
  });
         var sum=0;
         for(var i=0;i<myrate.length;i++){
          sum=sum+myrate[i];
         }
         sum=sum/myrate.length;
         $scope.shopRate=sum;
        console.log($scope.product);
        console.log(myData);
        $scope.Reviews=myData;
       

}
    });
     $scope.hello=function(redir){
      $location.path(''+redir);
        
 }
  $scope.deliver=function(index){
      myService.reqUser().success(function(res){
        if (res == false) {
          $location.path("/login");

}
            else  {
              console.log(res);
                  if(index===1){
              var myObj={user:res, msg:"My House is on Fire, Need Help!!"};
               console.log(myObj);
 myService.sendEmail(myObj).success(function(res){

   var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and Fire Brigade Station</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });
    
   }
   else if(index===2){
                  var myObj={user:res, msg:"Attacked by Robbers, Need Help!!"};
 myService.sendEmail(myObj).success(function(res){
  
var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and Police Station</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });

   }
else{
 var myObj={user:res, msg:"Health Emergency, Need Help!!"};
 myService.sendEmail(myObj).success(function(res){
  
var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and nearby Hospital</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });
  
}

            }
          });

   }
}]).controller('userReviews', ['$scope', 'myService', '$stateParams', '$location','$state','$window','$ionicPopup','$timeout',function ($scope,myService,$stateParams,$location,$state,$window,$ionicPopup,$timeout){
      



       var user=[];
       var id=[];
       var productName=[];
       var productDesc=[];
       var productCover=[];
      myService.reqUser().success(function(res){
        if (res == false) {
          $location.path("/login");

}
            else  {
              var myObj={user:res};
               myService.getShop(myObj).success(function(res){
              
                console.log(res);
      for(var i in res){
        user.push(res[i].user);
        id.push(res[i]._id);
        productName.push(res[i].productName);
        productDesc.push(res[i].productDesc);
        productCover.push(res[i].productCover);
}

     var myData = productName.map(function(value, index) {
    return {
        productName: value,
        productDesc: productDesc[index],
        user: user[index],
        productCover:productCover[index],
        _id:id[index]
    }
  });

    console.log(myData);

       $scope.datas=myData;
     
});
 }
});
    

   
  $scope.deliver=function(index){
      myService.reqUser().success(function(res){
        if (res == false) {
          $location.path("/login");

}
            else  {
              console.log(res);
                  if(index===1){
              var myObj={user:res, msg:"My House is on Fire, Need Help!!"};
               console.log(myObj);
 myService.sendEmail(myObj).success(function(res){

   var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and Fire Brigade Station</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });
    
   }
   else if(index===2){
                  var myObj={user:res, msg:"Attacked by Robbers, Need Help!!"};
 myService.sendEmail(myObj).success(function(res){
  
var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and Police Station</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });

   }
else{
 var myObj={user:res, msg:"Health Emergency, Need Help!!"};
 myService.sendEmail(myObj).success(function(res){
  
var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and nearby Hospital</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });
  
}

            }
          });

   }
 

}]).controller('Main', ['$scope', 'myService','$location', function ($scope, myService,$location) {            
var recognition;
 $scope.onDeviceReady= function() {
    recognition = new SpeechRecognition();
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
           $scope.q = event.results[0][0].transcript;
            console.log(q);
            $scope.$apply();
        }
    }
    recognition.start();
}
    
}]).controller('about', ['$scope', 'myService','$location','$window','$ionicPopup','$timeout' ,function ($scope, myService,$location,$window,$ionicPopup,$timeout) {            

  $scope.doRefresh = function() {
$window.location.reload(true);
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
    
  }
   $scope.hello1=function(){
var alertPopup = $ionicPopup.alert({
              title: 'Are You A Shop Keeper ?',
              template: 'Now You can also show your shop on the Map !'
              });
     alertPopup.then(function(res) {
    var asd = $ionicPopup.alert({
              title: 'Hurry !',
              template: 'Fill out the form correctly !'
              });
     asd.then(function(res) {
    var aPopup = $ionicPopup.alert({
              title: 'Instructions ',
              template: '<ul><li>1-Please stand near to the shop, to detect your exact location</li><li>2-You should open your GPS.</li><li>3-Please be appropriate with the details</li><li>4-Please upload a clear image of your Shop (Name should be visible) </li><li>5-Image size should be less than 30 MB</li><li>6-Please Select the categories wisely, so that your shop can be categorized</li></u>'
              });
     aPopup.then(function(res) {
      $location.path('shopProfile');
    
     });
     });
     });
            $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
   }, 4000);
 }
      $scope.hello=function(redir){
      $location.path(''+redir);
        
 }
  $scope.deliver=function(index){
      myService.reqUser().success(function(res){
        if (res == false) {
          $location.path("/login");

}
            else  {
              console.log(res);
                  if(index===1){
              var myObj={user:res, msg:"My House is on Fire, Need Help!!"};
               console.log(myObj);
 myService.sendEmail(myObj).success(function(res){

   var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and Fire Brigade Station</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });
    
   }
   else if(index===2){
                  var myObj={user:res, msg:"Attacked by Robbers, Need Help!!"};
 myService.sendEmail(myObj).success(function(res){
  
var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and Police Station</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });

   }
else{
 var myObj={user:res, msg:"Health Emergency, Need Help!!"};
 myService.sendEmail(myObj).success(function(res){
  
var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and nearby Hospital</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });
  
}
 }
  });

   }

}]).controller('Maps', ['$scope', 'myService','$state','$location','$ionicModal','$window', '$ionicPopup','$timeout','$cordovaGeolocation', '$ionicLoading','$anchorScroll',function ($scope, myService,$state,$location,$ionicModal,$window,$ionicPopup,$timeout,$cordovaGeolocation, $ionicLoading,$anchorScroll) {
  
    $scope.greet = function(name) {
                alert('Hello ' + name);
            }
  $scope.deliver=function(index){
      myService.reqUser().success(function(res){
        if (res == false) {
          $location.path("/login");

}
            else  {
              console.log(res);
                  if(index===1){
              var myObj={user:res, msg:"My House is on Fire, Need Help!!"};
               console.log(myObj);
 myService.sendEmail(myObj).success(function(res){

   var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and Fire Brigade Station</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });
    
   }
   else if(index===2){
                  var myObj={user:res, msg:"Attacked by Robbers, Need Help!!"};
 myService.sendEmail(myObj).success(function(res){
  
var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and Police Station</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });

   }
else{
 var myObj={user:res, msg:"Health Emergency, Need Help!!"};
 myService.sendEmail(myObj).success(function(res){
  
var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p>Your Panic message has been sent to your neighbours and nearby Hospital</p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
 });
  
}

            }
          });

   }
  


              var slat;
              var slong;
       var username=[];
       var id=[];
       var email=[];
       var address=[];
       var lng=[];
       var lat=[];
       var mobileNo=[];

      myService.reqUser().success(function(res){
        if (res == false) {
          $location.path("/login");

}
            else  {

              var myObj={user:res};
            slat=res.lat;
            slong=res.lng;

               myService.getUsers(myObj).success(function(res){
           

                console.log(res);
      for(var i in res){
                if(slat!==res[i].lat){
        username.push(res[i].username);
        id.push(res[i]._id);
        email.push(res[i].email);
        address.push(res[i].address);

        lng.push(res[i].lng);
        lat.push(res[i].lat);
        mobileNo.push(res[i].mobileNo);
      }


}
     initialize(slat,slong);

  
     var myData = username.map(function(value, index) {
    return {
        username: value,
        email: email[index],
        address: address[index],
        lng:lng[index],
        lat:lat[index],
        mobileNo:mobileNo[index],  
        _id:id[index]
    }
  });

    console.log(myData);

       $scope.datas=myData;
     
});
 }
});
    




 var homeMarker;
  var marker;
  var infoWindow
  var options = {timeout: 10000, enableHighAccuracy: true};
  var latLng;
var mapOptions;
var map=null;
           function initialize(slat,slong){
        
          console.log('call',slat,slong);
              latLng=new google.maps.LatLng(slat,slong)

              mapOptions = {
                        center: latLng,
                        zoom: 17,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        mapTypeControl : true,
            streetViewControl : true,
            zoomControl : true
                      };
     map = new google.maps.Map(document.getElementById("map2"), mapOptions);
    $scope.map=map;
       homeMarker = new google.maps.Marker({
          position: latLng,
          icon:'img/ic.png',
          map: map
        });

        homeMarker.setMap(map);

         var  infoWindow1 = new google.maps.InfoWindow({
      content: "I am Here"
  });
 
    google.maps.event.addListener(homeMarker,'click', (function(marker,infoWindow1){ 
        return function() {
           infoWindow1.open($scope.map,homeMarker);
        };
    })(homeMarker,infoWindow1)); 
          for(var i=0;i<lat.length;i++)
          {
             var pos=new google.maps.LatLng(lat[i],lng[i])

           marker = new google.maps.Marker({
          position: pos,
          icon:'img/blue.png',
          map: map
        });
        marker.setMap(map);
        var content="UserName: "+username[i]+"<br/>Address: "+address[i]+"<br/>Mobile No: "+mobileNo[i]+"<br/>Email: "+email[i];
           infoWindow = new google.maps.InfoWindow({
      content: content
  });
 
    google.maps.event.addListener(marker,'click', (function(marker,infoWindow){ 
        return function() {
           infoWindow.open($scope.map,marker);
        };
    })(marker,infoWindow)); 
          }

         var centerControlDiv = document.createElement('div');
                  var centerControl = new CenterControl(centerControlDiv, map);

                        centerControlDiv.index = 1;
                map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);


         

                   
google.maps.event.addListenerOnce($scope.map, 'idle', function(){

}) 

        }






function calculateRoute(to) {
        // Center initialized to Naples, Italy
      var from=homeMarker.getPosition();
      console.log("calculating Route");
        var directionsService = new google.maps.DirectionsService();
        var directionsRequest = {
          origin: from,
          destination: to,
          travelMode: google.maps.DirectionsTravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC
        };
        directionsService.route(
          directionsRequest,
          function(response, status)
          {
            if (status == google.maps.DirectionsStatus.OK)
            {
              new google.maps.DirectionsRenderer({
                map: map,
                directions: response
              });
            }
            else
             alert("Can't find");
          }
        );
      }

function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #000000';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.5)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to Find Your Self';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'cursive';
  controlText.style.fontSize = '15px';
  controlText.style.lineHeight = '35px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.classList.add("ion-navigate");
  controlText.innerHTML = 'Find Me';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
   controlUI.addEventListener('click', function() {
       map.panTo(homeMarker.getPosition());
  });


}

}]).controller('productForm', ['$scope', 'myService','$location','$window','$ionicPopup','$timeout','$cordovaGeolocation', '$ionicLoading','$ionicModal', function ($scope, myService,$location,$window,$ionicPopup,$timeout,$cordovaGeolocation, $ionicLoading,$ionicModal) {   
 

 $scope.stepsModel = [];

    $scope.imageUpload = function(element){
        var reader = new FileReader();
        reader.onload = $scope.imageIsLoaded;

        reader.readAsDataURL(element.files[0]);

    }

    $scope.imageIsLoaded = function(e){
        $scope.$apply(function() {
            $scope.stepsModel.push(e.target.result);
              console.log($scope.stepsModel);
        });
    }

  $scope.sendProduct=function(productName,productDesc){ 
console.log(productName,productDesc);
      myService.reqUser().success(function(res){
        if (res == false) {
          $location.path("/login");

}
            else  {
    var obj;
    
    
  obj={user:res,productName:productName,productDesc:productDesc,productCover:$scope.stepsModel[0]};
   
      console.log(obj);
      myService.sendProduct(obj).success(function(res){
        if (res == true) {
              var alertPopup = $ionicPopup.alert({
              title: 'Submitted',
              template: '<p>Your Feed have been submitted </p>'
              });
     alertPopup.then(function(res) {
       $window.location.reload(true);
     });
            $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
   }, 5000);
            }
            else  {
                  var alertPopup = $ionicPopup.alert({
              title: 'Error !',
              template: 'Sorry fill out the form again , and check your Internet Connection'
              });
     alertPopup.then(function(res) {
       $window.location.reload(true);
     });
            $timeout(function() {
      alertPopup.close(); //close the popup after 3 seconds for some reason
   }, 5000);
            }
        });
            }
        });



    } 
   
     $scope.deliver=function(){
     var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p> For Delivery in Karachi,<br><br><br> Please Contact on:<br> <a href="tel:+923332571546">+92-3332571546</a></p><p style="font-size:10px"> <i>* Delivery charges may apply according to your location and minimum of 500rs delivery is required. </i></p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
  }
  

}
]).controller('getproductDetails', ['$scope', 'myService', '$stateParams', '$location','$window','$ionicPopup','$timeout',function ($scope, myService,$stateParams,$location,$window,$ionicPopup,$timeout){
  //$window.location.reload(true);
    $scope.doRefresh = function() {
$window.location.reload(true);
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
    
  }
    $scope.id = $stateParams.id;
    console.log($stateParams);
      // set the rate and max variables



   $scope.readOnly = true;
    myService.getProductsWITHID($scope.id).success(function (res) {
      console.log("here");
           console.log(res);
        $scope.product = res;
        console.log($scope.product);
       

});
     $scope.hello=function(redir){
      $location.path(''+redir);
        
 }
 $scope.deliver=function(){
     var mynewPopup = $ionicPopup.alert({
       title: 'For Delivery',
       template: '<p> For Delivery in Karachi,<br><br><br> Please Contact on:<br> <a href="tel:+923332571546">+92-3332571546</a></p><p style="font-size:10px"> <i>* Delivery charges may apply according to your location and minimum of 500rs delivery is required. </i></p>'
     });
     mynewPopup.then(function(res) {
       mynewPopup.close();
     });
  }

}])




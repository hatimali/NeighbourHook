var app = angular.module('dbProject', ['ionic','dbProject.controllers', 'dbProject.services','ngRoute','ui.router','ngCordova' ,'ionic.rating']);

app.run(function($ionicPlatform,$anchorScroll) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  
  $anchorScroll.yOffset = 50; 
        if (window.cordova && window.cordova.logger) {
    window.cordova.logger.__onDeviceReady();
            }
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
}).config(function ($stateProvider, $ionicConfigProvider ,$urlRouterProvider) {
$ionicConfigProvider.views.maxCache(1);
      
        $stateProvider.state('login', {
            url: '/login',
  cache:false,
            templateUrl: '/partials/Login.html',
            controller: "loginUser"

        });
            $stateProvider.state('details', {
            url: '/details/:id',
              cache:false,
            templateUrl: '/partials/Single_Shop.html',
            controller: 'getDetails'
        });
           $stateProvider.state('productdetails', {
            url: '/productdetails/:id',
              cache:false,
            templateUrl: '/partials/Single_Product.html',
            controller: 'getproductDetails'
        });
        $stateProvider.state('register', {
            url: '/register',
              cache:false,
            templateUrl: '/partials/Register.html',
            controller: "registerUser"

        });
        $stateProvider.state('home', {
            url: '/home',
            cache:false,
            templateUrl: '/partials/home.html',
            controller : "Maps"

        });
          $stateProvider.state('about', {
            url: '/about',
              cache:false,
            templateUrl: '/partials/about.html',
            controller: 'about'

        });
        $stateProvider.state('logout', {
            url: '/logout',
              cache:false,
            templateUrl: '/partials/home.html',
            controller: "logOut"

        });
        $stateProvider.state('main', {
            url: '/',
              cache:false,
            templateUrl: '/partials/main.html',
            controller: "Main"


        });
         $stateProvider.state('shopProfile', {
            url: '/shopProfile',
              cache:false,
            templateUrl: '/partials/shopProfile.html',
            controller: "shopProfile"


        });
         $stateProvider.state('productForm', {
            url: '/productForm',
              cache:false,
            templateUrl: '/partials/productForm.html',
            controller: "productForm"


        });
         $stateProvider.state('userReviews', {
            url: '/userReviews',

            templateUrl: '/partials/userReviews.html',
            controller: "userReviews"


        });
          $stateProvider.state('adminShops', {
            url: '/adminShops',
              cache:false,
            templateUrl: '/partials/adminShops.html',
            controller: "adminShops"


        });
           $stateProvider.state('adminProducts', {
            url: '/adminProducts',
              cache:false,
            templateUrl: '/partials/adminProducts.html',
            controller: "adminProducts"


        });
              $stateProvider.state('productStore', {
            url: '/productStore',
              cache:false,
            templateUrl: '/partials/productStore.html',
            controller: "productStore"


        });

            $stateProvider.state('Friends', {
            url: '/Friends',
              cache:false,
            templateUrl: '/partials/Friends.html',
            controller: "Friends"


        });
           $stateProvider.state('admin', {
            url: '/admin',
              cache:false,
            templateUrl: '/partials/adminlogin.html',
            controller: "adminloginUser"


        });
        $urlRouterProvider.otherwise('/login');


    });

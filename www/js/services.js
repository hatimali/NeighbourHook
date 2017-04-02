angular.module('dbProject.services',[])
.factory('myService', function ($http) {

        var ergastAPI = {};
         ergastAPI.isAuthenticated = function () {
            var req = {
                method: 'GET',
                url: '/isAuthenticated',
                
            };
            return $http(req);
        }
       ergastAPI.sendProducts = function (userObj) {
            var req = {
                method: 'POST',
                url: '/ProductItems',
                data: userObj
                
            };
            return $http(req);
        }
         ergastAPI.sendSearch = function (userObj) {
            var req = {
                method: 'POST',
                url: '/searchIt',
                data: userObj
                
            };
            return $http(req);
        }
         ergastAPI.sendReview = function (userObj) {
            var req = {
                method: 'POST',
                url: '/Review',
                data: userObj
                
            };
            return $http(req);
        }
        ergastAPI.getShop = function (userObj) {
            var req = {
                method: 'POST',
                url: '/getShop',
                data: userObj
                
            };
            return $http(req);
        }
            ergastAPI.getProducts = function (userObj) {
            var req = {
                method: 'POST',
                url: '/getProducts',
                data: userObj
                
            };
            return $http(req);
        }
          ergastAPI.getProductsWITHID = function (id) {
            var req = {
                method: 'GET',
                url: '/getProducts/'+ id,
                
            };
            return $http(req);
        }
            ergastAPI.getUsers = function (userObj) {
            var req = {
                method: 'POST',
                url: '/getUsers',
                data: userObj
                
            };
            return $http(req);
        }
        ergastAPI.sendEmail = function (obj) {
            var req = {
                method: 'POST',
                url: '/sendEmail',
                data:obj
            };
            return $http(req);
        }
         ergastAPI.getnotVerifiedProducts = function () {
            var obj={as:"as"};
            var req = {
                method: 'POST',
                url: '/getnotVerifiedProducts',
                data:obj
            };
            return $http(req);
        }
        ergastAPI.getReview = function (userObj) {
            var req = {
                method: 'GET',
                url: '/getReview'
                
                
            };
            return $http(req);
        }
         ergastAPI.getUserReview = function (userObj) {
            var req = {
                method: 'POST',
                url: '/getReview',
                data: userObj
                
            };
            return $http(req);
        }
         ergastAPI.sendShop = function (userObj) {
            var req = {
                method: 'POST',
                url: '/shopmyProfile',
                data: userObj
                
            };
            return $http(req);
        }
         ergastAPI.sendProduct = function (userObj) {
            var req = {
                method: 'POST',
                url: '/myProducts',
                data: userObj
                
            };
            return $http(req);
        }
             ergastAPI.reqUser = function () {
                var userObj={ab:"Ac"};
            var req = {
                method: 'POST',
                url: '/reqUser',
                data: userObj
                
            };
            return $http(req);
        }
           ergastAPI.rejected = function (userObj) {
            var req = {
                method: 'POST',
                url: '/rejected',
                data: userObj
                
            };
            return $http(req);
        }
           ergastAPI.rejectedProduct = function (userObj) {
            var req = {
                method: 'POST',
                url: '/rejectedProduct',
                data: userObj
                
            };
            return $http(req);
        }
         ergastAPI.sendVerifiedShop = function (userObj) {
            var req = {
                method: 'POST',
                url: '/shopProfile',
                data: userObj
                
            };
            return $http(req);
        }
         ergastAPI.getMyProducts = function () {
            var req = {
                method: 'GET',
                url: '/getMyProducts',
             };
            return $http(req);
        }
          ergastAPI.sendVerifiedProduct = function (userObj) {
            var req = {
                method: 'POST',
                url: '/sendVerifiedProduct',
                data: userObj
                
            };
            return $http(req);
        }
            ergastAPI.deleteProduct = function (userObj) {
            var req = {
                method: 'POST',
                url: '/deleteProduct',
                data: userObj
                
            };
            return $http(req);
        }
       ergastAPI.getShopsWithId = function (id) {
            //console.log("yeh id hai!",id);
            return $http({
                method: 'GET',
                url: '/getShop/' + id
            });
        }

         ergastAPI.logout = function () {
            var req = {
                method: 'GET',
                url: '/logout',
                
            };
            return $http(req);
        }
        ergastAPI.login = function (userObj) {
            var req = {
                method: 'POST',
                url: '/login',
                data: userObj
            };
            return $http(req);
        }
        ergastAPI.registerUser = function (data) {
            var req = {
                method: 'POST',
                url: '/register',
                data: data
            };
            return $http(req);

        }

        

        return ergastAPI;
    }) ;
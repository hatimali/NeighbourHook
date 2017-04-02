var exports = module.exports = {};
var express = require('express')
    , passport = require('passport')
    , cors = require('cors')
    , util = require('util')
    , LocalStrategy = require('passport-local').Strategy;
var crypto = require("crypto");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var db = require('monk')('admin:1234@ds119588.mlab.com:19588/neighbourhook');
var categories = [''];
var S = require('string');
var fs = require("fs");
var geolib=require("geolib");
var nodemailer = require('nodemailer');
var email = require('emailjs');

var FB = require('fb');
function findByUsername(username, fn) {
    var collection = db.get('loginUsers');
    console.log("yeh user name hai latest!!", username);
    collection.findOne({username: username}, {}, function (e, docs) {
        console.log("now in user", docs);
        if (docs) {
            return fn(null, docs);
        }
        else {
            return fn(null, null);
        }

    });
}


function findById(id, fn) {
    var collection = db.get('loginUsers');
    collection.findOne({_id: id}, {}, function (e, docs) {
        console.log("now in id", docs);
        

        if (docs) {
            return fn(null, docs);
        }
        else {
            return fn(null, null);
        }
    });
}

var myEmail= "neighbourhook@gmail.com";
var password="neighbourhook123";
var app = express();
app.use(bodyParser.json({limit:"50mb"})); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(cors());
// configure Express
app.use(cookieParser());
//app.use(express.methodOverride());
app.use(session({

    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false, maxAge: (40 * 60 * 60 * 1000)}, // 4 hours
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    req.db = db;
    next();
})

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});


var MyUser="GuestUser";
var myCat;
app.set('port', process.env.PORT || 8000);
passport.use(new LocalStrategy(
    function (username, password, done) {
        // Find the user by username.  If there is no user with the given
        // username, or the password is not correct, set the user to `false` to
        // indicate failure and set a flash message.  Otherwise, return the
        // authenticated `user`.
        console.log(username, password);
        MyUser=username;

        findByUsername(username, function (err, user) {

            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Unknown user ' + username});
            }
            var OldPassword = user.password.password
            console.log("This is an Old   " + OldPassword);
            var NewPassword = hash(password, user.password.salt);
            console.log("This is a New   " + NewPassword);
            if (OldPassword != NewPassword) {
                console.log("Error");
                return done(null, false, {message: 'Invalid password'});
            }
            return done(null, user);
        });
    }
));
var i=1;
var pobj={};
app.use('/',express.static(__dirname + '/www'));
app.use('/www/bower_components', express.static(__dirname + '/www/bower_components'));
var array=[];

app.post('/login',
    passport.authenticate('local', {failureRedirect: '/loginFailure'}),
    function (req, res) {
        res.send({sucess: true});
    });
app.get('/login', function (req, res) {
    res.send({msg: "login kr"});
});


app.get('/loginFailure', function (req, res) {
    res.send({error: true})
});


app.post('/sendEmail', function(req,res){

console.log("sending email",req.body);

var server  = email.server.connect({
   user:    myEmail, 
   password:password, 
   host:    "smtp.gmail.com",
  tls: {ciphers: "SSLv3"}
});

  var cou=0;
    var slat=0;
    var slon=0;
    var aray=[];
var collect="loginUsers";
console.log(req.body.user);

    var collection =db.get(collect);
    collection.find({},function(err,docs){
        if(docs.length>0){
           
            for(var j=0; j<docs.length;j++){
            console.log('here',docs.length,j);
                var lat=docs[j].lat;
                var lon= docs[j].lng;
                slat=req.body.user.lat;
                slon=req.body.user.lng;

                if(slat!==0 && slat!==null ){
        var ans=geolib.isPointInCircle(
                {latitude: lat , longitude: lon},
                {latitude: slat, longitude: slon},
                5000
                );

                if(ans==true){
                  var html='<h3Your neighbour is in Panic. He needs your help</h3> <br/> <p>His Message for you</p>' +req.body.msg +"<br/> <p>Your Neighbour Details are<br/> Mobile No:"+docs[j].mobileNo+ " Address:"+docs[j].address;
var message = {
   from:    "info@rslogisticsme.com", 
   to:      docs[j].email,
   subject: "Panic Email !!",
  attachment: 
   [
      {data:html, alternative:true}

   ]

};
server.send(message, function(err, message) { 
  if(err){
    console.log(err);
    
  }
  else{


  }

});
                }
            }
            }
         res.send(true);



        }
        else{
            console.log(err);
            console.log('errorr')
            res.send(false);
        }



    });











  })

app.post('/register', function (req, res) {
    var collection = db.get("loginUsers");
    var mail = req.body.email;
    collection.findOne({email: mail}, {}, function (e, docs2) {
        console.log("checking docs 2", docs2);
        if (docs2 != null) {
            var obj = ('Used');
            res.send(obj);
        }
        else {
            var id = req.body.username;

            collection.findOne({username: id}, {}, function (e, docs3) {
                if (docs3) {
                    var obj = ('Used');
                    res.send(obj);
                }
                else {
                    console.log("pushing in the database!!!");
                    var saltPass = newSalt(16);
                    var pass = {password: hash(req.body.password, saltPass), salt: saltPass};
                   
                    var obje = { username:req.body.username,password:pass,email:req.body.email,mobileNo:req.body.mobileNo,address:req.body.address,lat: req.body.lat, lng: req.body.lng};
                    collection.insert(obje, function (err, doc) {
                        if (err) {
                            // If it failed, return error
                            res.send("There was a problem adding the information to the database.");
                        }
                        else {
                            res.send(true);
                        }
                    });
                }
            });

        }
    });

    // Submit to the DB

});

app.post('/Review', function (req, res) {
    if(MyUser==null){
        res.send(false);
    }
else{
    var collection =db.get('User_Reviews');
    var review= req.body.review;
    var rating=req.body.rate;
    console.log('Ye hai review',review);
    var Shop =req.body.Shop;
          var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

var newdate = day + "/" + month + "/" + year;

 var FreshObj={UserId :MyUser , UserReview: review, date:newdate, UserRating:rating};
var obj={};

  collection.findOne({ShopId: Shop._id}, {}, function (e, docs2) {
    if(docs2){
       collection.remove({ShopId : Shop._id});
        console.log("Ye purana hai",docs2.Review);
  
       
        console.log("Ye naya hai ", FreshObj);
        var Comp={};
        array=null;
        array=[];
        var co=0;
 for(var z in docs2.Review){
    co++;
 }
 console.log(co);
        for(var k=0;k<co;k++){
            if(docs2.Review[k]!=null){
             array.push(docs2.Review[k]);
         }
            
         }
        
          
           array.push(FreshObj);
           console.log(array.length)
           for(var l=0 ;l<array.length;l++){
            Comp[l]=array[l];
           }
           obj={ShopId : Shop._id, Review:Comp};
               
 collection.insert(obj, function (err, doc) {
                       
                        if (err) {
                            // If it failed, return error
                            res.send(false);
                        }
                        else {
                             addReviewToShop(req,res);                        
                         }
                    });
    }
else{
    var arra=[];
    var Com={};
    arra.push(FreshObj);
     for(var l=0 ;l<arra.length;l++){
            Com[l]=arra[l];
           }
    obj={ShopId : Shop._id, Review:Com};
 collection.insert(obj, function (err, doc) {
                       
                        if (err) {
                            // If it failed, return error
                            res.send(false);
                        }
                        else {
                            addReviewToShop(req,res);
                        }
                    });

}
});
}

});

app.post('/getReview', function (req, res) {
    var collection=db.get("Shop_Reviews");
    if(MyUser !== "GuestUser"){
    collection.findOne({UserId: MyUser},{},function(e,docs){
        if(docs){
            console.log(docs.Review);
            res.send(docs);

        }
        else{
            res.send(false);
        }


    });
}
else{
    res.send("register");
}
});

function addReviewToShop(req,res){
if(MyUser !== "GuestUser"){
 var collection =db.get('Shop_Reviews');
   var rating=req.body.rate;
    var review= req.body.review;
    var Shop =req.body.Shop;
    var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

var newdate = day + "/" + month + "/" + year;

 var FreshObj={shopId:Shop._id,shopName :Shop.shopName , UserReview: review, date:newdate ,UserRating:rating};
var obj={};

  collection.findOne({UserId: MyUser}, {}, function (e, docs2) {
    if(docs2){
       collection.remove({UserId: MyUser});
        console.log("Ye purana hai",docs2.Review);
  
       
        console.log("Ye naya hai ", FreshObj);
        var Comp={};
        array=null;
        array=[];
        var co=0;
 for(var z in docs2.Review){
    co++;
 }
 console.log(co);
        for(var k=0;k<co;k++){
            if(docs2.Review[k]!=null){
             array.push(docs2.Review[k]);
         }
            
         }
        
          
           array.push(FreshObj);
           console.log(array.length)
           for(var l=0 ;l<array.length;l++){
            Comp[l]=array[l];
           }
           obj={UserId: MyUser, Review:Comp};
               
 collection.insert(obj, function (err, doc) {
                       
                        if (err) {
                            // If it failed, return error
                            res.send(false);
                        }
                        else {
                            res.send(true);
                        }
                    });
    }
else{
    var arra=[];
    var Com={};
    arra.push(FreshObj);
     for(var l=0 ;l<arra.length;l++){
            Com[l]=arra[l];
           }
    obj={UserId: MyUser, Review:Com};
 collection.insert(obj, function (err, doc) {
                       
                        if (err) {
                            // If it failed, return error
                            res.send(false);
                        }
                        else {
                            res.send(true);
                        }
                    });

}
});
}
else
    res.send("register");
}


function searchIt(pat,txt)
{
    var M = pat.length;
    var N = txt.length;
 
    /* A loop to slide pat[] one by one */
    for (var i = 0; i <= N - M; i++)
    {
        var j;
 
        /* For current index i, check for pattern match */
        for (j = 0; j < M; j++)
        {
            if (txt[i + j] != pat[j])
                break;
        }
        if (j == M) // if pat[0...M-1] = txt[i, i+1, ...i+M-1]
        {
           return true;
        }
    }
}

app.post('/searchIt', function (req, res) {
    var collection =db.get('ProductItems');
    var categ=req.body.category;
    myCat=categ;
    var search=req.body.search;
    var flag=0;
    console.log("Haan bhai Yaha aGaaya");
     collection.findOne({categoryName: categ}, {}, function (e, docs2) {
        if(docs2){
            console.log("Haan bhai search kerlia ab");
            var co=0;
            for(var z in docs2.items){
    co++;
         }
         for(var k=0;k<co;k++){
            if(docs2.items[k]!=null){

                var str=S(docs2.items[k].item_name).collapseWhitespace().s;
                console.log(str);
                str = str.toLowerCase();
                search=search.toLowerCase();
                console.log("This Shoud be Match ",str," With this ", search);
                if(searchIt(str,search)==true){

                    flag=1;
                    k=co+1;
                }
                else if(searchIt(search,str)==true){
                    flag=1;
                    k=co+1;
                }
         }
            
         }
         
        }
        else{
            console.log("Not found");
        }
        if(flag==1){
            console.log("Haan bhai item mil gaya");
            res.send(true);
         }
         else{
            res.send(false);
         }
     });
});
var shop;
app.post('/getnotVerifiedShops',function(req,res){
    var collection=db.get('notVerifiedShops');
    var cou=0;
      var aray=[];
    collection.find({},function(err,docs){
        if(docs){
            for(var i in docs){
                cou++;
            }
            for(var j=0; j<cou;j++){
            var objec={_id:docs[j]._id, categoryName:docs[j].category ,shopLong : docs[j].coordinates[0], shopLat :docs[j].coordinates[1], shopName: docs[j].shopName, shopAddr : docs[j].shopAddr, shopArea: docs[j].shopArea, shopCover:docs[j].shopCover  };

            aray.push(objec);
        }
        res.send(aray);
    }
    else{
          console.log(err);
            res.send(false);
    }
    });
});
app.post('/getnotVerifiedProducts',function(req,res){
    var collection=db.get('notVerifiedProducts');
    var cou=0;
      var aray=[];
      var objec;
    collection.find({},function(err,docs){
        if(docs){
            for(var i in docs){
                cou++;
            }
            for(var j=0; j<cou;j++){
                console.log("ASDASD");
                if( docs[j].coordinates[0]==0){
  objec={_id:docs[j]._id, categoryName:docs[j].category ,shopLong : 0, shopLat :0, productName:docs[j].productName,productPrice:docs[j].productPrice,contactNo:docs[j].contactNo,productAddr:docs[j].productAddr, productDesc:docs[j].productDesc, productCover : docs[j].productCover  };
        }
                
                else {
             objec={_id:docs[j]._id, categoryName:docs[j].category ,shopLong : docs[j].coordinates[0], shopLat :docs[j].coordinates[1], productName:docs[j].productName,productPrice:docs[j].productPrice,contactNo:docs[j].contactNo,productAddr:docs[j].productAddr, productDesc:docs[j].productDesc, productCover : docs[j].productCover  };
        }
            aray.push(objec);
        }
        res.send(aray);
    }
    else{
          console.log(err);
            res.send(false);
        }
    });
   
});


app.post('/getUsers', function (req, res) {
    var cou=0;
    var slat=0;
    var slon=0;
    var aray=[];
var collect="loginUsers";

    var collection =db.get(collect);
    collection.find({},function(err,docs){
        if(docs){
            for(var i in docs){
                cou++;
            }
            for(var j=0; j<cou;j++){
                var lat=docs[j].lat;
                var lon= docs[j].lng;
                slat=req.body.user.lat;
                slon=req.body.user.lng;
                if(slat==0 || slat==null || slon==0 || slon==null){

                }
                else{
        var ans=geolib.isPointInCircle(
                {latitude: lat , longitude: lon},
                {latitude: slat, longitude: slon},
                5000
                );

                if(ans==true){
                    var objec={_id:docs[j]._id,username: docs[j].username, email: docs[j].email, address:docs[j].address, lng:docs[j].lng ,lat:docs[j].lat ,mobileNo:docs[j].mobileNo  };
                    aray.push(objec);
                    console.log(j ,"   ",objec);
                }
            }
            }
           res.send(aray);



        }
        else{
            console.log(err);
            res.send(false);
        }



    });


    
});



app.post('/getShop', function (req, res) {
    var cou=0;
    var slat=0;
    var slon=0;
    var aray=[];
var collect="borrowRequest";

    var collection =db.get(collect);
    collection.find({},function(err,docs){
        if(docs){
            for(var i in docs){
                cou++;
            }
            for(var j=0; j<cou;j++){
                var lat=docs[j].user.lat;
                var lon= docs[j].user.lng;
                slat=req.body.user.lat;
                slon=req.body.user.lng;
                if(slat==0 || slat==null || slon==0 || slon==null){

                }
                else{
        var ans=geolib.isPointInCircle(
                {latitude: lat , longitude: lon},
                {latitude: slat, longitude: slon},
                5000
                );

                if(ans==true){
                    var objec={_id:docs[j]._id,user: docs[j].user, productName: docs[j].productName, productDesc:docs[j].productDesc, productCover:docs[j].productCover  };
                    aray.push(objec);
                    console.log(j ,"   ",objec);
                }
            }
            }
           res.send(aray);



        }
        else{
            console.log(err);
            res.send(false);
        }



    });


    
});
var prod;
app.post('/getProducts', function (req, res) {
    var cou=0;
    var slat=0;
    var slon=0;
    var aray=[];
var collect=req.body.category+'_Products';
prod=collect;
    var collection =db.get(collect);
    collection.find({},function(err,docs){
        if(docs){
            for(var i in docs){
                cou++;
            }
            for(var j=0; j<cou;j++){
                
                    var objec={_id:docs[j]._id, categoryName:req.body.category ,shopLong : docs[j].coordinates[0], shopLat :docs[j].coordinates[1], productName:docs[j].productName,productPrice:docs[j].productPrice,contactNo:docs[j].contactNo,productAddr:docs[j].productAddr, productDesc:docs[j].productDesc, productCover : docs[j].productCover  };
                    aray.push(objec);
                    console.log(j ,"   ",objec);
                }
            
            
           res.send(aray);



        }
        else{
            console.log(err);
            res.send(false);
        }



    });


    
});
app.post('/shopmyProfile',function(req,res){

var collect='notVerifiedShops';

var collection = db.get(collect);
var FreshObj={category:req.body.category,coordinates:[req.body.shopLong,req.body.shopLat],shopName:req.body.shopName,shopAddr:req.body.shopAddr, shopArea:req.body.shopArea, shopCover : req.body.shopCover };

console.log(FreshObj);
collection.insert(FreshObj,function(e,docs){
    if(e)res.send(false);
    else res.send(true);


});
});

app.post('/myProducts',function(req,res){

var collect='borrowRequest';
var FreshObj;
var collection = db.get(collect);
console.log("myProducts");


collection.insert(req.body,function(e,docs){
    if(e)res.send(false);
    else res.send(true);


});
});

app.post('/deleteProduct',function(req,res){

var collection=db.get("StoreProducts");
var collect=db.get(req.body.category+'_Products');


     collection.remove({category:req.body.category }, function (err) {
        if(err)res.send(false);
        else{   
                console.log('removing this',req.body.name);

                 collect.remove({productName:req.body.name}, function (err) {
                if(err){
                    res.send(false);
                }
                else{
                    res.send(true);
                }
              });
        }
     });




});

app.post('/shopProfile',function(req,res){

var collect=req.body.category+'_Shops';
var collection1=db.get('notVerifiedShops');
var collection = db.get(collect);
var FreshObj={coordinates:[req.body.shopLong,req.body.shopLat],shopName:req.body.shopName,shopAddr:req.body.shopAddr, shopArea:req.body.shopArea, shopCover : req.body.shopCover };


collection.insert(FreshObj,function(e,docs){
    if(e)res.send(false);
    else {
        collection1.remove({_id:req.body.vid }, function (err) {
  if (err) {
      console.log("cant");
    res.send(false);
  
    }

  else{
    console.log("removed");
    res.send(true);
}
});
    }
    });
    


});

app.post('/sendVerifiedProduct',function(req,res){

var collect=req.body.category+'_Products';
var collection1=db.get('notVerifiedProducts');
var collection = db.get(collect);
var collection2=db.get('StoreProducts');
var FreshObj;

if(req.body.shopLong == null)
 {
    FreshObj={coordinates:[req.body.shopLong,req.body.shopLat],productName:req.body.productName,productPrice:req.body.productPrice,contactNo:req.body.contactNo,productAddr:req.body.productAddr, productDesc:req.body.productDesc, productCover : req.body.productCover };
}
else{
    FreshObj={coordinates:[0,0],productName:req.body.productName,productPrice:req.body.productPrice,contactNo:req.body.contactNo,productAddr:req.body.productAddr, productDesc:req.body.productDesc, productCover : req.body.productCover };
}

collection.insert(FreshObj,function(e,docs){
    if(e)res.send(false);
    else {
        collection1.remove({_id:req.body.vid }, function (err) {
  if (err) {
      console.log("cant");
    res.send(false);
  
    }

  else{
    console.log("removed");
 FreshObj={category:req.body.category,coordinates:[req.body.shopLong,req.body.shopLat],productName:req.body.productName,productPrice:req.body.productPrice,contactNo:req.body.contactNo,productAddr:req.body.productAddr, productDesc:req.body.productDesc, productCover : req.body.productCover };
    collection2.insert(FreshObj,function(e,docs){
        if(e)res.send(false);
        else{
              res.send(true);
        }
    });

}
});
    }
    });
    


});

app.post('/rejected',function(req,res){


var collection1=db.get('notVerifiedShops');

var FreshObj={coordinates:[req.body.shopLong,req.body.shopLat],shopName:req.body.shopName,shopAddr:req.body.shopAddr, shopArea:req.body.shopArea, shopCover : req.body.shopCover };


        collection1.remove({_id:req.body.vid }, function (err) {
  if (err) {
      console.log("cant");
    res.send(false);
  
    }

  else{
    console.log("removed");
    res.send(true);
}
});
   


});

app.post('/rejectedProduct',function(req,res){


var collection1=db.get('notVerifiedProducts');

        collection1.remove({_id:req.body.vid }, function (err) {
  if (err) {
      console.log("cant");
    res.send(false);
  
    }

  else{
    console.log("removed");
    res.send(true);
}
});
   


});


app.get('/getShop/*', function (req, res) {
    var abc = req.params[0];
 var collect = db.get(shop);
 var collection =db.get("User_Reviews");
    if (abc) {
        console.log("yeh single hai",shop);
           
    collect.findOne({_id: abc}, {}, function (e, docs) {

        
        console.log("Shop", docs);
        if (docs) {
            collection.findOne({ShopId:abc},{},function(e,result){
                if(result){
                    var obj={Shop: docs, Review:result.Review};
                    console.log('Sending',obj);
                    res.send(obj);
                }
                else{
                     var obj={Shop: docs, Review:"No_Review"};
                    console.log('Sending',obj);
                    res.send(obj);
                }

            })


        }
        else {
            return null;
        }
         });





    }
    else {
        res.send({error: true})
    }
});

app.get('/getProducts/*', function (req, res) {
    var abc = req.params[0];
 var collect = db.get(prod);

    if (abc) {
        console.log("yeh single hai",shop);
           
    collect.findOne({_id: abc}, {}, function (e, docs) {

        
        console.log("Shop", docs);
        if (docs) {
         res.send(docs);


        }
        else {
           res.send(false)
        }
         });

    }
    else {
        res.send(false)
    }
});




app.post('/ProductItems',function(req,res){
    var collection= req.db.get("ProductItems");
    var obj=[

];
   /* var obje={categoryName:'ladiesShoes' ,items:obj};
     collection.insert(obje, function (err, doc) {
                        if (err) {
                            // If it failed, return error
                            res.send("There was a problem adding the information to the database.");
                        }
                        else {
                            res.send("Done");
                        }
                    });*/
/* collection.findOne({categoryName:"artificialJewelery"}, {}, function (e, docs2) {
        if(docs2){
            var al=docs2.items;

            for (var i = 0; i < al.length; i++) {
                if(al[i].item_name == ' Bali'){
                    console.log("True");
                }
                else{
                    console.log("chp");
                }
            };
          
        }
        else{
            console.log("fuckoff");
        }
 });*/

});

app.get('/getMyProducts', function (req, res) {
var collection = db.get('StoreProducts');
console.log("Here");
  collection.find({},function(err,docs){
    if(docs){
        console.log("getting");
        res.send(docs);
    }
    else{
        console.log("Error");
    res.send(false);
}

  });

});



app.get('/logout', function (req, res) {
    req.session.destroy();
    req.session = null;
    req.logout();
    res.send(true);

});



app.get('/isAuthenticated', function (req, res) {
    if (req.isAuthenticated())
        res.send(true);
    else
        res.send(false);
});




function findProduct(res, ind, collectionName) {
    var collect = db.get(collectionName);
    collect.findOne({_id: ind}, {}, function (e, docs) {

        
        console.log("Shop", docs);
        if (docs) {
            res.send(docs);
        }
        else {
            return null;
        }
         });
   

}

app.post('/reqUser',function(req,res){
if(req.user){
  console.log(req.user);
  res.send(req.user);
}
else{
  res.send(false);
  }


  });

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

function sendData(res, obj) {
    //console.log("finally checking object",obj);
    res.send(obj);
}
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function newSalt(size) {

    return crypto.randomBytes(size).toString('hex');
}
function hash(password, salt) {
    var sha256 = crypto.createHash('sha256').update(salt + password).digest("hex");
    return sha256;
}
exports.GetUser=function(){
    return MatchUser;
}






























































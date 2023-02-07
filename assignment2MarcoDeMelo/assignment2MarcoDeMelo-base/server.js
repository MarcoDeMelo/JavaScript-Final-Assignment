const express = require('express');
const app = express();
const queries = require("./mysql/queries");
const mysql = require('mysql');
const { MySql } = require('./mysql/queries');
app.set('view engine', 'ejs');
app.listen(3000);

app.get('/', function(request, response) {
  let cityPromise = MySql("SELECT name,state_id,id FROM cities");
  let statePromise = MySql("SELECT name,id FROM states");
  Promise.all([cityPromise,statePromise]).then(result=>{
    let city = result[0];
    let state = result[1];

    response.render('index', { title: 'Express', city:city,state:state });
  })

 

});  

app.get('/airbnb', (request, response) => {
  response.render('airbnb', { title:'AirBnb' });
});

app.get('/airbnb/find-one', (request, response) => {
  queries.findListing(
    { 
      number_rooms: request.query.bedrooms,
      guest:request.query.guest,
      amenities: request.query.amenities,
      price:request.query.price 
    }).then(result => {
        if(result.length > 0)
      { 
        queries.amenityList({amenities:result[0].id}).then(amenities => {
         if(amenities.length > 0)
         response.render("listing", { listing: result[0], amenities:amenities });
      })
    }
    else 
    response.render("error");
  });
});



app.get ("/airbnb/find-many", async (request, response) => {
  queries.findListings( 
    {  
      number_rooms: request.query.bedrooms,
      state: request.query.state,
      city: request.query.city
    }).then(result => {
      if(result.length > 0)
      { 
        
      
        
        response.render("listings", {listing: result});
    }
       
  else 
      response.render("error");
      
  })
}); 


app.get ("/find-one", (request, response) => {
queries.findOne({
  id:request.query.id
}).then(result => {
  if(result.length > 0)
  {
    queries.amenityList({amenities:result[0].id}).then(amenities => {
      if(amenities.length > 0)
    response.render("listing",{listing:result[0], amenities:amenities})
  })
}
  else 
      response.render("error");
})


});







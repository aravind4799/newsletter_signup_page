const express = require("express")
const bodyParser= require("body-parser")
const request =require("request")
//note: https is a native node package
const https=require("https")

const app=express()
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"))
// heroku server assigns the port dynamically
app.listen(process.env.PORT || 3000,function(){
  console.log("server is up and running");
})

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html")
})

app.post("/",function(req,res){

  const firstname =req.body.firstname
  const lastname =req.body.lastname
  const email =req.body.email

  const data = {
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME: firstname,
          LNAME: lastname
        }
      }
    ]
  }
  const jsondata=JSON.stringify(data)
  // put your list id at the end of url
  // replace usX with the server assigned to you from the api key
  //REPLACE YOUR_LIST_ID: WITH LIST ID
  const url ="https://us10.api.mailchimp.com/3.0/lists/YOUR_LIST_ID"

  const options = {
    method:"POST",
    //REPLACE YOUR_API_KEY: WITH YOUR api_key
    auth:"me:YOUR_API_KEY"
  }

  //https.get method is used to get data from a external server, but we need to make a POST
  // request to post details from our form, make use of request package
  // read request documentaion
  const request = https.request(url,options,function(response){
    if(response.statusCode==200){
      res.sendFile(__dirname +"/success.html")
    }
    else
    {
      res.sendFile(__dirname+"/failure.html")
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));

    })
  })
  // sending the data
  request.write(jsondata)
  // and ending it
  request.end()
})

//to handle post request from failure page to route /failure
app.post("/failure",function(req,res){
  res.redirect("/")
})
//hosted up here.
//https://pacific-reaches-28260.herokuapp.com/

// log into heroku
//commands to use heroku to host your web app live into WWW
// install heroku terminal
//1.heroku create
//2. navigate to your project folder
//3. init git
//4. git add .
//5. git commit -m "what__ever__message"
//6. git push heroku master -- pushes ur latest git commit into heroku servers

// later any changes made in server , and inorder to update changes

//1. git add .(add your changes)
//2. git commit -m "info_regarding_your_change"
//3. git push heroku master
// bingo! your changes have been updated

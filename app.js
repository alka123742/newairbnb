if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}


//console.log(process.env.SECRET);


const express=require("express");
const app=express();
const mongoose=require("mongoose");
//const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
//const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
//const {listingSchema,reviewSchema}=require("./schema.js");
//const Review=require("./models/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");



// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

const dbUrl=process.env.ATLASDB_URL;


main().then(()=>{
    console.log("connected to db");
}).catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
     secret:process.env.SECRET,
    },
    touchAfter:24*3600,
     
 });

 store.on("error",()=>{
    console.log("error in mongo session store",err);

 });

const sessionOptions={
    store,
secret:process.env.SECRET,
resave:false,
saveUninitialized:true,
cookie:{
    expires:Date.now()+7*24*60*60*1000,//date.now jo hai woh millli sec me return karta hai hum agar chahate hai ki hum log ka cookie ek week tak expire na ho toh 7 day ko multiply by 24 hr jo ki 60min se jo ki 60 sec se jo ki 1000milli sec se
    maxAge:7*24*60*60*1000, //yhe cookie ki age kab tak cookie yhe info rakhenga phir dele kar dega yhe
    httpOnly:true,
}
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());//middleware that initaislise passport
app.use(passport.session());//passport use ke liye session implemet hona chaiye kyuki ek seesion me woh login rhega agar woh kisi bhi page me jaye toh
passport.use(new LocalStrategy(User.authenticate()));
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


// app.get("/demouser",async(req,res)=>{
// let fakeUser=new User({
// email:"student@gmail.com",
// username:"delta-student"

// });
//  let registeredUser= await User.register(fakeUser,"helloworld");//helloworld password hai
//   res.send(registeredUser);

// })


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);//yhe jo id hai yhe yahi tak reh jaa rhi aage ka router ke paas ho rhi id parents ke paas hi reh jaa rhi woh info aage pass nahi ho rhi hai agar hum chahate hai ki listing ki id aur review id paas houye toh uske liye merge karna padega exprees.router(merege paramas:true)
app.use("/",userRouter);



// app.get("/testListing", async(req,res)=>{
// let sampleListing=new Listing({
// title:"My New Villa",
// description:"BY the beach",
// price:1200,
// location:"Calangute, Goa",
// country:"India"

// }); 
// await sampleListing.save();
// console.log("sample was saved");
// res.send("sucessful testing");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
const{statusCode=500,message="something went wrong"}=err;
//res.status(statusCode).send(message);
res.status(statusCode).render("error.ejs",{err});
//res.send("something went wrong");
});

app.listen(3001,()=>{
    console.log("server is running at port 3001");
});












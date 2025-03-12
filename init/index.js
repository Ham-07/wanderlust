const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initData=require("./data.js");


const Mongo_Url="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connect to db");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Mongo_Url);

}
const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'678a047e745733476e5c725e'}));
    await Listing.insertMany(initData.data);
    console.log("Done adding owner");
}
initDB();

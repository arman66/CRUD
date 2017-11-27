const mongoose = require('mongoose');


mongoose.Promise= Promise;

mongoose.connect(process.env.DATABASE_URL,{useMongoClient: true})
.then(()=>{
  console.log('mongoose connected!');
})
.catch((err)=>{

  console.log(err);
  console.log("error");
});

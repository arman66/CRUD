const passport= require('passport');


const TeamModel=require('../models/team-model');




passport.serializeUser((teamFromDb,cb)=>{

  cb(null,teamFromDb._id);
  //save only the id

});




passport.deserializeUser((idFromSession,cb)=>{
  TeamModel.findById(idFromSession)
  .then((teamFromDb)=>{
    cb(null,teamFromDb);
  })
  .catch((err)=>{
    cb(err);
  });

});

const express = require('express');

const bcrypt= require('bcrypt');
const passport= require('passport');


const MatchModel= require('../models/match-model');


const router  = express.Router();


//step 1 whot eht sign up form
router.get('/matches',(req,res,next)=>{
console.log('================',req.user._id);
  MatchModel
  .find(
  {owner: req.user._id}
  )
  .limit(25)
  .sort({ dateAdded: 1 })
  .exec()
  .then((matchResults) => {
      // create a local variable for the view to access the DB results
      res.locals.listOfMatches = matchResults;
// console.log('the list ==========', listOfMatches);
      // render only after the results have been retrieved
      // (the "then()" callback)
      res.render('match-views/match-list');
  })
  .catch((err) => {
      // render the error page with our error
      next(err);
  });
});


router.get('/matches/new', (req,res,next)=>{
  //redirec to log in if there is no logged in user
  // if(req.user === undefined){
  //   res.redirect('/login');
  //   return;
  // }
  res.render('match-views/match-form');
});

router.post('/matches',(req,res,next)=>{
  //redirec to log in if there is no logged in user
  if(req.user === undefined){
    res.redirect('/login');
    return;
  }

  console.log(req.body.signupPlayers);
  console.log("names");
  console.log(req.body.signupPlayers.name);
  console.log('points:');
  console.log(req.body.signupPlayers.points);




  // playersarray = [
  //   {
  //     name: "Test1",
  //     points: 1
  //   },
  //   {
  //     name: "Test2",
  //     points: 2
  //   }
  // ]
  const theMatch= new MatchModel({
    matchName:req.body.matchNewName,
    matchPhoto:req.body.matchImage,
    matchType:req.body.matchNewType,
    matchPlayers: req.body.signupPlayers,
    owner: req.user,


    //req.user is teh logged in users document (defined by Passport)
    //owner: req.user._id
  });
  theMatch.save()
  .then(()=>{
    res.redirect('/matches');
  })
  .catch((err)=>{
    next(err);
  });

});


router.get("/matches/details/:matchId", (req, res, next) => {
    //      /matches/details?prodId=9999
    //                           |
    //              req.query.prodId
    // matchModel.findOne({ _id: req.query.prodId })
    MatchModel.findById(req.params.matchId)
      .then((matchFromDb) => {
          // create a local variable for the view to access the DB result
          res.locals.matchDetails = matchFromDb;

          res.render("match-views/match-details");
      })
      .catch((err) => {
          // render the error page with our error
          next(err);
      });
}); // GET /matches/details

// Routes with URL parameters need to be at the BOTTOM
router.get("/matches/:matchId", (req, res, next) => {
    //      /matchs/ 9999
    //                   |
    //      req.params.prodId
    // matchModel.findOne({ _id: req.params.prodId })
    MatchModel.findById(req.params.matchId)
      .then((matchFromDb) => {
          // create a local variable for the view to access the DB result
          res.locals.matchDetails = matchFromDb;
          res.render("match-views/match-details");
      })
      .catch((err) => {
          // render the error page with our error
          next(err);
      });
}); // GET /matchs/:prodId



// STEP #1: show edit form
router.get("/matches/:matchId/edit", (req, res, next) => {
    // retrieve the document from the database
    MatchModel.findById(req.params.matchId)
      .then((matchFromDb) => {
          // create a local variable for the view to access the DB result
          // (this is so we can pre-fill the form)
          res.locals.matchDetails = matchFromDb;

          res.render("match-views/match-edit");
      })
      .catch((err) => {
          // render the error page with our error
          next(err);
      });
});


// STEP #2: receive edit submission
router.post("/matches/:matchId", (req, res, next) => {
    // retrieve the document from the database
    MatchModel.findById(req.params.matchId)
      .then((matchFromDb) => {
          // update the document
          matchFromDb.set({
              matchName:        req.body.matchName,
              matchType:       req.body.matchType,
              matchPhoto:    req.body.matchPhoto,
              matchPlayers: {
                name: req.body.signupPlayers,
                points: req.body.playerPoints
              }
          }); // |                        |
              // fields from         names of the
              // model's schema      input tags

          // set up the "matchDetails" local variable in case
          // we get validation errors and need to display the form again
          res.locals.matchDetails = matchFromDb;

          // and then save the updates
          // (return the promise of the next database operation)
          return matchFromDb.save();
      })
      .then(() => {
          // STEP #3: redirect after a SUCCESSFUL save
          // redirect to the match details page
          res.redirect(`/matches/details/${req.params.matchId}`);
            // you CAN'T redirect to an EJS file
            // you can ONLY redirect to a URL
      })
      .catch((err) => {
          // is this a validation error?
          // if it is then display the form with the error messages
          if (err.errors) {
              res.locals.validationErrors = err.errors;
              res.render("match-views/match-edit");
          }
          // if it isn't then render the error page with our error
          else {
              next(err);
          }
      });
});

// use this or the POST version of deleting (not both)
router.get("/matches/:matchId/delete", (req, res, next) => {
    MatchModel.findByIdAndRemove(req.params.matchId)
      .then((matchFromDb) => {
          // redirect to the list of products page
          // (you can't see the details of a product that isn't in the DB)
          res.redirect("/matches");
            // you CAN'T redirect to an EJS file
            // you can ONLY redirect to a URL
      })
      .catch((err) => {
          next(err);
      });
});





module.exports = router;

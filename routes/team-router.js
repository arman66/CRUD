const express = require('express');

const bcrypt= require('bcrypt');
const passport= require('passport');

const TeamModel= require('../models/team-model');


const router  = express.Router();

//step 1 whot eht sign up form
router.get('/signup',(req,res,next)=>{
  if(req.team){
    res.redirect('/');
    return;
  }

  res.render('team-views/signup-page');
});


//step 2
router.post('/process-signup',(req,res,next)=>{

  if(req.body.signupPassword === ""|| req.body.signupPassword.length < 2 || req.body.signupPassword.match(/[^a-z0-9]/i)===null)
  {
    res.locals.errorMessage= "password is invalid";
    res.render("team-views/signup-page");
    //early return
    return;
  }
  //finds if email is taken, query the database
  TeamModel.findOne({teamName: req.body.signupTeamName})
  .then((teamFromDb)=>{
    if(teamFromDb !==null)
    {
      res.locals.errorMessage= "teamname is invalid";
      res.render("team-views/signup-page");
      return;
    }
    //generate salt
    const salt= bcrypt.genSaltSync(10);

    //encrypt the password submitted from teh form
    const scrambledPassword= bcrypt.hashSync(req.body.signupPassword,salt);

    //create a new team

    const theTeam= new TeamModel({
      teamName:req.body.signupTeamName,

      encyptedPassword:scrambledPassword,

    });
    //return the promise of the next database query
    return theTeam.save();
  })

    .then(()=>{
      res.redirect("/");

    })
    .catch((err)=>{
      next(err);
    });


});
//step 1 login

router.get('/login', (req,res,next)=>{

  res.render('team-views/login-page');

});

//step 2

router.post('/process-login',(req,res,next)=>{
  //finds if email is taken, query the database
  TeamModel.findOne({teamName: req.body.loginTeamName})
  .then((teamFromDb)=>{
    if(teamFromDb === null)
    {
      res.locals.errorMessage="username incorrect";
      res.render("team-views/login-page");
      return;
    }
    console.log(req.body);
    console.log(teamFromDb);
    //if email is correct now we check teh Password
    const isPasswordGood=
    bcrypt.compareSync(req.body.loginPassword, teamFromDb.encyptedPassword);

    if(isPasswordGood === false)
    {
      res.locals.errorMessage="password incorrect";
      res.render("team-views/login-page");
      return;
    }
    //passport defines tehe request.login() for us to specif when to log in a team
    req.login(teamFromDb,(err)=>{
      if(err)
      {
        next(err);

      }
      else
      {
        res.redirect('/');
      }

    });
    //if you get to this point you have a successful login
    // res.redirect('/matches');

    })
  .catch((err)=>{
    next(err);
  });


});

router.get('/logout',(req,res,next)=>{
req.logout();
res.redirect('/');

});

module.exports = router;

const mongoose = require('mongoose');

const Schema= mongoose.Schema;
const Team = require('./team-model.js');

// new schema({schema},{settings})
const matchSchema= new Schema(
  //1st argument is teh structure
  {
    matchName:
    {
      type: String,
      required: [true, 'tell us your match Name']
    },
    matchType:
    {
      type: String,
      required: [true, 'tell us your match type']
    },
    matchPlayers:
    {

        type: [{type: String}],
        required: [true, 'tell us your match Name']

      },
      points:{
        type: Number
      },


    matchPhoto:
    {
      type: String,
      required: [true, 'tell us your photo URL']
    },
    owner:
    {
      type: Schema.Types.ObjectId
    },



    },
  //2nd argument --> settings object

  {
    //creates a createdAt and updateAt Date fields
    timestamps:true,
  }
);


const MatchModel= mongoose.model('Match',matchSchema);


module.exports=MatchModel;

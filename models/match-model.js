const mongoose = require('mongoose');

const Schema= mongoose.Schema;
const TeamModel = require('./team-model.js');

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
    matchPlayers:[
      {
        name: { type: String},
        points:{ type: Number, default: 0}
    }],
    matchPhoto:
    {
      type: String,
      required: [true, 'tell us your photo URL']
    },
    owner: {
      type: Schema.Types.ObjectId,
      // required: [true, 'Rooms need an owner']
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

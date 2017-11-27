const mongoose = require('mongoose');

const Schema= mongoose.Schema;

// new schema({schema},{settings})
const teamSchema= new Schema(
  //1st argument is teh structure
  {
    teamName:
    {
      type: String,
      required: [true, 'tell us your Team Name']
    },
    encyptedPassword:
    {
      type: String,
      required: [true, 'tell us your password']

    },

    role:{
      type:String,
      enum: ['normal','admin'],
      default: 'normal'
    }
    },
  //2nd argument --> settings object

  {
    //creates a createdAt and updateAt Date fields
    timestamps:true,
  }
);


const TeamModel= mongoose.model('Team',teamSchema);


module.exports=TeamModel;

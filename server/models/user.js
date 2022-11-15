import moongose from 'mongoose';
const {Schema} = moongose;

const userSchema =  new Schema({
    name : {
        type : String,
        trim : true,
        require: true,
    },
    username : {
        type : String,
        trim : true,
        require: true,
    },
    email : {
        type : String,
        trim : true,
        require: true,
        unique :true,
    },
    password : {
        type : String,
        require: true,
        min : 5,
        max : 15,
    },
    secert : {
        type : String,
        trim : true,
        require: true,
    },
    about : {},
    image: {
        url: String,
        public_id: String,
    },
    role: {
        type: String,
        default: "Subscriber",
    },
    following : [{type : Schema.ObjectId, ref : "user"}],
    followers : [{type : Schema.ObjectId, ref : "user"}],
}, {timestamps: true});

export default moongose.model("User",userSchema);

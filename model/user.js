const mongoose = require('mongoose');
const {createHmac, randomBytes}  =require('crypto');
const {createTokenForUser} = require("../service/auth");
const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
    },
    profileImageUrl:{
        type:String,
        default: "/Blog_App/public/images/363639-200.png"
    },
    role:{
        type:String,
        enum: ["User", "Normal"],   //you can use only these values for role,else mongoose would give error
        default:"User",  //default value of role
    }
},{timestamps:true});


UserSchema.pre('save', function(next){      //telling mongoose that before saving run this callback
    const user = this;                        //when using this keyword, dont use arrow function
    if(!user.isModified("password")) return;  //checing if the password is modified or not

    const salt = randomBytes(16).toString();   //creating a salt or simply a secret key for each user
    const hashedpassword = createHmac('sha256', salt)   //creating the hashed password using the algorithm and the salt
    .update(user.password)  //updating the user.password with this hashed password
    .digest("hex");  //returning the result in "hex" form


    this.salt = salt;
    this.password = hashedpassword;
    next(); //calling the next function

});

UserSchema.static("matchPasswordandGenerateToken", async function(email,password){
    const user = await this.findOne({email});
    if(!user)  throw new Error('User not found!');

    const salt = user.salt;
    const hashedpassword = user.password;
    const userProvidedPassword = createHmac('sha256', salt)
    .update(password)
    .digest('hex');

    if(hashedpassword !== userProvidedPassword) throw new Error('Pasword Wrong!');
    const token = createTokenForUser(user);
    return token;
    //return {...user, password:undefined, salt:undefined}; 
})

const User = mongoose.model("user", UserSchema);

module.exports = User
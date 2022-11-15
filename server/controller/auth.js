import User from "../models/user";
import { hashPassword, comparePassword } from "../helper/auth";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    //console.log('REGISTER ENDPOINT =>', req.body);
    const { name, email, password, secert, username } = req.body;
    //validation 
    if (!name) {
        return res.json({
            error: " name is required "
        });
    }
    if (!username) {
        return res.json({
            error: " username is required "
        });
    }
    if (!password || password.lenght < 5) {
        return res.json({
            error: " password is required "
        });
    }
    if (!secert) {
        return res.json({
            error: " Secert is required "
        });
    }
    const exist = await User.findOne({ email });
    if (exist) {
        return res.json({
            error: "Email exist "
        });
    }
    //hash password
    const hashedPassword = await hashPassword(password);
    // save user
    const user = new User({ name, username, email, password: hashedPassword, secert })
    try {
        await user.save();
        console.log("REGISTER USER is", user);
        return res.json({
            ok: true,
        });
    } catch (err) {
        console.log("REGISTER FAILED =>", err);
        return res.json({
            error: "Somethings wrong"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //check if our db user with that email and username
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: " Email not found"
            });
        }
        //check if password matches
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.json({
                error: " Password not matched"
            });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d", })
        user.password = undefined;
        user.secert = undefined;
        res.json({
            token,
            user,
        });
    } catch (err) {
        console.log(err)
        return res.json({
            error: " Something is wrong"
        });
    }
};


export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ ok: true });
    } catch (err) {
        console.log(err)
        return res.json({
            error: " Something is wrong"
        });
    }
}


export const ForgetPassword = async (req, res) => {
    const { email, newPassword, secert } = req.body;
    //validation
    if (!newPassword || !newPassword < 5) {
        return res.json({
            error: "Password must be new"
        });
    }
    if (!secert) {
        return res.json({
            error: " Secert is required "
        });
    }
    const user = await User.findOne({ email, secert });
    if (!user) {
        return res.json({
            error: "We cannot verify you with this details"
        });
    }
    try {

        const hashed = await hashPassword(newPassword)
        await User.findByIdAndUpdate(user._id, { password: hashed });
        return res.json({
            success: "You have updated the password"
        })
    } catch (err) {
        console.log(err)
        return res.json({
            error: "Somethings wrong try again"
        })

    }
}

export const profileUpdate = async (req, res) => {
    try {
        const data = {};
        if (req.body.username) {
            data.username = req.body.username
        }
        if (req.body.about) {
            data.about = req.body.about
        }
        if (req.body.name) {
            data.name = req.body.name
        }
        if (req.body.password) {
            if (req.body.password < 5) {
                return res.json({
                    error: "Password is short"
                })
            }
            else {
                data.password = await hashPassword(req.body.password)
            }
        }
        if (req.body.secert) {
            data.secert = req.body.secert
        }
        if (req.body.image) {
            data.image = req.body.image
        }
        let user = await User.findByIdAndUpdate(req.user._id, data, { new: true });
        user.password = undefined;
        user.secert = undefined;
        res.json(user);
    } catch (err) {
        if (err.code = 11000) {
            return res.json({ error: "Username Exist Please choose another" })
        }
        console.log(err)
    }
}

export const findPeople = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        //user.following
        let following = user.following;
        following.push(user._id)
        const people = await User.find({ _id: { $nin: following } }).select("-password -secert").limit(10);
        res.json(people)
    } catch (err) {
        console.log(err)
    }
}

//middleware
export const addFollower = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.body._id, {
            $addToSet: { followers: req.user._id },
        });
        next();
    } catch (err) {
        console.log(err)
    }
}

export const userFollow = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { following: req.body._id },
        },
        { new: true }
        ).select("-password -secert");
        res.json(user);
    } catch (err) {
        console.log(err)
    }
}

export const userFollowing = async (req,res) => {
    try {
        const user = await User.findById(req.user._id);
        const following = await User.find({_id : user.following}).limit(100);
        res.json(following);
    } catch (err) {
        console.log(err)
    }
}


//middleware
export const removeFollower = async (req,res,next) => {
    try {
        const user = await User.findByIdAndUpdate(req.body._id, {
            $pull: { followers: req.user._id },
        });
        next();
    } catch (err) {
        console.log(err)
    }
}

export const userUnfollow = async (req,res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body._id },
        },
        { new: true }
        ).select("-password -secert");
        res.json(user);
    } catch (err) {
        console.log(err)
    }
}


//search
export const searchUser = async (req,res) => {
    const { query }= req.params
    if(!query) return;
    try {
        //regex is specail method from mongodb
        //The i modifier is used to perform case-insensitive matching.
        const user = await User.find({
            $or : [
                {name : {$regex: query, $options: 'i' }},
                {username : {$regex: query, $options: 'i' }}
            ]
        }).select('-password -secert');
        res.json(user);
    } catch (err) {
        console.log("The error =>",err)
    }
}

export const getUser = async (req,res) => {
    try {
        const user = await User.findOne({username : req.params.username}).select('-password,-secert')
        res.json(user);
    } catch (err) {
        console.log(err)
    }
}
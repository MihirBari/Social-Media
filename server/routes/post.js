import express from 'express';
import formidable from "express-formidable";

const router = express.Router();

//middleware
import { requireSignin, canEditDeletePost, isAdmin } from "../middlewares"

//controller
import { createPost, uploadImage, postsByUser ,userPost , updatePost
        ,deletePost ,newsFed,likePost,unlikePost ,addComment ,removeComment ,totalPosts ,posts,getPost} from '../controller/post';

router.post('/create-post', requireSignin, createPost);
router.post('/upload-image', requireSignin, formidable({ maxSizeFile: 5 * 1024 * 1024 }), uploadImage);

router.get('/user-posts', requireSignin, postsByUser);
router.get('/user-post/:_id', requireSignin,userPost);

//update
router.put("/update-post/:_id",requireSignin,canEditDeletePost,updatePost)

//delete
router.delete("/delete-post/:_id",requireSignin,canEditDeletePost,deletePost)

router.get("/news-feed/:page",requireSignin,newsFed)

router.put("/like-post", requireSignin,likePost)
router.put("/unlike-post", requireSignin,unlikePost)

router.put("/add-comment",requireSignin,addComment)
router.put("/remove-comment",requireSignin,removeComment)

router.get("/total-posts", totalPosts);
router.get("/posts",posts)

//admin
router.delete("/admin/delete-post/:_id",requireSignin,isAdmin,deletePost)

//single post
router.get("/post/:_id",getPost)

module.exports = router;
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import Post from "../../component/cards/Post";
import Link from "next/link";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import CommentForm from "../../component/Forms/CommentForm";

const PostComments = () => {
    const [post, setPost] = useState({})
    const [visible, setVisible] = useState(false)
    const [currenPost, setCurrentPost] = useState({});
    const [comment, setComment] = useState('');
    const [uploadding, setUploadding] = useState(false);
    const router = useRouter();
    const _id = router.query._id;

    useEffect(() => {
        if (_id) fetchPost();
    }, [_id]);

    const fetchPost = async () => {
        try {
            const { data } = await axios.get(`/user-post/${_id}`)
            setPost(data);
        } catch (err) {
            console.log(err)
        }
    }

    const removeComment = async (postId, comment) => {
        let answer = window.confirm("Are you sure")
        if (!answer) return;
        try {
            const { data } = await axios.put("/remove-comment", {
                postId,
                comment,
            })
            console.log("remove=>", data);
            fetchPost();
        } catch (err) {
            console.log(err)
        }
    }

    const handleComment = (post) => {
        setCurrentPost(post)
        setVisible(true);
    }


    const handleLike = async (_id) => {
        try {
            const { data } = await axios.put("/like-post", { _id });
            fetchPost();
        } catch (err) {
            console.log(err)
        }
    }

    const handleUnlike = async (_id) => {
        try {
            const { data } = await axios.put("/unlike-post", { _id });
            fetchPost();
        } catch (err) {
            console.log(err)
        }
    }

    const addComment = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put("/add-comment", {
                postId: currenPost._id,
                comment,
            });
            setComment('')
            setVisible(false)
            toast.success("Comment Was added")
            fetchPost();
        } catch (err) {
            console.log(err)
        }
    }

    const handleDelete = async (post) => {
        setUploadding(true)
        try {
            const ans = window.confirm("Are you sure?");
            if (!ans) return;
            const { data } = await axios.delete(`/delete-post/${post._id}`)
            toast.error("Post deleted");
            fetchPost();
            setUploadding(false);
            router.push("/user/dashboard")
        } catch (err) {
            console.log(err)
            setUploadding(false);
        }
    }



    return (
        <div className="container-fluid ">
            <div className="row py-5 bg-default-img text-light">
                <div className="col text-center">
                    <h1>MernCamp</h1>
                </div>
            </div>
            <div className="container col-md-8 offset-md-2 pt-5">
                <Post post={post} commentsCount={100} handleDelete={handleDelete} handleLike={handleLike} handleUnlike={handleUnlike} removeComment={removeComment} handleComment={handleComment} />
            </div>
            <Modal visible={visible} onCancel={() => setVisible(false)} title="Comment" footer={null} >
                <CommentForm handleComment={handleComment} removeComment={removeComment} comment={comment} setComment={setComment} addComment={addComment} />
            </Modal>
            <Link href="/user/dashboard">
                <a className="d-flex justify-content-center p-5">
                    <CloseCircleOutlined />
                </a></Link>
        </div>
    )

};

export default PostComments;
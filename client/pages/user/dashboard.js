import { UserContext } from "../../context";
import { useContext, useState, useEffect } from "react";
import UserRoute from "../../component/routes/useRoute";
import CreatePostForm from "../../component/Forms/CreatePostForm";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from 'react-toastify';
import PostList from "../../component/cards/PostList";
import People from "../../component/cards/People";
import Link from "next/link";
import { Modal, Pagination } from "antd";
import CommentForm from "../../component/Forms/CommentForm";
import Search from "../../component/search";
import  io  from "socket.io-client";


const socket = io(process.env.NEXT_PUBLIC_SOCKETIO ,
    {path :"/socket.io"},
    {reconnection: true},
);


const Home = () => {
    const [state, setState] = useContext(UserContext);
    //state
    const [content, setContent] = useState("");
    const [image, setImage] = useState({});
    const [uploadding, setUploadding] = useState(false);
    //posts
    const [posts, setPosts] = useState([]);
    const [people, setPeople] = useState([]);
    //comments
    const [comment, setComment] = useState('');
    const [visible, setVisible] = useState(false)
    const [currenPost, setCurrentPost] = useState({});

    // pagination 
    const [totalPosts, setTotalPosts] = useState(0);
    const [page, setPage] = useState(1);
    //route
    const router = useRouter();

    useEffect(() => {
        if (state && state.token) {
            newsFed();
            findPeople();
        }
    }, [state && state.token , page]);

    useEffect(() => {
        try {
            axios.get('/total-posts').then(({ data }) => setTotalPosts(data));
        } catch (err) {
            console.log(err)
        }
    }, [])

    const newsFed = async () => {
        try {
            const { data } = await axios.get(`/news-feed/${page}`);
            // console.log("user posts =>", data);
            setPosts(data);
        } catch (err) {
            console.log(err)
        }
    }

    //people
    const findPeople = async () => {
        try {
            const { data } = await axios.get("/find-people");
            console.log("people =>", data);
            setPeople(data);
        } catch (err) {
            console.log(err)
        }
    }

    //for backend
    const postSubmit = async (e) => {
        e.preventDefault();
        //console.log('Post=>',content);
        try {
            const { data } = await axios.post('/create-post', { content, image })
            console.log("create post response =>", data);
            if (data.error) {
                toast.error(data.error)
            }
            else {
                setPage(1);
                newsFed();
                toast.success("Success")
                setContent("");
                setImage({});
                //socket
                socket.emit('new-post',data);
            }
        } catch (err) {
            console.log(err)
        }
    };

    const handleImage = async (e) => {
        const file = e.target.files[0];
        let formData = new FormData();
        formData.append("image", file);
        // console.log([...formData]);
        setUploadding(true)
        try {
            const { data } = await axios.post("/upload-image", formData);
            console.log("uploaded image=>", data);
            setImage({
                url: data.url,
                public_id: data.public_id,
            });
            setUploadding(false);
        } catch (err) {
            console.log(err);
            setUploadding(false);
        }
    }

    const handleDelete = async (post) => {
        setUploadding(true)
        try {
            const ans = window.confirm("Are you sure?");
            if (!ans) return;
            const { data } = await axios.delete(`/delete-post/${post._id}`)
            toast.error("Post deleted");
            newsFed();
            setUploadding(false);
        } catch (err) {
            console.log(err)
            setUploadding(false);
        }
    }

    const handleFollow = async (user) => {
        try {
            const { data } = await axios.put("/user-follow", { _id: user._id });
            //console.log("follower=>",data);
            //local storage update , user update ,keep token
            let auth = JSON.parse(localStorage.getItem("auth"));
            auth.user = data
            localStorage.setItem("auth", JSON.stringify(auth));
            //update  context
            setState({ ...state, user: data });
            //update people state
            let filtered = people.filter((p) => p._id !== user._id);
            setPeople(filtered);
            // render Post
            newsFed()
            toast.success(`You followed ${user.name}`)
        } catch (err) {
            console.log(err)
        }
    }

    const handleLike = async (_id) => {
        try {
            const { data } = await axios.put("/like-post", { _id });
            newsFed();
        } catch (err) {
            console.log(err)
        }
    }

    const handleUnlike = async (_id) => {
        try {
            const { data } = await axios.put("/unlike-post", { _id });
            newsFed();
        } catch (err) {
            console.log(err)
        }
    }

    const handleComment = (post) => {
        setCurrentPost(post)
        setVisible(true);
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
            newsFed();
        } catch (err) {
            console.log(err)
        }
    }

    const removeComment = async (postId, comment) =>{
        let answer = window.confirm("Are you sure")
        if(!answer) return;
      try {
          const {data} = await axios.put("/remove-comment",{
              postId,
              comment,
          });
          console.log("remove=>",data);
          newsFed();
      } catch (err) {
          console.log(err)
      }
    }
 

    return (
        <UserRoute>
            <div className="container-fluid ">
                <div className="row py-5 bg-default-img text-light">
                    <div className="col text-center">
                        <h1>DashBoard</h1>
                    </div>
                </div>
                <div className="row py-3">
                    <div className="col-md-8">
                        <CreatePostForm content={content} setContent={setContent} postSubmit={postSubmit}
                            handleImage={handleImage} uploadding={uploadding} image={image} />
                        <br />
                        <PostList posts={posts} handleDelete={handleDelete} handleLike={handleLike}
                         handleUnlike={handleUnlike} handleComment={handleComment} removeComment={removeComment} />

                        <Pagination current={page} total={(totalPosts / 3) * 10} onChange={(value) => setPage(value)} 
                          className="pb-5" /> 
                    </div>

                    <div className="col-md-4">
                     <Search  />
                        <br/>
                        {state && state.user && state.user.following && <Link href={`/user/following`}>
                            <a className="h6">{state.user.following.length} Following </a></Link>}
                        <People people={people} handleFollow={handleFollow} />
                    </div>
                </div>
                <Modal visible={visible} onCancel={() => setVisible(false)} title="Comment" footer={null} >
                    <CommentForm handleComment={handleComment} handleDelete={handleDelete} removeComment={removeComment} comment={comment} setComment={setComment} addComment={addComment} />
                </Modal>
            </div>
        </UserRoute>
    )
}

export default Home;
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import CreatePostForm from "../../../component/Forms/CreatePostForm";
import UserRoute from "../../../component/routes/useRoute";
import { toast } from "react-toastify";

const EditPost = () => {
    const [post, setPost] = useState({});
    const router = useRouter();
    //state
    const [content, setContent] = useState("");
    const [image, setImage] = useState({});
    const [uploadding, setUploadding] = useState(false);
    // console.log(router)
    const _id = router.query._id

    useEffect(() => {
        if (_id) fetchPost();
    }, [_id]);

    const fetchPost = async () => {
        try {
            const { data } = await axios.get(`/user-post/${_id}`)
            setPost(data);
            setContent(data.content)
            setImage(data.image)
        } catch (err) {
            console.log(err)
        }
    }

    const postSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`/update-post/${_id}`, { content, image });
            if (data.error) {
                toast.error(data.error)
            }
            else {
                toast.success('Pos-Edited')
                router.push('/user/dashboard')
            }
        } catch (err) {

        }
    }


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


    return (
        <>
            <UserRoute>
                <div className="container-fluid ">
                    <div className="row py-5 bg-default-img text-light">
                        <div className="col text-center">
                            <h1>News Fed </h1>
                        </div>
                    </div>
                    <div className="row py-3">
                        <div className="col-md-8 offset-md-2">
                            <CreatePostForm content={content} setContent={setContent} postSubmit={postSubmit}
                                handleImage={handleImage} uploadding={uploadding} image={image} />
                            <br />
                        </div>
                    </div>

                </div>
            </UserRoute>
        </>
    );
};

export default EditPost;
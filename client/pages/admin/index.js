import { UserContext } from "../../context";
import { useContext, useState, useEffect } from "react";
import AdminRoute from "../../component/routes/AdminRoute";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from 'react-toastify';
import renderHTML from "react-render-html";



const Admin = () =>{
    const [state, setState] = useContext(UserContext);

    //posts
    const [posts, setPosts] = useState([]);

    //route
    const router = useRouter();

    useEffect(() => {
        if (state && state.token) {
            newsFed();
        }
    }, [state && state.token ]);


    const newsFed = async () => {
        try {
            const { data } = await axios.get("/posts");
            // console.log("user posts =>", data);
            setPosts(data);
        } catch (err) {
            console.log(err)
        }
    }


    const handleDelete = async (post) => {   
        try {
            const ans = window.confirm("Are you sure?");
            if (!ans) return;
            const { data } = await axios.delete(`/admin/delete-post/${post._id}`)
            toast.error("Post deleted");
            newsFed();
        } catch (err) {
            console.log(err)
        }
    }
    



    return (
        <AdminRoute>
            <div className="container-fluid ">
                <div className="row py-5 bg-default-img text-light">
                    <div className="col text-center">
                        <h1>ADMIN</h1>
                    </div>
                </div>

                <div className="row py-4">
                    <div className="col-md-8 offset-md-2 ">
                        {posts && posts.map((post)=>(
                            <div key={post._id} className="d-flex justify-content-between" >
                                <div>
                                {renderHTML(post.content)} -<b>{post.postedBy.name}</b>
                                </div>
                                <div onClick={()=> handleDelete(post)} className="text-danger" >Delete</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminRoute>
    )
}

export default Admin;
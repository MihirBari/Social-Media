import { useContext } from "react";
import renderHTML from "react-render-html";
import moment from "moment";
import { Avatar } from "antd";
import PostImage from "../Images/PostImage";
import { HeartOutlined, HeartFilled, CommentOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import { imageSource } from "../../functions";


const PostPublic = ({ post , commentsCount=100}) => {
    const [state] = useContext(UserContext);
    const router = useRouter();



    return (
        <>
           { post && post.postedBy && (
            <div key={post._id} className="card mb-5">
                <div className="card-header">
                    {/* <Avatar size={40} >
                            {post.postedBy.name[0]}
                        </Avatar> */}
                    <Avatar size={40} src={imageSource(post.postedBy)} />
                    <span className="pt-2 mx-4 text-muted" >{post.postedBy.name}</span>
                    <span className="pt-2 mx-4" >{moment(post.createdAt).fromNow()}</span>
                </div>
                <div className="class-body">
                    {renderHTML(post.content)}
                </div>
                <div className="card-footer">
                    {post.image && <PostImage url={post.image.url} />}
                    <div className="d-flex">
                        {state && state.user && post.likes && post.likes.includes(state.user._id) ? (
                            <HeartFilled className="text-danger pt-2 h5" />
                        ) : (
                            <HeartOutlined  className="text-danger pt-2 h5" />
                        )}
                        <div className="pt-2 pl-3" style={{ marginRight: "1rem" }}>{post.likes.length}like </div>

                        <CommentOutlined className="text-danger pt-2 h5 pl-5" />
                        <div className="pt-2 pl-3">
                            {post.comments.length}Comment
                        </div>

                
                    </div>
                </div>
                {post.comments && post.comments.length > 0 && (
                    <ol className="list-group" style={{maxHeight:'125px' , overflow : 'scroll'}}>
                        {post.comments.slice(0,commentsCount ).map((c) => (
                            <li key={c._id} className="list-group-item d-flex justify-content-between align-items-start">
                                <div className="ms-2 me-auto">
                                    <div ><Avatar size={20} className="mb-1 mr-3" src={imageSource(c.postedBy)} />&nbsp;{c.postedBy.name}</div>
                                    <div>{c.text}</div>
                                </div>
                                <span className="badge rounded-pill text-muted">{moment(c.created).fromNow()}
                                </span>
                            </li>
                        ))}
                    </ol>
                )}
            </div>)}
        </>
    );
};

export default PostPublic;
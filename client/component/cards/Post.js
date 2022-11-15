import { useContext } from "react";
import renderHTML from "react-render-html";
import moment from "moment";
import { Avatar } from "antd";
import PostImage from "../Images/PostImage";
import { HeartOutlined, HeartFilled, CommentOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import { imageSource } from "../../functions";
import Link from "next/link";

const Post = ({ post, handleDelete ,handleLike ,handleUnlike, handleComment,commentsCount=100,removeComment, }) => {
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
                            <HeartFilled onClick={() => handleUnlike(post._id)} className="text-danger pt-2 h5" />
                        ) : (
                            <HeartOutlined onClick={() => handleLike(post._id)} className="text-danger pt-2 h5" />
                        )}
                        <div className="pt-2 pl-3" style={{ marginRight: "1rem" }}>{post.likes.length}like </div>

                        <CommentOutlined onClick={() => handleComment(post)} className="text-danger pt-2 h5 pl-5" />
                        <div className="pt-2 pl-3">
                            <Link href={`/post/${post._id}`}><a>{post.comments.length}Comment</a></Link>
                        </div>

                        {state && state.user && state.user._id === post.postedBy._id && (
                            <>
                                <EditOutlined onClick={() => router.push(`/user/post/${post._id}`)} className="text-danger pt-2 h5 px-5 mx-auto" />
                                <DeleteOutlined onClick={() => handleDelete(post)} className="text-danger pt-2 h5 px-5" />
                            </>
                        )}
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
                                {state && state.user && state.user._id === c.postedBy._id && (
                                    <div className="ml-auto mt-1">
                                        <DeleteOutlined onClick={() => removeComment(post._id, c)}
                                         className="px-l text-danger"/>
                                        </div>
                                )}
                                </span>
                            </li>
                        ))}
                    </ol>
                )}
            </div>)}
        </>
    );
};

export default Post;
import { Avatar } from "antd";
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(()=>import('react-quill'),{ssr : false});
//import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { CameraOutlined , LoadingOutlined } from "@ant-design/icons";

const CreatePostForm = ({content, setContent ,postSubmit,handleImage, uploading , image}) => {
    return (
        <div className="card">
            <div className="card-body pb-3">
                <form className="form-group" onSubmit={postSubmit}>
                    <ReactQuill theme="snow" value={content} onChange={(e) => setContent(e)} className="form-control" placeholder="Write something"/>
                </form>
            </div>
           
            <div className="card-footer text-muted d-flex justify-content-between">
                <button disabled={!content} onClick={postSubmit} className="btm btn-primary btn-sm mt-1">Post</button>
                <label > 
                    {
                        image && image.url ? (<Avatar size={30} src={image.url} className="mt-1" />) : uploading ? (<LoadingOutlined className="mt-2"/>) : <CameraOutlined className="mt-2"/> 
                    }
            <input onChange={handleImage} type="file" accept="image/*" hidden/>
            </label>
            </div>
        </div>
    );
};

export default CreatePostForm;
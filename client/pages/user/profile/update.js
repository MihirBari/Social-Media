import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Avatar } from "antd";
import Link from "next/link";
import AuthForm from "../../../component/Forms/AuthForm"
import { UserContext } from "../../../context"
import { useRouter } from "next/router";
import { LoadingOutlined, CameraOutlined } from "@ant-design/icons";


const ProfileUpdate = () => {

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secert, setSecert] = useState("");
    const [about, setAbout] = useState("");
    const [Ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false)

    //profile image
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);

    const router = useRouter();
    const [state, setState] = useContext(UserContext)

    useEffect(() => {
        if (state && state.user)
            setUsername(state.user.username)
        setAbout(state.user.about)
        setName(state.user.name)
        setEmail(state.user.email)
        setImage(state.user.image)
        console.log(state.user)
    }, [state && state.user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        //console.log(name,email,password)
        try {
            const { data } = await axios.put(`/profile-update`, {
                name,
                username,
                email,
                password,
                secert,
                about,
                image,
            });
            console.log(data);
            if (data.error) {
                toast.error(data.error);
            } else {
                setOk(data.ok);
                setLoading(false);
            }
            //update local storage
            let auth = JSON.parse(localStorage.getItem("auth"));
            auth.user = data;
            localStorage.setItem("auth", JSON.stringify(auth));
            //update context
            setState({ ...state, user: data });
            router.push("/user/dashboard")
        } catch (err) {
            toast.error(err.response.data);
            setLoading(false);
        }
    };

    const handleImage = async (e) => {
        const file = e.target.files[0];
        let formData = new FormData();
        formData.append("image", file);
        // console.log([...formData]);
        setUploading(true)
        try {
            const { data } = await axios.post("/upload-image", formData);
            console.log("uploaded image=>", data);
            setImage({
                url: data.url,
                public_id: data.public_id,
            });
            setUploading(false);
        } catch (err) {
            console.log(err);
            setUploading(false);
        }
    }


    return (
        <div className="container-fluid ">
            <div className="row py-5 bg-default-img text-light">
                <div className="col text-center">
                    <h1>Profile </h1>
                </div>
            </div>


            <div className="row py-5">
                <div className="col-md-6 offset-md-3">
                    {/*UPLOAD IMAGE*/}
                    <label className="d-flex justify-content-center h5 ">
                        {
                            image && image.url ? (<Avatar size={30} src={image.url} className="mt-1" />) : uploading ? (<LoadingOutlined className="mt-2" />) : <CameraOutlined className="mt-2" />
                        }
                        <input onChange={handleImage} type="file" accept="image/*" hidden />
                    </label>
                    <AuthForm
                        ProfileUpdate={true}
                        handleSubmit={handleSubmit}
                        name={name}
                        username={username}
                        about={about}
                        setAbout={setAbout}
                        email={email}
                        password={password}
                        secert={secert}
                        setName={setName}
                        setUsername={setUsername}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        setSecert={setSecert}
                        loading={loading}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Modal title="congratulation!"
                        visible={Ok}
                        onCancle={() => setOk(false)}
                        footer={null}>
                        <p>You have succesfully Updated Your Profile</p>
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default ProfileUpdate;
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../component/Forms/AuthForm";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const Register = () => {

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secert, setSecert] = useState("");
    const [Ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false)

    const router = useRouter();
    const [state] = useContext(UserContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        //console.log(name,email,password)
        try {
            const { data } = await axios.post(`/register`, {
                name,
                username,
                email,
                password,
                secert,
            });

            if (data.error){
                toast.error(data.error);
            }else{
            setName('');
            setUsername('');
            setEmail('');
            setPassword('');
            setSecert('');
            setOk(data.ok);
            setLoading(false);
            }
        } catch (err) {
            toast.error(err.response.data);
            setLoading(false);
        }
    };

    if (state && state.token) router.push("/");

    return (
        <div className="container-fluid ">
            <div className="row py-5 bg-default-img text-light">
                <div className="col text-center">
                    <h1>Register </h1>
                </div>
            </div>


            <div className="row py-5">
                <div className="col-md-6 offset-md-3">

                    <AuthForm
                        handleSubmit={handleSubmit}
                        name={name}
                        username={username}
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
                        <p>You have succesfully Registered</p>
                        <Link href="/login">
                            <a className="btn btn-primary btn-sm">Login</a>
                        </Link>
                    </Modal>
                    <div className="row">
                        <div className="col">
                            <p className="text-center">Already have an account ? <Link href="/login">
                                <a >Login</a>
                            </Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
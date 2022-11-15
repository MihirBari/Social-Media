import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import ForgetPasswordForm from "../component/Forms/ForgotPasswordForm";
import { UserContext } from "../context";
import { useRouter } from "next/router";


const ForgetPassword = () => {


    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [secert, setSecert] = useState("");
    const [Ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false)

    const router = useRouter();
    const [state] = useContext(UserContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading("true");
        //console.log(name,email,password)
        try {
            const { data } = await axios.post(`/forgot-password`, {
                name,
                email,
                newPassword,
                secert,
            });
            setEmail('');
            setNewPassword('');
            setSecert('');
            setOk(data.ok);
        } catch (err) {
            toast.error(err.response.data);
            setLoading("false");
        }
    };

    if (state && state.token) router.push("/login");

    return (
        <div className="container-fluid ">
            <div className="row py-5 bg-default-img text-light">
                <div className="col text-center">
                    <h1>Forget Password ?? </h1>
                </div>
            </div>


            <div className="row py-5">
                <div className="col-md-6 offset-md-3">

                    <ForgetPasswordForm
                        handleSubmit={handleSubmit}
                        email={email}
                        newPassword={newPassword}
                        secert={secert}
                        setEmail={setEmail}
                        setNewPassword={setNewPassword}
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
                        <p>You have succesfully Reset Your Password</p>
                        <Link href="/login">
                            <a className="btn btn-primary btn-sm">Login</a>
                        </Link>
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword;
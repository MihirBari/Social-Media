import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router"
import Link from "next/link";
import AuthForm from "../component/Forms/AuthForm";
import { UserContext } from "../context";

const Login = () => {


    //const username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const [state, setstate] = useContext(UserContext)
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        //console.log(name,email,password)
        try {
            const { data } = await axios.post(`/login`, {

                email,
                password,

            });

            //update context
            if (data.error) {
                toast.error(data.error);
                setLoading(false);
            } else {
                setstate({
                    user: data.user,
                    token: data.token,
                });
                console.log(data)
                //store in local storage
                window.localStorage.setItem('auth', JSON.stringify(data))
                router.push("/user/dashboard")
            }
        } catch (err) {

            toast.error(err.response.data);
            setLoading(false);
        }
    };

    if (state && state.token) router.push("/user/dashboard");

    return (
        <div className="container-fluid ">
            <div className="row py-5 bg-default-img text-light">
                <div className="col text-center">
                    <h1>Login </h1>
                </div>
            </div>


            <div className="row py-5">
                <div className="col-md-6 offset-md-3">

                    <AuthForm
                        handleSubmit={handleSubmit}
                        email={email}
                        password={password}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        loading={loading}
                        page="login"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p className="text-center">Not registered yet🤨?<Link href="/register">
                        <a >Register</a>
                    </Link></p>
                </div>
            </div>
            <div className="row text-center">
                <div className="col">
                    <Link href="/forget-password">
                        <a className="text-primary">Forget Password</a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login;
import { UserProvider } from "../context";
import "bootstrap/dist/css/bootstrap.min.css"
import Nav from "../component/Nav";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "antd/dist/antd.css"

function MyApp({ Component, pageProps }) {
    return (
        <UserProvider>
            <Head>
                <link rel="stylesheet" href="/css/style.css" />
            </Head>
            <Nav />
            <ToastContainer position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
            <Component {...pageProps} />
        </UserProvider>
    );
}

export default MyApp;
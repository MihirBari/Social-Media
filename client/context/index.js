import { useState, createContext, useEffect } from "react";
import axios from "axios";
import {  useRouter } from "next/router";

const UserContext = createContext();

const router = useRouter;

const UserProvider = ({ children }) => {
    const [state, setstate] = useState({
        user: {},
        token: "",
    });

    useEffect(() => {
        setstate(JSON.parse(window.localStorage.getItem("auth")));
    }, []);

    const token = state && state.token ? state.token : "";
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    axios.interceptors.response.use(
        function (config) {
            return config;
        },
        function (error) {
            let res = error.response;
            if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
                setstate(null);
                window.localStorage.removeItem("auth");
                router.push("/login");
            }
        }
    );

    return (
        <UserContext.Provider value={[state, setstate]}>
            {children}
        </UserContext.Provider>
    )
};


export { UserContext, UserProvider };
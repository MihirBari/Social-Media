import { useState, useContext } from "react";
import { UserContext } from "../context";
import axios from "axios";
import People from "./cards/People";
import { toast } from "react-toastify";

const Search = () => {

    const [state, setState] = useContext(UserContext);
    const [query, setQuery] = useState("");
    const [result, setResult] = useState([]);

    const searchUser = async (e) => {
        e.preventDefault();
        //console.log(`find ${query}`);
        try {
            const { data } = await axios.get(`/search-user/${query}`);
            // console.log(data)
            setResult(data);
        } catch (err) {
            console.log(err)
        }
    };

    const handleFollow = async (user) => {
        try {
            const { data } = await axios.put("/user-follow", { _id: user._id });
            //console.log("follower=>",data);
            //local storage update , user update ,keep token
            let auth = JSON.parse(localStorage.getItem("auth"));
            auth.user = data
            localStorage.setItem("auth", JSON.stringify(auth));
            //update  context
            setState({ ...state, user: data });
            //update people state
            let filtered = result.filter((p) => p._id !== user._id);
            setResult(filtered);
            // render Post
            toast.success(`You followed ${user.name}`)
        } catch (err) {
            console.log(err)
        }
    }

    const handleUnFollow = async (user) => {
        try {
            const { data } = await axios.put("/user-unfollow", { _id: user._id });
            let auth = JSON.parse(localStorage.getItem("auth"));
            auth.user = data
            localStorage.setItem("auth", JSON.stringify(auth));
            //update  context
            setState({ ...state, user: data });
            //update people state
            let filtered = result.filter((p) => p._id !== user._id);
            setResult(filtered);
            toast.error(`You Unfollowed ${user.name}`)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <form className="form-inline row pt-2" onSubmit={searchUser}>
                <div className="col-8">
                    <input onChange={(e) => setQuery(e.target.value)} value={query}
                        className="form-control m"
                        type="search"
                        placeholder="search" />
                </div>
                <div className="col-4">
                    <button className="btn btn-outline-primary col-12" type="submit">Search</button>
                </div>
            </form>
            {result && result.map((r) => (<People key={r._id} people={result}
                handleFollow={handleFollow} handleUnFollow={handleUnFollow} />)
            )}
        </>
    )
}

export default Search;
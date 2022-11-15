import { Avatar, List } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { CloseCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";



const Following = () => {
    const [state, setState] = useContext(UserContext)
    //state
    const [people, setPeople] = useState([]);

    useEffect(() => {
        if (state && state.token) fetchFollowing()
    }, [state && state.token])

    const fetchFollowing = async () => {
        try {
            const { data } = await axios.get("/user-following");
            setPeople(data);
        } catch (err) {
            console.log(err)
        }
    }

    const router = useRouter();

    const imageSource = (user) => {
        if (user.image) {
            return user.image.url;
        } else {
            return "/images/logo.png";
        }
    };

    const handleUnFollow = async (user) => {
        try {
            const { data } = await axios.put("/user-unfollow", { _id: user._id });
            let auth = JSON.parse(localStorage.getItem("auth"));
            auth.user = data
            localStorage.setItem("auth", JSON.stringify(auth));
            //update  context
            setState({ ...state, user: data });
            //update people state
            let filtered = people.filter((p) => p._id !== user._id);
            setPeople(filtered);
            toast.error(`You Unfollowed ${user.name}`)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="row col-md-6 offset-md-3">
            <List itemLayout="horizontal" dataSource={people} renderItem={(user) => (
                <List.Item>
                    <List.Item.Meta avatar={<Avatar src={imageSource(user)} />}
                        title={<div className="d-flex justify-content-between">
                               <Link href={`/user/${user.username}`}>
                                <a>{user.username}</a>
                            </Link><span onClick={() => handleUnFollow(user)} className="text-primary pointer">Unfollow</span>
                        </div>} />
                </List.Item>
            )} />
            <Link href="/user/dashboard">
                <a className="d-flex justify-content-center pt-5">
                    <CloseCircleOutlined />
                </a></Link>
        </div>

    )
}

export default Following;
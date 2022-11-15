import { UserContext } from "../context";
import { useContext ,useEffect, useState} from "react";
import ParallaxBG from "../component/cards/ParallaxBG";
import axios from "axios";
import PostPublic from "../component/cards/PostPublic";
import Head from "next/head"
import Link from "next/link";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO ,
    {path :"/socket.io"},
    {reconnection: true},
);

const Home = ({ posts }) => {
    const [state, setstate] = useContext(UserContext);
    const [newsFed , setNewsfed] = useState([])

    useEffect(() => {
     socket.on('new-post',(newPost)=>{
     setNewsfed([newPost, ...posts]);
     }); 
    },[]);

    const head = () => {
        <Head>
            <title>MernCamp - social media Website</title>
            <meta name="description" content="Chat however you want"  />
            <meta 
            property="og:description" 
            content="A social media website"
            />
             <meta property="og:site_namel" content="Reddit2.0"  />
            <meta property="og:url" content="www.Mihir.com"  />
            <meta property="og:image:secure_url" content="http://mihir.com/images/default.jpg"  />
        </Head>
    };

    const collection = newsFed.length > 0 ? newsFed : posts;

    return (
        <>
          {head()}
            <ParallaxBG url="/images/default1.jpg">
                SOCIAL NETWORK
            </ParallaxBG>
            <div className="container">
                <div className="row pt-5">
                    {collection.map((post) => (
                        <div key={post._id} className="col-md-4" >
                        <Link href={`/post/view/${post._id} `}>
                            <a>
                            <PostPublic key={post._id} post={post} />
                            </a>
                        </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}


export async function getServerSideProps() {
    const { data } = await axios.get('/posts')
    console.log(data);
    return {
        props: {
            posts: data,
        },
    };
}



export default Home;
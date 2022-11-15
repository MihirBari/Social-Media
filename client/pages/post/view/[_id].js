import ParallaxBG from "../../../component/cards/ParallaxBG";
import axios from "axios";
import PostPublic from "../../../component/cards/PostPublic"
import Head from "next/head"


const SinglePost = ({ post }) => {


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

    return (
        <>
          {head()}
            <ParallaxBG url="/images/default1.jpg">
                SOCIAL NETWORK
            </ParallaxBG>
            <div className="container">
                <div className="row pt-5">
                    
                        <div className="col-md-8 offset-md-2" >

                            <PostPublic key={post._id} post={post} />
                        </div>
            
                </div>
            </div>
        </>
    )
}


export async function getServerSideProps(ctx) {
    const { data } = await axios.get(`/post/${ctx.params._id}`)
    console.log(data);
    return {
        props: {
            post: data,
        },
    };
}



export default SinglePost;
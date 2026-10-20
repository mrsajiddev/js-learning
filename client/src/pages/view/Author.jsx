import { useState, useEffect } from "react";
import {useParams, useNavigate, Link} from 'react-router-dom';
import {Header} from "./layout/Header";
import {Footer} from "./layout/Footer";
import PopupModel from "../dashboard/global/popupModal";
import Chat from "../socket/chat"; 
import {jwtDecode} from "jwt-decode";
import { MailIcon, PhoneIcon, ThumbsUp, ThumbsDown, MessageCircleIcon} from "lucide-react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Author () {
    const {authorId} = useParams();
    const [loader, setLoader] = useState(false);
    const [author, setAuthor] = useState([]);
    const [userId, setUserId] = useState('');
    const [chatOpen, setChatOpen] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith(`token=`))
            ?.split('=')[1];
        let CurrentUserId = null;
        if (token) {
            const decodedToken = jwtDecode(token);
            CurrentUserId = decodedToken.id;
            setUserId(decodedToken.id);
        }
        setLoader(true);
        const getAuthor = async () => {
            try{
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}/author/${authorId}`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                setAuthor(data.data);
            }catch(error){
                console.log(error);
            }finally{
                setLoader(false);
            }
        }
        getAuthor();
    }, [authorId]);
    const handleFollowUser = async () => {
        if(!userId){
            navigate('/login');
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/follow-user`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    follower_id: userId,
                    following_id: authorId
                })
            });
            const data = await response.json();
            if(data.success){
                setIsFollowed(!isFollowed);
            }
        } catch(error) {
            console.log(error);
        }
    }
    return (
        <main className="relative w-full h-screen bg-gray-100">
            <Header />

            <PopupModel
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                pWidth='500'
                isChat = {chatOpen ? true : false}
                popupData={<Chat authorId={ parseInt(authorId)} />}
            />
            <div className="">
                <div className="w-full h-full flex flex-col justify-center items-center">
                    {loader ? (
                        <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '55vh' }}>
                            <CircularProgress aria-label="Loading…" />
                        </Box>
                        ) : (
                    <div className="w-full lg:w-[80%] mx-auto p-3">
                        <div className="flex flex-row justify-center items-center gap-4 p-4 bg-orange-400 text-white rounded-xl">
                            <div className="w-[20%] rounded-lg bg-gray-100">
                                <img src={author.profile_image || '/images/author.png'} alt="author" className="w-full h-auto rounded-lg" />
                            </div>
                            <div className="w-[80%]">
                                <h2 className="text-2xl font-bold">{author.full_name} </h2>
                                <div className="w-full flex flex-row gap-4 mt-2 justify-start items-start">
                                    <p>Followers <span className="font-semibold">{author.follower_count}</span></p>
                                    <p>Following <span className="font-semibold">{author.following_count}</span></p>
                                </div>
                                {/* Bio max 3 lines, end with three dots if more then 3 lines, make sure it does not break any line in middle */}
                                <p className="max-h-20 overflow-hidden line-clamp-3">{author.user_bio}</p>
                                <div className="w-full flex flex-row gap-4 mt-2 justify-start items-start">
                                    {author.user_email && <Link to={`mailto:${author.user_email}`} className="flex text-white items-center gap-2"><MailIcon className="cursor-pointer" /><p className="text-white font-semibold">{author.user_email}</p></Link>}
                                    {author.user_phone && <Link to={`tel:${author.phone_number}`} className="flex text-white items-center gap-2"><PhoneIcon className="cursor-pointer" /><p className="text-white font-semibold">{author.user_phone}</p></Link>}
                                </div>
                                {/* appear only when user is logged in and is not author of the blog */}
                                <div className="w-full flex flex-row gap-4 mt-5 justify-start items-start">
                                    {
                                        userId === author.id ? (
                                            <Link to={`/my-account`} className="w-fit h-fit text-sm text-white rounded-[100px] p-2 bg-orange-400 ">Edit Profile</Link>
                                        ) : (
                                            userId && <button className="w-fit h-fit text-sm text-white rounded-[100px] p-2 bg-orange-400 " onClick={handleFollowUser}>{isFollowed ? 'Unfollow' : 'Follow'}</button>
                                        ) 
                                    }
                                </div>
                                {
                                    <MessageCircleIcon onClick={() => { setChatOpen(true) }} size={24} className="cursor-pointer text-white hover:text-gray-200" />
                                }
                            </div>
                        </div>
                        <hr className="w-full border-1 border-gray-200 mt-2 mb-2" />
                        <div >
                            <h2 className="text-xl font-bold mb-2">Posts by {author.full_name}</h2>
                            <div className="grid grid-cols-3 gap-4">
                            {author.posts?.length > 0 ? author.posts.map((blog) => (
                                <div key={blog.id} className="flex flex-row items-center justify-center gap-3 p-5 border bg-white border-gray-200 rounded-3xl">
                                    <div className="w-[40%] h-auto overflow-hidden rounded-lg">
                                        <Link to={`/blog/${blog.slug}`}><img className="w-full hover:scale-110 transition-all duration-300 ease-in-out " src={blog.post_image_url} alt={blog.title} /></Link>
                                    </div>
                                    <div className="w-[60%] flex flex-col">
                                    <Link to={`/post/${blog.slug}`}><h2 className="font-semibold text-lg cursor-pointer hover:underline">{blog.title}</h2></Link>
                                    <div className="relative mt-1 flex flex-col gap-2">
                                    <div className="w-full flex items-center gap-2">
                                        {
                                            blog.categories ? 
                                                blog.categories.map((category) => (
                                                    <Link to={`/category/${category.cat_slug}`}><span key={category.id} className="w-fit h-fit text-xs text-white rounded-[100px] py-1 px-2 bg-orange-400 ">{category.cat_name}</span></Link>
                                                ))
                                            : 
                                            null
                                        }
                                    </div>
                                        <span className="text-sm">{dayjs(blog.created_at).tz('Asia/Kolkata').format('ddd, MMMM YYYY')}</span>
                                        <div className="absolute bottom-0 right-0 w-full h-full flex items-end justify-end gap-2">
                                            <div className="flex items-center gap-2">
                                                <ThumbsUp className="w-4 h-4 text-green-500" />
                                                <span className="text-gray-500">{blog.posts_like_count}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ThumbsDown className="w-4 h-4 text-red-500" />
                                                <span className="text-gray-500">{blog.posts_dislike_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            )) : <p className="text-gray-500 text-sm">No posts found</p>}
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
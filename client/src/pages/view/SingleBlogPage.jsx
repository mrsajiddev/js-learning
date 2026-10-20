import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import Error404 from "./404";
import CommentSection from '../components/commentSection'; 
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {ArrowLeft, ArrowRight, ThumbsUp, ThumbsDown, UserPlus } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import { RiFacebookLine } from "react-icons/ri";
import { VscTwitter } from "react-icons/vsc";
import { PiPinterestLogo } from "react-icons/pi";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function SingleBlogPage(){
    const [loader, setLoader] = useState(false);
    const [userId, setUserId] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [isDisLiked, setIsDisLiked] = useState(0);
    const [comment, setComment] = useState("");
    const [isFollowed, setIsFollowed] = useState(false);
    const [reply, setReply] = useState("");
    const [isRefresh, setIsRefresh] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState([]);   
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
        const getSinglePost = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}/post/${slug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userId: CurrentUserId 
                }),
                });

                const data = await response.json();
                setBlog(data.data);
                setIsRefresh(false);
            } catch(error) {
                console.log(error);
            } finally {
                setLoader(false);
            }
        };
        getSinglePost();
    }, [slug, isRefresh]);

     const onlikeBlog = async (blogId, commentId, like_type, like_status) => {
        if(!userId){
            navigate('/login');
        }
        if(isDisLiked){
            setIsDisLiked(false);
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/likes`,{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json' // 👈 Crucial header
                },
                body:JSON.stringify({
                    user_id: userId,
                    post_id: blogId ?? null,
                    comment_id: commentId ?? null,
                    like_status: like_status,
                    like_type: like_type
                })
            });
            const data = await response.json();
                if (data.success) {
                    setIsRefresh(true);
                }
            } catch(error) {
                console.log(error);
            }
        isLiked ? setIsLiked(false) : setIsLiked(true);
    };

    const dislikeBlog = async (blogId, commentId, like_type) => {
        if(!userId){
            navigate('/login');
        }
        if(isLiked){
            setIsLiked(false);
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/likes`,{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json' // 👈 Crucial header
                },
                body:JSON.stringify({
                    user_id: userId,
                    post_id: blogId ?? null,
                    comment_id: commentId ?? null,
                    like_status: !isDisLiked ? -1 : 0,
                    like_type: like_type
                })
            });
            const data = await response.json();
            if (data.success) {
                setIsRefresh(true);
            }
            } catch(error) {
                console.log(error);
            }
        isDisLiked ? setIsDisLiked(false) : setIsDisLiked(true);
    };

    const handleCommentSubmit = async (blogId) => {
        if(!userId){
            navigate('/login');
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/comments`,{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    user_id: userId,
                    post_id: blogId,
                    comment: comment,
                })
            });
            if(response.success){
                setIsRefresh(true);                
            }
        } catch(error) {
            console.log(error);
        }
    };

    const handleReplySubmit = async (blogId, commentId) => {
        if(!userId){
            navigate('/login');
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/comment-reply`,{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    user_id: userId,
                    post_id: blogId,
                    comment: reply,
                    parent_id: commentId
                })
            });
            const data = await response.json();
            if(data.success){
                navigate(0);
            }
        } catch(error) {
            console.log(error);
        }
    };

    const handleUpdateComment = async (blogId, commentId, comment) => {
        if(!userId){
            navigate('/login');
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/comment-update`,{
                method:"PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    user_id: userId,
                    post_id: blogId,
                    comment: comment,
                    comment_id: commentId
                })
            });
            const data = await response.json();
            if(data.success){
                navigate(0);
            }
        } catch(error) {
            console.log(error);
        }
    };
    
    // Follow User
    const handleFollowUser = async (blogId,authorId, isFollowed) => {
        if(!userId){
            navigate('/login');
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/follow`,{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    blog_id: blogId,
                    follower_id: userId,
                    following_id: authorId,
                    follow_status: isFollowed
                })
            });
            const data = await response.json();
            if(data.success){
                setIsRefresh(true);
            }
        } catch(error) {
            console.log(error);
        }
    };

    return(
        <main className="w-full h-screen bg-gray-100">
            <Header />
            {
            blog ? (
            <div className="w-full h-auto bg-gray-100">
                <div className="md:w-[80%] w-full flex flex-col items-center justify-center mx-auto h-full md:px-10 px-3">
                            {loader ? (
                                <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '55vh' }}>
                                    <CircularProgress aria-label="Loading…" />
                                </Box>
                                ) : (
                    <div className="md:w-[70%] gap-5 w-full h-full">
                        {/*Breadcrumbs */}
                        <div className="w-full h-full mt-5">
                            <div className="w-full h-10 flex items-center">
                                <Link to="/" className="text-gray-500 hover:text-orange-400">Home</Link>
                                <span className="text-gray-500 mx-2">/</span>
                                <Link to="/posts" className="text-gray-500 hover:text-orange-400">Blogs</Link>
                                <span className="text-gray-500 mx-2">/</span>
                                <span className="text-gray-500">{blog.title}</span>
                            </div>
                        </div>
                        {/* Blog Image */}
                        <div className="w-full h-full md:mt-5 mt-2">
                            <div className="w-full h-auto flex items-center">
                                <img src={blog.post_image_url} alt={blog.title} className="w-full h-full object-cover rounded-3xl" />
                            </div>
                        </div>
                        {/* Blog Content */}
                        <div className="w-full mx-auto  md:mt-10 mt-5">
                            {/* Category */}
                            <div className="w-full h-full md:mt-5 mt-2">
                                <div className="w-full h-auto flex items-center ">
                                    {blog.categories ? blog.categories.map((category) => (
                                        <Link to={`/category/${category.cat_slug}`} key={category.id}  className="text-white md:text-md text-sm  bg-orange-400 rounded-full md:px-5 px-3 py-1">{category.cat_name}</Link>
                                    )) : (
                                        ''
                                    )}
                                    <div className="w-full h-full flex items-center justify-end gap-2">
                                        <span>{blog.like_count == null ? 0 : blog.like_count}</span>
                                        <ThumbsUp onClick={() => onlikeBlog(blog.id, null, 'post', blog.user_reaction == 1 ? 0 : 1  )} className={`w-[20px] cursor-pointer ${blog.user_reaction === 1 ? "text-green-400" : "text-orange-400"} hover:text-gray-700 h-[20px]`} />
                                        <span>{blog.dislike_count == null ? 0 : blog.dislike_count}</span>
                                        <ThumbsDown onClick={() => dislikeBlog(blog.id, null, 'post')} className={`w-[20px] cursor-pointer text-orange-400 ${blog.user_reaction === -1 ? "text-red-400" : "text-orange-400"} hover:text-gray-700 h-[20px]`} />
                                    </div>
                                </div>
                            </div>
                            {/* Blog Title */}
                            <div className="w-full h-full md:mt-5 mt-2">
                                <h1 className="md:text-5xl text-3xl font-semibold">{blog.title}</h1>
                            </div>
                            {/* Blog Date, Last modified and Author. Date Format : July 23, 2026 */}
                            <div className="w-full h-full md:mt-5 mt-2">
                                <div className="w-full h-auto flex md:flex-row flex-col md:items-center items-start gap-2 md:gap-8 gap-4 flex-wrap">
                                    <li className="text-gray-500 list-none">{ blog.created_at ? "Published : " + dayjs(blog.created_at).tz('Asia/Kolkata').format('ddd, MMMM YYYY') : ''}</li>
                                    <li className="text-gray-500 list-none">Last modified: {blog.updated_at ? dayjs(blog.updated_at).tz('Asia/Kolkata').format('ddd, MMMM YYYY') : ''}</li>
                                    { 
                                     blog.author ? <li className="text-gray-500 flex items-center gap-1 list-none md:list-disk">By: <img className="w-[16px] h-[16px] rounded-full  hover:scale-110 transition-all duration-300 ease-in-out " src={blog.author.profile_image} alt={blog.author.username} /><Link to={`/author/${blog.author.id}`}>{blog.author.user_name}</Link>{blog.author.id === userId ? '' : <span onClick={() => 
                                    handleFollowUser(blog.id, blog.author.id, blog?.is_follow ? 0 : 1)} className="text-orange-400 cursor-pointer">{blog?.is_follow ? `(${blog.follower_count ?? 0} Unfollow)` :  `(${blog.follower_count ?? 0} + Follow)`}</span>}</li> : <li>By:</li>
                                    }
                                </div> 
                            </div>
                            {/* Content in proper html */}
                            <div className="w-full h-full mt-5">
                                <div className="w-full h-auto flex items-center  tiptap tiptap-frontend">
                                    <p className="text-gray-500 blog-content" dangerouslySetInnerHTML={{ __html: blog?.description }}></p>
                                </div>
                            </div>
                            {/* Next and Previous Post */}
                            <div className="w-full h-full mt-5 flex items-center justify-between">
                                    <div >
                                            <p className="text-gray-500">Previous Post:</p>
                                            <button className={`${blog?.prev_post ? "" : "opacity-50 cursor-not-allowed"} flex flex-row items-center gap-2 cursor-pointer text-black`}>
                                            <ArrowLeft className="w-5 h-5" />
                                            {blog?.prev_post ? <Link to={`/post/${blog?.prev_post?.slug}`}>{blog?.prev_post?.title}</Link> : 'No previous post'}
                                        </button>
                                    </div>
                                    <div >
                                        <p className="text-gray-500">Next Post:</p>
                                        <button className={`${blog?.next_post ? "" : "opacity-50 cursor-not-allowed"} flex flex-row-reverse items-center gap-2 cursor-pointer text-black`}>
                                            <ArrowRight className="w-5 h-5" />
                                            {blog?.next_post ? <Link to={`/post/${blog?.next_post?.slug}`}>{blog?.next_post?.title}</Link> : 'No next post'}
                                        </button>
                                    </div>
                            </div>
                            {/* Tags and Social */}
                            <div className="w-full h-full md:mt-20 mt-10">
                                <div className="w-full h-auto flex flex-row items-center md:justify-between justify-end  mb-10 md:mb-0">
                                    <div className="w-[60%] h-auto flex md:flex-row flex-col md:items-center items-start gap-2">
                                        <p className="text-black font-semibold">Tags:</p>
                                        <div className='flex items-center gap-2 flex-wrap'>
                                        {blog.tags ? blog.tags.map((tag) => (
                                            <Link to={`/posts/tag/${tag.tag_slug}`} className="text-black md:text-md text-sm hover:text-white border hover:border-orange-400 border-gray-400 hover:bg-orange-400 bg-white rounded-full md:px-5 px-3 py-1">{tag.tag_name}</Link>
                                        ))
                                        : ''
                                        }
                                        </div>
                                    </div>
                                    <div className="w-[40%] h-auto md:mt-0 md:mt-5 mt-0 md:ml-0 ml-5 flex md:flex-row flex-col md:items-center items-start justify-end gap-2">
                                        <p className="text-black font-semibold">Social:</p>
                                        <div className="flex items-center gap-2">
                                            <span className="border hover:bg-orange-400 hover:text-white hover:border-orange-400 bg-white rounded-full p-2">
                                                <RiFacebookLine  className="text-black md:text-xl text-md cursor-pointer" />
                                            </span>
                                            <span className="border hover:bg-orange-400 hover:text-white hover:border-orange-400 bg-white rounded-full p-2">
                                                <VscTwitter className="text-black md:text-xl text-md cursor-pointer" />
                                            </span>
                                            <span className="border hover:bg-orange-400 hover:text-white hover:border-orange-400 bg-white rounded-full p-2">
                                                <PiPinterestLogo className="text-black md:text-xl text-md cursor-pointer" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-10 mb-10 border-gray-200 md:block hidden" />
                                   <CommentSection 
                                    blog={blog}
                                    comment={comment}
                                    setComment={setComment}
                                    reply={reply}
                                    setReply={setReply}
                                    onCommentSubmit={handleCommentSubmit}
                                    onReplySubmit={handleReplySubmit}
                                    likeBlog={onlikeBlog}
                                    handleUpdateComment={handleUpdateComment}
                                />
                            </div>
                        </div>
                    </div> 
                )}
                </div>
            </div>
                ):(
                    <>
                    <Error404 />
                    </>
                )}
            <Footer />  
        </main>
    );
}
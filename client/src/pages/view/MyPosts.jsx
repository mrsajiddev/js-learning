import React from 'react'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { Sidebar } from "./layout/Sidebar";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'
import { useProfile } from "../dashboard/global/UserContext";
import PopupModal from "../dashboard/global/popupModal";
import CreatePost from "../dashboard/popups/createPost";
import UpdatePost from "../dashboard/popups/updatePost";
import NoticeComponents from "../components/noticComponents";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone';
import { Pencil } from "lucide-react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { jwtDecode } from "jwt-decode";
dayjs.extend(utc);
dayjs.extend(timezone);


const MyAccount = () => {
    const [purchasedPlan, setPurchasedPlan] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loader, setLoader] = useState(true);

    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState({});
    const { getProfileImage, getProfileData, loading, error } = useProfile();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [addPost, setAddPost] = useState(false);
    const [updatePost, setUpdatePost] = useState(false);
    const [postId, setPostId] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [notice, setNotice] = useState(
        {
            type: "",
            message: ""
        }
    );
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {

        //get token value
        const token = document.cookie
        .split('; ')
        .find(row => row.startsWith(`token=`))
        ?.split('=')[1];
        if (token) {
            const decoded = jwtDecode(token);
            currentMembership(decoded.id);
            getProfileImage(decoded.id);
        } 

        const getPosts = async (id) => {
            const postsResponse = await fetch(`${process.env.REACT_APP_HOST_URL}/my-posts`,{
                method: "POST",
                body: JSON.stringify({
                    user_id: id
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const postsData = await postsResponse.json();
            setPosts(postsData.data.sort((a, b) => b.id - a.id));
        } 
        const getCategories = async()=>{
            try{
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/categories`);
                const data = await response.json();
                if(response.ok){
                    setCategories(data.data);
                }
            }catch(error){
                console.log(error);
            }
        }
        const getTags = async()=>{
            try{
                const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/tags`);
                const data = await response.json();
                if(response.ok){
                    setTags(data.data);
                }
            }catch(error){
                console.log(error);
            }
        }
        getCategories();
        getTags();
        getPosts(userId);

    }, [navigate, refreshTrigger, getProfileImage, userId]);
    
    const currentMembership = async (id) => {
        try {
            setLoader(true);
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/purchased_plan/${id}`,{
                method: "GET",
            });
            const data = await response.json();
            if(response.ok){
                setUserId(id);
                setPurchasedPlan(data.data);
            }
        } catch (error) {
            console.error("Error fetching current membership:", error);
            // Handle error (e.g., show error message)
        } finally {
            setLoader(false);
        }
    }
     // 1. Callback function that expects a value from the child
    const handleChildData = (value) => {
        setShowPopup(value);
        setAddPost(value);
        setUpdatePost(value);
        setRefreshTrigger(prev => prev + 1);
    };

    const handlePopupModal = () => {
        setAddPost(true);
        setShowPopup(true);
    }

    const handleUpdatePost = (post_id)=>{
        setPostId(post_id);
        setUpdatePost(true);
        setShowPopup(true);
    }

    const handleNotice = (notice) => {
        setNotice(notice);
    }
    const truncateText = (html, length = 150) => {
        const text = html?.replace(/<[^>]*>/g, "") || "";

        return text.length > length
            ? text.substring(0, length) + "..."
            : text;
    };
    return (
        <main className="w-full h-auto bg-gray-100">
            <Header />
            <div className="w-full flex h-full">
                <div className='flex w-[15%] h-auto bg-gray-100'>
                    <Sidebar />
                </div>
                <div className="main-container w-[85%] h-full ml-auto mr-auto md:pt-10 pt-5 md:pb-10 pb-6 mb-6 md:mb-10 sm:mb-6 flex flex-col items-start justify-start page">
                {loader ? (
                    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '25vh' }}>
                        <CircularProgress aria-label="Loading…" />
                    </Box>
                ) : (
                    <div className="w-full h-full">
                        <div className="w-[90%] mx-auto h-40 flex flex-col items-center justify-center gap-5 bg-orange-500 rounded-xl mb-5 p-5 border border-gray-200">
                            <h2 className="text-2xl font-bold text-white">Your Posts</h2>
                            <p className="text-white">View and Edit your posted content</p>
                        </div>
                        <div className='w-[90%] mx-auto h-full flex flex-col md:flex-row gap-5'>
                            
                            <div className="w-full h-full flex flex-col items-start justify-start gap-5 bg-white rounded-xl p-5 border border-gray-200">
                                
                                                {/* CONTENT */}
                                                <main className="flex-1 p-8 overflow-y-auto">
                                                    {/* Add User Button */}
                                                    <button className="bg-orange-500 hover:bg-orange-400 text-white mb-8 px-4 py-2 rounded-md"
                                                        onClick={handlePopupModal}
                                                    >
                                                        Add Post
                                                    </button>
                                                    <PopupModal
                                                        isOpen={showPopup}
                                                        onClose={
                                                            () => {
                                                                setShowPopup(false);
                                                                setAddPost(false);
                                                                setUpdatePost(false);
                                                            }
                                                        }
                                                        pWidth='690'
                                                        popupData={
                                                            addPost ? <CreatePost onValueReturn={handleChildData} onSetNotice={handleNotice} userId={userId}/> :
                                                            updatePost ? <UpdatePost onValueReturn={handleChildData} onSetNotice={handleNotice} postID={postId} /> :
                                                            null
                                                        }
                                                    />
                                                    <NoticeComponents notice={notice} setNotice={setNotice} />
                                                    {/* users table */}
                                                    <Table className="bg-white rounded-xl flex mt-2 flex-col shadow">
                                                        <TableHead className='text-xs text-white uppercase bg-orange-500 rounded-xl border-b border-gray-200' sx={{color: 'white'}}>
                                                            <TableRow sx={{ fontWeight: "bold" }}>
                                                                <TableCell>#</TableCell>
                                                                <TableCell>ID</TableCell>
                                                                <TableCell>Title</TableCell>
                                                                <TableCell>Slug</TableCell>
                                                                <TableCell>Category</TableCell>
                                                                <TableCell>Tags</TableCell>
                                                                <TableCell sx={{ width: "25%" }}>Content</TableCell>
                                                                <TableCell>Created Date</TableCell>
                                                                <TableCell>Actions</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {posts.map((post, index) => (
                                                                <TableRow key={post.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>{post.id}</TableCell>
                                                                    <TableCell>{post.title}</TableCell>
                                                                    <TableCell>{post.slug}</TableCell>
                                                                    <TableCell>
                                                                        {categories
                                                                            .filter(cat => String(post.cat_id).split(',').map(s => s.trim()).includes(String(cat.id)))
                                                                            .map(cat => cat.cat_name)
                                                                            .join(', ') || '—'}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {tags
                                                                            .filter(tag => String(post.tag_id).split(',').map(s => s.trim()).includes(String(tag.id)))
                                                                            .map(tag => tag.tag_name)
                                                                            .join(', ') || '—'}
                                                                    </TableCell>
                                                                    <TableCell className="post-description" sx={{ overflowWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: truncateText(post.description) }} />
                                                                    <TableCell>{dayjs(post.created_at).tz('Asia/Kolkata').format('ddd, MMMM YYYY, hh:mm A')}</TableCell>
                                                                    <TableCell sx={{ width: "10%" }}>
                                                                        <Pencil onClick={()=>handleUpdatePost(post.id)} className="inline-block mx-1 hover:text-blue-600 cursor-pointer" />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                
                                                </main>
                                
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
            <Footer />
        </main>
    )
}


export default MyAccount
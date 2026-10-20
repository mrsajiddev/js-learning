import React from 'react'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DummyImg from "../assets/dummy-post-square-1.jpg"
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { Sidebar } from "./layout/Sidebar";
import PopupModal from "../dashboard/global/popupModal";
import NoticeComponents from "../components/noticComponents";
import { Users, PenLine } from "lucide-react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'
import { jwtDecode } from "jwt-decode";
import UpdateProfile from "../dashboard/popups/updateProfile";

const MyAccount = () => {
    const [editProfile, setEditProfile] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [purchasedPlan, setPurchasedPlan] = useState([]);
    const [userId, setUserId] = useState('');
    const [imagePreview, setImagePreview] = useState({});
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState(
        {
            type: "",
            message: ""
        }
    );

    useEffect(() => {
        //get token value
        const token = document.cookie
        .split('; ')
        .find(row => row.startsWith(`token=`))
        ?.split('=')[1];
        if (token) {
            const decoded = jwtDecode(token);
            currentMembership(decoded.id);
        } 
    }, [imagePreview, refreshTrigger]);
    
    const currentMembership = async (id) => {
        try {
            setLoading(true);
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
            setLoading(false);
        }
    }   

    const handleImage = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('user_id', userId);

            try{
                setLoading(true);
                    const result = await fetch(`${process.env.REACT_APP_HOST_URL}/profile/image`,{
                        method:"POST",
                        body:formData
                    })
                    const data = await result.json();
                    if(result.ok){
                        setImagePreview(data.data.file_url);   
                        setNotice({
                            type:"success",
                        message:data.message,
                    });
                }
            }catch(error){
                setNotice({
                    type:"error",
                    message:error.message,
                });
            }
            finally{
                setLoading(false);
            }
        }
    }

     // 1. Callback function that expects a value from the child
    const handleChildData = (value) => {
        setShowPopup(value);
        setEditProfile(value);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleNotice = (notice) => {
        setNotice(notice);
    }   

    const handlePopupModal = () => {
        setEditProfile(true);
        setShowPopup(true);
    }

    return (
        <main className="w-full h-auto bg-gray-100">
            <Header />
            <div className="w-full flex h-full">
                <div className='flex w-[15%] h-auto bg-gray-100'>
                    <Sidebar />
                </div>
                <div className="main-container w-[85%] h-auto ml-auto mr-auto md:pt-10 pt-5 md:pb-10 pb-6 mb-6 md:mb-10 sm:mb-6 flex flex-col items-start justify-start page">
                {loading ? (
                    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '25vh' }}>
                        <CircularProgress aria-label="Loading…" />
                    </Box>
                ) : (
                    <div className="w-full h-full">
                        <div className="w-[90%] mx-auto h-40 flex flex-col items-center justify-center gap-5 bg-orange-500 rounded-xl mb-5 p-5 border border-gray-200">
                            <h2 className="text-2xl font-bold text-white">Your Personal Information</h2>
                            <p className="text-white">View and edit your personal information</p>
                        </div>

                        <PopupModal
                            isOpen={showPopup}
                            onClose={
                                () => {
                                    setShowPopup(false);
                                    setEditProfile(false);
                                }
                            }
                            pWidth='690'
                            popupData={
                                editProfile ? <UpdateProfile onValueReturn={handleChildData} onSetNotice={handleNotice} userId={userId}/> :
                                null
                            }
                        />

                        
                        <div className='w-[90%] mx-auto h-auto grid grid-cols-1 md:grid-cols-2 gap-5'>
                            
                            <div className="w-full h-full flex flex-col items-start justify-start gap-5 bg-white rounded-xl p-5 border border-gray-200">
                                <div className="w-full h-auto flex flex-row items-center justify-center py-5 bg-orange-500 rounded-lg">
                                    <div className="flex flex-col items-center  gap-20 bg-white p-2 rounded-full">
                                        <div className="relative">
                                            <img
                                            src={purchasedPlan.user.profile_image ?? `${process.env.PUBLIC_URL}` + DummyImg}
                                            alt="Admin"
                                            width={150}
                                            height={150}
                                            className="rounded-full object-cover"
                                            />
                                            {/* hover image upload button */}
                                            {loading ? (
                                                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                                    <span className="spinner"></span>
                                                </div>
                                            ) : (
                                                <div onClick={() => document.getElementById("imageUpload").click()} className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition">
                                                    <PenLine size={24} color="white" />
                                                </div>
                                            )}
                                        </div>
                                        <form className="absolute top-12 right-5" >
                                            <input type="file" onChange={handleImage} className="hidden" id="imageUpload" />
                                        </form>
                                    </div>
                                </div>
                                <NoticeComponents notice={notice} setNotice={setNotice} />
                                {/* User Detail in table format */}
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-white uppercase bg-orange-500 rounded-xl border-b border-gray-200">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Field Name</th>
                                            <th scope="col" className="px-6 py-3">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-200">
                                            <td className="px-6 py-3">Full Name</td>
                                            <td className="px-6 py-3">{purchasedPlan.user.full_name}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="px-6 py-3">Username</td>
                                            <td className="px-6 py-3">{purchasedPlan.user.user_name}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="px-6 py-3">Email</td>
                                            <td className="px-6 py-3">{purchasedPlan.user.user_email}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="px-6 py-3">Address</td>
                                            <td className="px-6 py-3">{purchasedPlan.user.address}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="px-6 py-3">Phone Number</td>
                                            <td className="px-6 py-3">{purchasedPlan.user.user_phone}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="px-6 py-3">Role</td>
                                            <td className="px-6 py-3">{purchasedPlan.user.user_role}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="px-6 py-3 ">Verified</td>
                                            <td className="px-6 py-3">{purchasedPlan.user.is_verified ? 'Yes' : 'No'}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-3">Bio</td>
                                            <td className="px-6 py-3">{purchasedPlan.user.user_bio ?? "Bio not available"}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-3 text-center" colSpan={2}><p onClick={handlePopupModal} className="px-6 py-3 cursor-pointer bg-orange-500 text-white rounded-xl">Edit Profile</p></td>
                                        </tr>
                                    </tbody>
                                </table>
                                    
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
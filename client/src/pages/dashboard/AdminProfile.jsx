import React from "react";
import { PenLine } from "lucide-react";
import DummyImg from "../assets/dummy-post-square-1.jpg"
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import NoticeComponent from "../components/noticComponents";
import { useProfile } from "./global/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

export default function AdminProfile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [imagePreview, setImagePreview] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [notice, setNotice] = useState({
        type: "",
        message: "",
        action: ""
    });
    const { getProfileData, loading, error } = useProfile();
    const { user_id } = useParams();

    useEffect(() => {
    const checkToken = async () => {
        //get token value
        const token = document.cookie
        .split('; ')
        .find(row => row.startsWith(`token=`))
        ?.split('=')[1];
        if (!token) {
            return navigate('/login');
        }
        const decoded = jwtDecode(token);
        if (decoded.user_role !== "admin") {
            return navigate('/homepage');
        }
        if (user_id) {
            const user = await getProfileData(user_id);
            setUserData(user.data);
        }else{
            setUserData(decoded);
        }
    }
    checkToken();
    }, [navigate, user_id, getProfileData, imagePreview]);
    


    const handleImage = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('user_id', user_id);

            try{
                setIsLoading(true);
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
                setIsLoading(false);
            }
        }
    }
    if (loading) return <p>Loading user data...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!userData) return <p>No user data found.</p>;
    return(
            <div className="w-full flex min-h-screen bg-gray-100">
              {/* Sidebar */}
              <AdminSidebar/>
              {/* Main */}
              <div className="flex-1">
                {/* Header */}
                <AdminHeader pageName="Profile" userD={userData ? userData : {}} />

                <main className="flex-1 p-8">
                {/* Notice Component */}
                <NoticeComponent notice={notice} setNotice={setNotice}  />

                {/* Welcome */}
                <div className="w-1/2 bg-white rounded-xl flex flex-col gap-5 shadow p-8 mb-10">
                    <div className="relative w-full flex items-center gap-50 ">
                        <div className="flex flex-col items-center  gap-20 ">
                        <div className="relative">
                            <img
                            src={userData.profile_image ?  userData.profile_image : `${process.env.PUBLIC_URL}` + DummyImg}
                            alt="Admin"
                            width={150}
                            height={150}
                            className="rounded-full object-cover"
                            />
                            {/* hover image upload button */}
                            {isLoading ? (
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
                        <div className="ml-4">
                            <h3 className="text-xl font-bold">
                                {userData.user_name ? userData.user_name : "---"}
                            </h3>
                            <p className="text-gray-500 mt-2">
                                {userData.user_role ? userData.user_role : "---"}
                            </p>
                            {userData.user_bio && (
                                <p className="text-gray-500 mt-2">
                                    Bio : {userData.user_bio}
                                </p>
                            )}
                        </div>
                    </div>
                    <hr className="w-full text-gray-700" />
                    <div>
                        <h3 className="text-xl font-bold">
                            Profile Information
                        </h3>
                        <form className="grid grid-cols-1 gap-4 mt-4">
                            <div className="grid grid-cols-2 items-center">
                                <h4 className="text-md font-bold">Username: </h4>
                                <div className="flex items-center gap-2 text-gray-500">{userData.user_name ? userData.user_name : "---"}</div>
                                {/* <input type="text" placeholder="Username" className="border-none px-3 py-2 focus:outline-none" /> */}
                            </div>
                            <hr className="w-full text-gray-300" />
                            <div className="grid grid-cols-2 items-center">
                                <h4 className="text-md font-bold">Email: </h4>
                                <div className="flex items-center gap-2 text-gray-500">{userData.user_email ? userData.user_email : "---"}</div>
                                {/* <input type="text" placeholder="Email" className="border-none px-3 py-2 focus:outline-none" /> */}
                            </div>
                            <hr className="w-full text-gray-300" />
                            <div className="grid grid-cols-2 items-center">
                                <h4 className="text-md font-bold">Phone: </h4>
                                <div className="flex items-center gap-2 text-gray-500">{userData.user_phone ? userData.user_phone : "---"}</div>
                                {/* <input type="text" placeholder="Phone" className="border-none px-3 py-2 focus:outline-none" /> */}
                            </div>
                            <hr className="w-full text-gray-300" />
                            <div className="grid grid-cols-2 items-center">
                                <h4 className="text-md font-bold">Verified: </h4>
                                {userData.is_verified === 1 ? (
                                    <div className="flex items-center gap-2 text-gray-500">Yes</div>
                                ) : (
                                    <div className="flex items-center gap-2 text-gray-500">No</div>
                                )}
                                {/* <input type="text" placeholder="Address" className="border-none px-3 py-2 focus:outline-none" /> */}
                            </div>

                        </form>
                    </div>
                </div>
                </main>
            </div>
        </div>
        )
    }
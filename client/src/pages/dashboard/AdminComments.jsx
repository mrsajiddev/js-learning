import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { useProfile } from "./global/UserContext";
import PopupModal from "./global/popupModal";
import NoticeComponents from "../components/noticComponents";
import DeleteComment from "./popups/DeleteComment";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone';
import { Reply, Trash } from "lucide-react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function AdminComments() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState({});
    const { getProfileImage, getProfileData, loading, error } = useProfile();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [deleteComment, setDeleteComment] = useState(false);
    const [commentId, setCommentId] = useState();
    const [notice, setNotice] = useState(
        {
            type: "",
            message: ""
        }
    );
    const [comments, setComments] = useState([]);
    useEffect(() => {

        const getComments = async () => {
            const commentsResponse = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/comments`);
            const commentsData = await commentsResponse.json();
            // sort by recent first
            setComments(commentsData.data.sort((a, b) => b.id - a.id));
        }
        getComments();

        const checkToken = async () => {
            //get token value
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith(`token=`))
                ?.split('=')[1];
            if (token) {
                const decoded = jwtDecode(token);
                if (decoded.user_role === "admin") {
                    // user detail 
                    const user_id = decoded.id;
                    const profileImage = await getProfileImage(user_id);
                    if (profileImage) {
                        setUserData(profileImage.data);
                    } else {
                        setUserData(decoded);
                    }

                    setToken(token);
                } else {
                    navigate('/homepage');
                }
            } else {
                navigate('/login');
            }
        }
        checkToken();
    }, [navigate, refreshTrigger, getProfileImage]);
    const handleDelete = async (id) => {
        setCommentId(id);
        setDeleteComment(true);
        setShowPopup(true);
    }
    const handleChildData = (childData) => {
        setRefreshTrigger(refreshTrigger + 1);
    }

    const handleNotice = (notice) => {
        setNotice(notice);
    }
    return (
        <div className="w-full flex min-h-screen bg-gray-100">

            {/* SIDEBAR */}
            <AdminSidebar />

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col">

                {/* HEADER */}
                <AdminHeader pageName="Comments" userD={userData ? userData : {}} />

                {/* CONTENT */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <PopupModal
                        isOpen={showPopup}
                        onClose={
                            () => {
                                setShowPopup(false);
                                setDeleteComment(false);
                            }
                        }
                        pWidth='590'
                        popupData={
                            deleteComment ? <DeleteComment onValueReturn={handleChildData} onSetNotice={handleNotice} commentID={commentId}/> : <></>
                        }
                    />
                    <NoticeComponents notice={notice} setNotice={setNotice} />
                    {/* users table */}
                    <Table className="bg-white rounded-xl flex mt-2 flex-col shadow">
                        <TableHead>
                            <TableRow sx={{ fontWeight: "bold" }}>
                                <TableCell>#</TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Commenter Name</TableCell>
                                <TableCell>Commenter Email</TableCell>
                                <TableCell>Post</TableCell>
                                <TableCell>Comment</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="overflow-y-auto">
                            {comments.map((comment, index) => (
                                <TableRow key={comment.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{comment.id}</TableCell>
                                    <TableCell>{comment.commentor_name}</TableCell>
                                    <TableCell>{comment.commentor_email}</TableCell>
                                    <TableCell>{comment.post_title}</TableCell>
                                    <TableCell>{comment.content}</TableCell>
                                    <TableCell>{dayjs(comment.created_at).tz('Asia/Karachi').format('ddd, MMMM YYYY, hh:mm A')}</TableCell>
                                    <TableCell>
                                        <Trash onClick={() => handleDelete(comment.id, comment.commentor_name)} className="inline-block mx-2 text-red-500 hover:text-red-800 cursor-pointer" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </main>

            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import { CSpinner } from "@coreui/react";
import Typography from '@mui/material/Typography';


export default function DeleteUser({ userId, onValueReturn, onSetNotice }) {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        full_name: "",
        user_name: "",
        user_email: "",
        user_phone: "",
        user_role: "",
        user_bio: "",
        is_verified: false
    });
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [phoneError, setPhoneError] = useState(false);
    const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
    const [fullNameError, setFullNameError] = useState(false);
    const [fullNameErrorMessage, setFullNameErrorMessage] = useState("");
    const [userNameError, setUserNameError] = useState(false);
    const [userNameErrorMessage, setUserNameErrorMessage] = useState("");
    const [userRoleError, setUserRoleError] = useState(false);
    const [userRoleErrorMessage, setUserRoleErrorMessage] = useState("");

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/profile/${userId}`);
            const data = await response.json();
            setUserData(data.data);
            setLoading(false);
        }
        getUser();
    }, [userId]);

    useEffect(() => {
        // email validatio
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
        if (!emailRegex.test(userData.user_email)) {
            setEmailError(true);
            setEmailErrorMessage("Please enter a valid email address");
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }

        //phone number must contain only digits
        if (!/^[0-9]{11}$/.test(userData.user_phone)) {
            setPhoneError(true);
            setPhoneErrorMessage("Phone number must contain only 11 digits");
        } else {
            setPhoneError(false);
            setPhoneErrorMessage("");
        }

        //Full Name Validation is just not empty
        if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(userData.full_name)) {
            setFullNameError(true);
            setFullNameErrorMessage("Full Name is required");
        } else {
            setFullNameError(false);
            setFullNameErrorMessage("");
        }

        //UserName Validation is just not empty and contain only letters and numbers
        if (!/^[a-zA-Z0-9.]{6,}$/.test(userData.user_name)) {
            setUserNameError(true);
            setUserNameErrorMessage("User Name contain only letters and numbers and must be at least 6 characters long");
        } else {
            setUserNameError(false);
            setUserNameErrorMessage("");
        }

        // User role validation must be admin or user
        if (userData.user_role === "" || userData.user_role === null || !/^[a-zA-Z]+$/.test(userData.user_role)) {
            setUserRoleError(true);
            setUserRoleErrorMessage("User role is required");
        } else {
            setUserRoleError(false);
            setUserRoleErrorMessage("");
        }
    }, [userData]);

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailError || fullNameError || userNameError || userRoleError || phoneError) {
            if (emailError) {
                if (!document.getElementById('emailErrorBox')) {
                    const emailError = document.createElement("span");
                    emailError.id = "emailErrorBox";
                    emailError.className = "text-red-500 text-sm";
                    emailError.innerText = emailErrorMessage;
                    document.getElementById("emailError").after(emailError);
                }
            } else {
                if (document.getElementById('emailErrorBox')) {
                    document.getElementById("emailErrorBox").remove();
                }
            }
            if (fullNameError) {
                if (!document.getElementById('fullNameErrorBox')) {
                    const fullNameError = document.createElement("span");
                    fullNameError.id = "fullNameErrorBox";
                    fullNameError.className = "text-red-500 text-sm";
                    fullNameError.innerText = fullNameErrorMessage;
                    document.getElementById("fullNameError").after(fullNameError);
                }
            } else {
                if (document.getElementById('fullNameErrorBox')) {
                    document.getElementById("fullNameErrorBox").remove();
                }
            }
            if (userNameError) {
                if (!document.getElementById('userNameErrorBox')) {
                    const userNameError = document.createElement("span");
                    userNameError.id = "userNameErrorBox";
                    userNameError.className = "text-red-500 text-sm";
                    userNameError.innerText = userNameErrorMessage;
                    document.getElementById("userNameError").after(userNameError);
                }
            } else {
                if (document.getElementById('userNameErrorBox')) {
                    document.getElementById("userNameErrorBox").remove();
                }
            }
            if (phoneError) {
                if (!document.getElementById('phoneErrorBox')) {
                    const phoneError = document.createElement("span");
                    phoneError.id = "phoneErrorBox";
                    phoneError.className = "text-red-500 text-sm";
                    phoneError.innerText = phoneErrorMessage;
                    document.getElementById("phoneError").after(phoneError);
                }
            }
            return;
        } else {
            if (document.getElementById('phoneErrorBox')) {
                document.getElementById("phoneErrorBox").remove();
            }
        }
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_HOST_URL}/admin/user/update/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok) {
            onSetNotice({ type: "success", message: data.message });
            onValueReturn(false);
        } else {
            onSetNotice({ type: "error", message: data.message });
        }
        setLoading(false);
    };

    return (
        loading ? (
            <div className="w-full flex flex-col gap-2 p-2 items-center">
                <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
                    <CSpinner color="secondary" />
                </Typography>
            </div>
        ) : (
            <form className="w-full flex flex-col gap-2 p-2 items-center" onSubmit={handleSubmit}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
                    Update Profile
                </Typography>
                <div className="w-full grid grid-cols-1 gap-4">
                    <div id="fullNameError" className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Full Name</label>
                        <input type="text" name="full_name" value={userData.full_name || ""} onChange={handleChange} className="border border-gray-300 rounded-md px-2 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div id="userNameError" className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Username</label>
                        <input type="text" name="user_name" value={userData.user_name || ""} onChange={handleChange} className="border border-gray-300 rounded-md px-2 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div id="emailError" className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Email</label>
                        <input type="email" name="user_email" value={userData.user_email || ""} onChange={handleChange} className="border border-gray-300 rounded-md px-2 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div id="phoneError" className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Phone Number</label>
                        <input type="text" name="user_phone" value={userData.user_phone || ""} onChange={handleChange} className="border border-gray-300 rounded-md px-2 py-2 outline-none focus:border-blue-500" />
                    </div>
                    <div id="userBioError" className="flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Bio</label>
                        <textarea name="user_bio" value={userData.user_bio || ""} onChange={handleChange} className="border border-gray-300 rounded-md px-2 py-2 outline-none focus:border-blue-500" />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md" onClick={() => onValueReturn(false)}>Cancel</button>
                    <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md" type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </button>
                </div>
            </form>
        )
    )
}
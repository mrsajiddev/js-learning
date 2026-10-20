import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Trash2 } from "lucide-react";

import useNotifications
    from "../../Hooks/useNotification";


export default function Notifications() {
    const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith(`token=`))
                    ?.split('=')[1];
    const [count, setCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();
    const {
        notifications,
        loading,
        refreshNotifications
    } = useNotifications();
    useEffect(() => {
        const count = notifications.filter(n => !n.msg_is_read).length;
        setCount(count);
    }, [notifications]);
    if (loading) {
        return (
            <div>
                Loading notifications...
            </div>
        );

    }
    
    const readNotification = async (id, senderId, sender_user_name, user_image_url) => {
        // hit API mark as read route is with patch  /notifications/:id/read
        const response = await fetch(`${process.env.REACT_APP_HOST_URL}/notifications/${id}/read`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        const data = await response.json();
        if(data.success){
            navigate(`/chat-dashboard`, {
                state: {
                    user_id: senderId,
                    user_name: sender_user_name,
                    user_image_url: user_image_url
            }
        })
    };
    }

    return (

        <div>
            <button className="relative cursor-pointer hover:text-orange-400" onClick={() => {
                setShowNotifications(!showNotifications);
            }}>
                <Bell size={24} />
                {count < 1 ? (
                    null
                ) : (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {count}
                    </span>
                )}
            </button>
            
            {showNotifications ? (
                <div className="flex-1 overflow-y-auto p-0 border border-black bg-white rounded-md absolute top-20 right-35 w-48 z-50">
            {notifications.length === 0 ? (

                <p>
                    No notifications
                </p>

            ) : (
                notifications.map(
                    (notification) => (

                        <div
                            onClick={() => {
                                readNotification(notification.id, notification.sender_id, notification.sender_user_name, notification.user_image_url);
                                setShowNotifications(false);
                            }}
                            className={`flex flex-row gap-2 justify-start items-center px-4 py-2 border-b border-gray-400 cursor-pointer hover:bg-orange-100 ${notification.msg_is_read ? "" : "bg-orange-100"
                            }`}
                            key={notification.id}
                            
                        >
                            <img src={"http://localhost:5000/" + notification.user_image_url} alt="" className="w-10 h-10 rounded-full" />
                            <div className="flex flex-col items-start gap-1">
                                <h2 className="font-bold text-sm">{notification.sender_user_name}</h2>
                                <p className="text-xs text-gray-500">{notification.message}</p>
                            </div>

                        </div> 


                    )
                )

            )}
            </div>
            ) : null}
        </div>
        

    );

}
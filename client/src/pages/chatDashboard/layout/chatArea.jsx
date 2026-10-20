// import { useEffect, useState, useRef } from "react";
// import EmojiPicker from 'emoji-picker-react';
// import { Smile } from 'lucide-react';
// import { io } from "socket.io-client";
// import { jwtDecode } from "jwt-decode";
// import dummyImage from "../../assets/dummy-post-square-1.jpg"; 
// import { useNavigate } from "react-router-dom";
// const dayjs = require('dayjs');
// const utc = require('dayjs/plugin/utc');
// const timezone = require('dayjs/plugin/timezone');

// dayjs.extend(utc);
// dayjs.extend(timezone);

// const Sidebar = ({width, height, receiverChat }) => {
//     console.log("receiverChat",receiverChat);
//     const [message, setMessage] = useState("");
//     const [chatHistory, setChatHistory] = useState([]);
//     const [showEmoji, setShowEmoji] = useState(false);
//     const socketRef = useRef(null);
//     const messagesEndRef = useRef(null);
//     const navigate = useNavigate();
//     const receiverId = receiverChat?.user_id ?? receiverChat?.id;
//     const groupId = receiverChat?.group_id;
//     // Retrieve token and user details stored during your authentication processes
//     const token = document.cookie
//                     .split('; ')
//                     .find(row => row.startsWith(`token=`))
//                     ?.split('=')[1];
//     const currentUserId = token ? jwtDecode(token).id : null;

//     // check image url is have already base url
//     useEffect(() => {
//         if (receiverChat && receiverChat.user_image_url) {
//             // Check if it already starts with the base URL
//             if (receiverChat.user_image_url.startsWith(`http://localhost:5000/`)) {
//                 return;
//             } else {
//                 // Prepend the base URL
//                 receiverChat.user_image_url = `http://localhost:5000/`+receiverChat.user_image_url;
//             }
//         }
//     }, [receiverChat]);


//  useEffect(() => {

//     if (!token) {
//         navigate('/homepage');
//         return;
//     }

//     if ( !receiverId || !currentUserId) return;

//     const fetchMessages = async () => {
//         try {
//             const res = await fetch(
//                 `${process.env.REACT_APP_HOST_URL}/messages/${currentUserId}/${receiverId}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );

//             const data = await res.json();
//             setChatHistory(data);

//         } catch (error) {
//             console.error("Failed to fetch messages:", error);
//         }
//     };
//     fetchMessages();
//     const fetchGroupMessages = async () => {
//         try {
//             const res = await fetch(
//                 `${process.env.REACT_APP_HOST_URL}/group-messages/${currentUserId}/${groupId}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );

//             const data = await res.json();
//             setChatHistory(data);

//         } catch (error) {
//             console.error("Failed to fetch messages:", error);
//         }
//     };
//         fetchGroupMessages();   

//     // Create socket connection
//     socketRef.current = io("http://localhost:5000", {
//         auth: {
//             token: token
//         }
//     });

//     socketRef.current.on("connect", () => {

//         console.log(
//             "🔥 Socket connected:",
//             socketRef.current.id
//         );

//         console.log(
//             "Joining room with author:",
//             receiverId
//         );

//         socketRef.current.emit("join_room", {
//             senderId: currentUserId,
//             receiverId: receiverId
//         });

//     });

//     socketRef.current.on("connect_error", (error) => {
//         console.error("❌ Socket connection error:", error);
//     });

//     socketRef.current.on("receive_message", (newMessage) => {

//         console.log("📩 New message:", newMessage);

//         setChatHistory((prev) => [
//             ...prev,
//             newMessage
//         ]);

//     });

//     return () => {

//         if (socketRef.current) {
//             socketRef.current.disconnect();
//             socketRef.current = null;
//         }

//     };

// }, [receiverId, token, currentUserId]);


//       // 3. Dispatch payload
//  const handleSendMessage = (e) => {

//     e.preventDefault();

//     if (!message.trim() || !socketRef.current) {
//         return;
//     }

//     const messageData = {
//         sender_id: currentUserId,
//         receiver_id: receiverId,
//         message_text: message.trim()
//     };

//     console.log("📤 Sending:", messageData);

//     socketRef.current.emit(
//         "send_message",
//         messageData
//     );

//     setMessage("");
// };
//     return (
//         <div className={width + " " + height + " flex flex-col"}>
//             <div className="flex items-center justify-between p-0 border-b border-gray-200 bg-white ">
//                 <div className="flex items-center gap-2 p-4 border-l-2 border-gray-200 ">
//                     <div className="flex items-center gap-2">
//                         <button className="">
//                             {receiverChat.user_image_url ? <img src={receiverChat.user_image_url} alt="" className="w-10 h-10 rounded-full" /> : <img src={dummyImage} alt="" className="w-10 h-10 rounded-full" />}
                            
//                         </button>
//                         <h2 className="text-xl font-semibold">{receiverChat.full_name}</h2>
//                     </div>
//                 </div>
//             </div>
//             <div className="h-full min-h-[calc(100%-68px)]">
//                 <div className="pb-20" style={styles.chatWindow}>
//                         {chatHistory.map((msg) => {
//                         const isMe = msg.sender_id === currentUserId;
//                         return (
//                             <div key={msg.id} style={{ ...styles.messageRow, justifyContent: isMe ? "flex-end" : "flex-start" }}>
//                                 {/* if time day pass then in middle print last day, yesterday and 2 days agoo eetc */}
//                             <span style={{ ...styles.bubble, backgroundColor: isMe ? "#007bff" : "#e4e6eb", color: isMe ? "#fff" : "#000" }}>

//                                 {msg.message_text}
//                                 <p className="text-xs text-gray-400 text-right ml-auto mt-1">{dayjs.utc(msg.created_at).add(10, 'hour').format('hh:mm A')}</p>
//                             </span>
//                             </div>
//                         );
//                         })}
//                 <div ref={messagesEndRef} />
//                 </div>
//                 {/* close on out of the box */}
//                 <div className={`absolute top-0 left-0 w-full bg-black/5 backdrop-blur-[2px] h-full z-0 ${showEmoji ? "block" : "hidden"}`} onClick={() => setShowEmoji(false)} />
//                 <form onSubmit={handleSendMessage} style={styles.form}>
//                     <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Write your text message here..."
//                     style={styles.input}
//                     />
//                     <Smile onClick={() => setShowEmoji(!showEmoji)} size={30} className="absolute left-2 top-[10px] cursor-pointer text-gray-400 hover:text-gray-600 transition" />
//                         {/* close on out of the box */}
//                     {showEmoji && (
//                         <EmojiPicker
//                         className="!absolute !bottom-16 !left-10 !w-[300px] !z-10"
//                         onEmojiClick={(emoji) => setMessage(prev => prev + emoji.emoji)}
//                         disableAutoFocus={true}
//                         skinTonePickerLocation="auto"
//                         searchDisabled={true}
//                         previewConfig={{
//                             showPreview: false,
//                         }}
//                         />
//                     )}
//                     <div>
//                         <button type="submit" style={styles.btn}>Send</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// const styles = {
//   chatWindow: { backgroundColor: "rgb(255 237 213)", height: "100%", overflowY: "auto", padding: "15px", display: "flex", flexDirection: "column", gap: "10px" },
//   messageRow: { display: "flex", width: "100%" },
//   bubble: { padding: "8px 14px", borderRadius: "16px", fontSize: "16px", inlineSize: "anywhere" },
//   form: { display: "flex", position: "relative", width: "100%", marginTop: "-60px",borderTop: "1px solid #ddd" },
//   input: { flexGrow: 1, padding: "12px", paddingLeft: "50px", border: "none", outline: "none" },
//   btn: { padding: "12px 20px", background: "#007bff", color: "#fff", border: "none", cursor: "pointer" }
// };

// export default Sidebar;
import { useEffect, useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import dummyImage from "../../assets/dummy-post-square-1.jpg";
import { useNavigate } from "react-router-dom";

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const Sidebar = ({ width, height, receiverChat }) => {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [showEmoji, setShowEmoji] = useState(false);

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

    const currentUserId = token ? jwtDecode(token).id : null;

    const isGroup = receiverChat?.chat_type === "group";

    const receiverId = receiverChat?.user_id ?? receiverChat?.id;
    const groupId = receiverChat?.group_id ?? receiverChat?.id;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [chatHistory]);

    useEffect(() => {
        if (!token) {
            navigate("/homepage");
            return;
        }

        if (!receiverChat) return;

        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        socketRef.current = io("http://localhost:5000", {
            auth: { token },
        });

        const socket = socketRef.current;

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);

            if (isGroup) {
                socket.emit("join_group_room", {
                    groupId,
                });
            } else {
                socket.emit("join_room", {
                    senderId: currentUserId,
                    receiverId,
                });
            }
        });

        const loadMessages = async () => {
            try {
                const url = isGroup
                    ? `${process.env.REACT_APP_HOST_URL}/group-messages/${groupId}`
                    : `${process.env.REACT_APP_HOST_URL}/messages/${currentUserId}/${receiverId}`;

                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                console.log("Messages API response:", data);

                const messages = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : Array.isArray(data.messages)
                            ? data.messages
                            : [];

                setChatHistory(messages);
            } catch (err) {
                console.error(err);
            }
        };

        loadMessages();

        socket.on("receive_message", (msg) => {
            if (!isGroup) {
                setChatHistory((prev) => [...prev, msg]);
            }
        });

        socket.on("receive_group_message", (msg) => {
            if (isGroup && Number(msg.group_id) === Number(groupId)) {
                setChatHistory((prev) => [...prev, msg]);
            }
        });

        return () => socket.disconnect();
    }, [receiverChat]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        if (isGroup) {
            socketRef.current.emit("send_group_message", {
                groupId,
                messageText: message.trim(),
            });
        } else {
            socketRef.current.emit("send_message", {
                sender_id: currentUserId,
                receiver_id: receiverId,
                message_text: message.trim(),
            });
        }

        setMessage("");
    };

    return (
        <div className={`${width} ${height} flex flex-col`}>
            <div className="flex items-center justify-between border-b bg-white">
                <div className="flex items-center gap-2 p-4">
                    <img
                        src={
                            isGroup
                                ? receiverChat.group_avatar || dummyImage
                                : receiverChat.user_image_url || dummyImage
                        }
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>
                        <h2 className="text-xl font-semibold">
                            {isGroup
                                ? receiverChat.group_name
                                : receiverChat.full_name}
                        </h2>

                        {isGroup && (
                            <p className="text-sm text-gray-500">
                                Group Chat
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-full min-h-[calc(100%-68px)]">
                <div
                    style={{
                        background: "rgb(255 237 213)",
                        height: "100%",
                        overflowY: "auto",
                        padding: "15px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        paddingBottom: "80px",
                    }}
                >
                    {chatHistory.map((msg) => {
                        const sender =
                            msg.sender_id ??
                            msg.user_id;

                        const isMe =
                            Number(sender) === Number(currentUserId);

                        return (
                            <   div
                                key={msg.id}
                                style={{
                                    display: "flex",
                                    justifyContent: isMe
                                        ? "flex-end"
                                        : "flex-start",
                                }}
                            >
                                <div
                                    style={{
                                        background: isMe
                                            ? "#007bff"
                                            : "#e4e6eb",
                                        color: isMe
                                            ? "#fff"
                                            : "#000",
                                        padding: "10px 14px",
                                        borderRadius: "16px",
                                        maxWidth: "70%",
                                    }}
                                >
                                    {isGroup &&
                                        !isMe && (
                                            <p className="text-xs font-semibold mb-1">
                                                {msg.user_name ||
                                                    msg.full_name ||
                                                    "User"}
                                            </p>
                                        )}

                                    <p>
                                        {
                                            msg.message_text
                                        }
                                    </p>

                                    <p className="text-xs text-right opacity-70 mt-1">
                                        {dayjs(msg.created_at).format(
                                            "hh:mm A"
                                        )}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    <div ref={messagesEndRef} />
                </div>

                <div
                    className={`absolute inset-0 bg-black/5 ${
                        showEmoji
                            ? "block"
                            : "hidden"
                    }`}
                    onClick={() =>
                        setShowEmoji(false)
                    }
                />

                <form
                    onSubmit={handleSendMessage}
                    className="relative flex border-t bg-white"
                    style={{ marginTop: "-60px" }}
                >
                    <Smile
                        size={28}
                        className="absolute left-3 top-3 cursor-pointer text-gray-400"
                        onClick={() =>
                            setShowEmoji(!showEmoji)
                        }
                    />

                    <input
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        placeholder={
                            isGroup
                                ? "Message the group..."
                                : "Write a message..."
                        }
                        className="flex-1 pl-12 pr-4 py-3 outline-none"
                    />

                    {showEmoji && (
                        <EmojiPicker
                            className="!absolute !bottom-16 !left-10 !z-10"
                            onEmojiClick={(
                                emoji
                            ) =>
                                setMessage(
                                    (prev) =>
                                        prev +
                                        emoji.emoji
                                )
                            }
                            disableAutoFocus
                            searchDisabled
                            previewConfig={{
                                showPreview: false,
                            }}
                        />
                    )}

                    <button
                        type="submit"
                        className="px-5 bg-blue-500 text-white"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Sidebar;
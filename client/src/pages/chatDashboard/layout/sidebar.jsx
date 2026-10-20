import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    MessageSquareIcon,
    UsersIcon,
    LucideMenu,
    SearchIcon,
    PenLine,
} from "lucide-react";
import dummyImg from "../../assets/dummy-post-square-1.jpg";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const Sidebar = ({ width, height, onSelectUser }) => {
    const navigate = useNavigate();

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    const [groupChatUsers, setGroupChatUsers] = useState([]);
    const [activeTabChat, setActiveTabChat] = useState(false);
    const [activeTabGroup, setActiveTabGroup] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showNewChat, setShowNewChat] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [receiverId, setReceiverId] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [filteredChatUsers, setFilteredChatUsers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const socketRef = useRef(null);
    const onSelectUserRef = useRef(onSelectUser);

    useEffect(() => {
        onSelectUserRef.current = onSelectUser;
    }, [onSelectUser]);

    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            navigate("/homepage");
            return undefined;
        }

        try {
            setCurrentUserId(jwtDecode(token).id);
        } catch (error) {
            console.error("Invalid authentication token:", error);
            navigate("/homepage");
            return undefined;
        }

        let isMounted = true;

        const getAllUsers = async () => {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_HOST_URL}/users`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                const data = await res.json();
                if (res.ok && isMounted) {
                    setAllUsers(data.data ?? []);
                }
            } catch (error) {
                console.error("Error fetching all users:", error);
            }
        };

        getAllUsers();

        const socket = io("http://localhost:5000", {
            auth: { token },
        });
        socketRef.current = socket;

        const handleChatUsers = (users, groups) => {
            if (!isMounted) return;
            setChatUsers(users?.data ?? []);
            setGroupChatUsers(groups ?? []);
            setActiveTabChat(true);
        };

        const handleGroupCreated = (group) => {
            if (!isMounted || !group) return;

            const normalizedGroup = {
                ...group,
                group_id: group.group_id ?? group.id,
            };

            setGroupChatUsers((previousGroups) => [
                normalizedGroup,
                ...previousGroups.filter(
                    (item) =>
                        Number(item.group_id ?? item.id) !==
                        Number(normalizedGroup.group_id)
                ),
            ]);

            setSelectedGroup(normalizedGroup);
            setGroupName("");
            setSelectedUsers([]);
            setShowCreate(false);
            setShowNewChat(false);
            setActiveTabGroup(true);
            setActiveTabChat(false);
            setShowMenu(false);

            // Notify the parent component to open the group conversation.
            onSelectUserRef.current?.({
                ...normalizedGroup,
                chat_type: "group",
            });

            // Join the Socket.IO room for this group.
            socket.emit("join_group_room", {
                groupId: Number(normalizedGroup.group_id),
            });

            // Refresh the sidebar list from the server.
            socket.emit("get_chat_users");
        };

        const handleGroupError = (error) => {
            console.error(
                "Group chat error:",
                error?.message ?? "Could not create or join group"
            );
        };

        socket.on("connect", () => {
            console.log("Connected to chat server");
            socket.emit("get_chat_users");
        });
        socket.on("chat_users", handleChatUsers);
        socket.on("chat_group_created", handleGroupCreated);
        socket.on("chat_group_error", handleGroupError);

        return () => {
            isMounted = false;
            socket.off("chat_users", handleChatUsers);
            socket.off("chat_group_created", handleGroupCreated);
            socket.off("chat_group_error", handleGroupError);
            socket.disconnect();
            if (socketRef.current === socket) {
                socketRef.current = null;
            }
        };
    }, [navigate]);

    const getTokenFromCookie = () =>
        document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

    const handleChatClick = async (chat) => {
        try {
            const token = getTokenFromCookie();
            const res = await fetch(
                `${process.env.REACT_APP_HOST_URL}/messages/read-all`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                console.error("Could not mark messages as read");
            }
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }

        setReceiverId(chat.user_id);
        setSelectedGroup(null);
        onSelectUserRef.current?.({ ...chat, chat_type: "private" });
    };

    const handleGroupClick = (group) => {
        const groupId = group.group_id ?? group.id;
        if (!groupId || !socketRef.current) return;

        const normalizedGroup = { ...group, group_id: groupId };
        setSelectedGroup(normalizedGroup);
        setReceiverId(null);
        setActiveTabGroup(true);
        setActiveTabChat(false);
        onSelectUserRef.current?.({ ...normalizedGroup, chat_type: "group" });

        socketRef.current.emit("join_group_room", {
            groupId: Number(groupId),
        });
    };

    const handleStartNewChat = () => {
        setShowMenu(false);
        setActiveTabChat(false);
        setActiveTabGroup(false);
        setShowCreate(false);
        setShowNewChat(true);
    };

    const handleCreateGroup = () => {
        setShowMenu(false);
        setActiveTabChat(false);
        setActiveTabGroup(false);
        setShowNewChat(false);
        setShowCreate(true);
        setFilteredChatUsers([]);
    };

    const handleUserCreateGroup = (userId) => {
        setSelectedUsers((previous) =>
            previous.includes(userId)
                ? previous.filter((id) => id !== userId)
                : [...previous, userId]
        );
    };

    const handleCreateChatGroup = () => {
        const name = groupName.trim();
        const socket = socketRef.current;

        if (!name || selectedUsers.length === 0 || !socket?.connected) {
            if (!socket?.connected) {
                console.error("Chat server is not connected");
            }
            return;
        }

        socket.emit("create_chat_group", {
            group_name: name,
            memberIds: selectedUsers,
        });
    };

    const handleUserNewChat = (chat) => {
        onSelectUserRef.current?.({ ...chat, chat_type: "private" });
        setShowNewChat(false);
        setActiveTabChat(true);
        setActiveTabGroup(false);
        setSelectedGroup(null);
        setChatUsers((previous) => [
            {
                user_id: chat.id,
                user_image_url: chat.user_image_url,
                full_name: chat.full_name,
            },
            ...previous.filter((item) => Number(item.user_id) !== Number(chat.id)),
        ]);
        setReceiverId(chat.id);
    };

    const handleUserSearch = (search) => {
        if (search) {
            const filteredUsers = allUsers.filter((user) =>
                (user.full_name ?? "").toLowerCase().includes(search.toLowerCase())
            );
            setFilteredChatUsers(filteredUsers);
        } else {
            setFilteredChatUsers([]);
        }
    };

    const handleImage = async (event) => {
        event.preventDefault();
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", currentUserId);

        try {
            setLoading(true);
            const result = await fetch(
                `${process.env.REACT_APP_HOST_URL}/profile/image`,
                { method: "POST", body: formData }
            );
            const data = await result.json();

            if (result.ok) {
                setImagePreview(data.data.file_url);
            } else {
                console.error(data.message ?? "Image upload failed");
            }
        } catch (error) {
            console.error("Error uploading group image:", error);
        } finally {
            setLoading(false);
        }
    };

    const usersToDisplay = filteredChatUsers.length
        ? filteredChatUsers
        : allUsers;

    return (
        <div className={`${width} ${height}`}>
            <div className="relative flex  items-center justify-start p-0 border-b border-gray-200 bg-white">
                <button
                    onClick={() => {
                        setActiveTabChat(true);
                        setActiveTabGroup(false);
                        setShowCreate(false);
                        setShowNewChat(false);
                    }}
                    className={`flex items-center gap-2 px-6 py-6 border-l-2 justify-center ${
                        activeTabChat
                            ? "border-orange-500 bg-orange-200"
                            : "border-gray-200 hover:bg-orange-200"
                    }`}
                    aria-label="Private chats"
                >
                    <MessageSquareIcon className="w-5 h-5" />
                </button>

                <button
                    onClick={() => {
                        setActiveTabGroup(true);
                        setActiveTabChat(false);
                        setShowCreate(false);
                        setShowNewChat(false);
                    }}
                    className={`flex items-center gap-2 px-6 py-6 border-l-2 justify-center ${
                        activeTabGroup
                            ? "border-orange-500 bg-orange-200"
                            : "border-gray-200 hover:bg-orange-200"
                    }`}
                    aria-label="Group chats"
                >
                    <UsersIcon className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setShowMenu((previous) => !previous)}
                    className="flex items-center ml-auto gap-2 px-6 py-6 border-l-2 border-r-2 border-gray-200 justify-center"
                    aria-label="Chat menu"
                >
                    <LucideMenu className="w-5 h-5" />
                </button>

                <div
                    className={`${showMenu ? "block" : "hidden"} absolute border border-gray-200 rounded-md top-16 right-2 bg-white shadow-lg w-[250px] z-50`}
                >
                    <ul className="flex flex-col gap-2">
                        <li
                            onClick={handleStartNewChat}
                            className="cursor-pointer hover:bg-orange-100 p-3"
                        >
                            Start New Chat
                        </li>
                        <li
                            onClick={handleCreateGroup}
                            className="cursor-pointer hover:bg-orange-100 p-3"
                        >
                            Create Group
                        </li>
                    </ul>
                </div>
            </div>

            {activeTabChat && !showCreate && !showNewChat && (
                <div className="grid h-full w-full grid-rows-[50px_1fr] overflow-y-scroll no-scrollbar p-4 border-b border-gray-200 bg-white">
                    <div className="w-full flex flex-col items-center gap-2">
                        {chatUsers.length === 0 ? (
                            <p>No chat users</p>
                        ) : (
                            chatUsers.map((chat) => (
                                <div
                                    key={chat.user_id}
                                    className={`relative w-full p-4 flex justify-start hover:bg-orange-100 cursor-pointer rounded-lg items-center gap-2 ${
                                        Number(chat.user_id) === Number(receiverId)
                                            ? "border-b-2 border-orange-500 bg-orange-200"
                                            : ""
                                    }`}
                                    onClick={() => handleChatClick(chat)}
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={chat.user_image_url || dummyImg}
                                            alt={chat.full_name || "User"}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex flex-col">
                                            <h2 className="text-xl font-semibold">
                                                {chat.full_name}
                                            </h2>
                                            <p className="text-xs text-gray-500">
                                                {chat.last_message}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {chat.last_message_time
                                                    ? dayjs
                                                          .utc(chat.last_message_time)
                                                          .tz("Asia/Karachi")
                                                          .fromNow()
                                                    : ""}
                                            </p>
                                        </div>
                                        {chat.unread_message_count > 0 && (
                                            <p className="absolute right-4 top-8 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm">
                                                {chat.unread_message_count}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTabGroup && !showCreate && !showNewChat && (
                <div className="grid h-full w-full grid-rows-[50px_1fr] overflow-y-scroll no-scrollbar p-4 border-b border-gray-200 bg-white">
                    <div className="w-full flex flex-col items-center gap-2">
                        {groupChatUsers.length === 0 ? (
                            <p>No group chats</p>
                        ) : (
                            groupChatUsers.map((group) => {
                                const groupId = group.group_id ?? group.id;
                                return (
                                    <div
                                        key={groupId}
                                        className={`relative w-full p-4 flex justify-start hover:bg-orange-100 cursor-pointer rounded-lg items-center gap-2 ${
                                            Number(selectedGroup?.group_id) === Number(groupId)
                                                ? "border-b-2 border-orange-500 bg-orange-200"
                                                : ""
                                        }`}
                                        onClick={() => handleGroupClick(group)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={group.group_avatar || group.group_image_url || dummyImg}
                                                alt={group.group_name || "Group"}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex flex-col">
                                                <h2 className="text-xl font-semibold">
                                                    {group.group_name}
                                                </h2>
                                                <p className="text-xs text-gray-500">
                                                    {group.last_message || "Start a conversation"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {group.last_message_time
                                                        ? dayjs
                                                              .utc(group.last_message_time)
                                                              .tz("Asia/Karachi")
                                                              .fromNow()
                                                        : ""}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {showCreate && (
                <div className="grid h-full w-full grid-rows-[50px_1fr] overflow-y-scroll no-scrollbar p-4 border-b border-gray-200 bg-white">
                    <div className="w-full h-full flex flex-col items-center gap-2">
                        <div className="relative w-full">
                            <div className="flex flex-col items-center gap-4 bg-white p-2">
                                <div className="relative">
                                    <img
                                        src={imagePreview || dummyImg}
                                        alt="Group"
                                        width={150}
                                        height={150}
                                        className="rounded-full object-cover"
                                    />
                                    {loading ? (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                            <span className="spinner" />
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById("imageUpload")?.click()}
                                            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition"
                                            aria-label="Upload group image"
                                        >
                                            <PenLine size={24} color="white" />
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    onChange={handleImage}
                                    className="hidden"
                                    id="imageUpload"
                                    accept="image/*"
                                />
                            </div>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(event) => setGroupName(event.target.value)}
                                    className="w-full py-2 pl-10 pr-4 border-2 border-gray-200 rounded-lg"
                                    placeholder="Group Name"
                                />
                            </div>
                            <SearchIcon className="absolute left-3 top-3 text-gray-500" />
                            <input
                                onChange={(event) => handleUserSearch(event.target.value)}
                                type="text"
                                className="w-full py-2 pl-10 mt-5 pr-4 border-2 border-gray-200 rounded-lg"
                                placeholder="Search users"
                            />
                        </div>

                        <div className="relative w-full">
                            <ul className="flex flex-col">
                                {usersToDisplay.map((user) => (
                                    <li
                                        key={user.id}
                                        onClick={() => handleUserCreateGroup(user.id)}
                                        className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-100 ${
                                            selectedUsers.includes(user.id)
                                                ? "bg-orange-200 border-b-2 border-orange-500"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            readOnly
                                            className="w-4 h-4"
                                        />
                                        <img
                                            src={user.user_image_url || dummyImg}
                                            alt={user.full_name || "User"}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex flex-col">
                                            <h2 className="text-xl font-semibold">
                                                {user.full_name}
                                            </h2>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            type="button"
                            className="mt-auto bg-orange-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                            onClick={handleCreateChatGroup}
                            disabled={!groupName.trim() || selectedUsers.length === 0}
                        >
                            Create Group
                        </button>
                    </div>
                </div>
            )}

            {showNewChat && (
                <div className="grid h-full w-full grid-rows-[50px_1fr] overflow-y-scroll no-scrollbar p-4 border-b border-gray-200 bg-white">
                    <div className="w-full h-full flex flex-col items-center gap-2">
                        <div className="relative w-full">
                            <ul className="flex flex-col">
                                {allUsers.map((user) => (
                                    <li
                                        key={user.id}
                                        onClick={() => handleUserNewChat(user)}
                                        className="flex items-center gap-2 p-3 cursor-pointer hover:bg-orange-100"
                                    >
                                        <img
                                            src={user.user_image_url || dummyImg}
                                            alt={user.full_name || "User"}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex flex-col">
                                            <h2 className="text-xl font-semibold">
                                                {user.full_name}
                                            </h2>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;

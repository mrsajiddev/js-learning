import { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";

import Header from "./layout/header";
import Footer from "./layout/footer";
import Sidebar from "./layout/sidebar";
import ChatArea from "./layout/chatArea";

export default function ChatInbox() {
    const [loader, setLoader] = useState(false);
    const [selectedChat, setSelectedChat] = useState({});
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            setSelectedChat({
                user_image_url: location.state.user_image_url,
                user_id: location.state.user_id,
                full_name: location.state.user_name,
            });
        }
    }, [location.state]);

    useEffect(() => {
        setLoader(true);

        // API call goes here

        setLoader(false);
    }, []);

    return (
        <main className="w-full h-screen flex flex-col overflow-hidden">
            {/* Header stays at the top */}
            <div className="shrink-0">
                <Header />
            </div>

            {/* Chat layout takes only the remaining height */}
            <div className="layout flex-1 min-h-0 overflow-hidden">
                <div className="flex h-full min-h-0 w-full items-stretch">
                    {/* Chat users and groups sidebar */}
                    <div className="w-[25%] min-w-0 h-full min-h-0 overflow-hidden">
                        <Sidebar
                            width="w-full"
                            height="h-full"
                            onSelectUser={(chat) => setSelectedChat(chat)}
                        />
                    </div>

                    {/* Main chat area */}
                    <div className="w-[75%] min-w-0 h-full min-h-0 overflow-hidden">
                        <ChatArea
                            width="w-full"
                            height="h-full"
                            receiverChat={selectedChat}
                        />
                    </div>
                </div>
            </div>

            {/* Footer stays at the bottom */}
            <div className="shrink-0">
                <Footer />
            </div>
        </main>
    );
}
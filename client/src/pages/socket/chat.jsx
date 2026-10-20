import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";

export default function Chat({ authorId }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Retrieve token and user details stored during your authentication processes
   const token = document.cookie
                .split('; ')
                .find(row => row.startsWith(`token=`))
                ?.split('=')[1];
  const currentUserId = token ? jwtDecode(token).id : null;
  
 useEffect(() => {

    if (!token || !authorId || !currentUserId) return;

    const fetchMessages = async () => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_HOST_URL}/messages/${currentUserId}/${authorId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            setChatHistory(data);

        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    fetchMessages();

    // Create socket connection
    socketRef.current = io("http://localhost:5000", {
        auth: {
            token: token
        }
    });

    socketRef.current.on("connect", () => {

        console.log(
            "🔥 Socket connected:",
            socketRef.current.id
        );

        console.log(
            "Joining room with author:",
            authorId
        );

        socketRef.current.emit("join_room", {
            senderId: currentUserId,
            receiverId: authorId
        });

    });

    socketRef.current.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error);
    });

    socketRef.current.on("receive_message", (newMessage) => {

        console.log("📩 New message:", newMessage);

        setChatHistory((prev) => [
            ...prev,
            newMessage
        ]);

    });

    return () => {

        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }

    };

}, [authorId, token, currentUserId]);

  // 2. Keep display fixed to current message logs automatically
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // 3. Dispatch payload
 const handleSendMessage = (e) => {

    e.preventDefault();

    if (!message.trim() || !socketRef.current) {
        return;
    }

    const messageData = {
        sender_id: currentUserId,
        receiver_id: authorId,
        message_text: message.trim()
    };

    console.log("📤 Sending:", messageData);

    socketRef.current.emit(
        "send_message",
        messageData
    );

    setMessage("");
};
    console.log("chatHistory", chatHistory);
  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Chat System</h3>
      <div style={styles.chatWindow}>
        {chatHistory.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} style={{ ...styles.messageRow, justifyContent: isMe ? "flex-end" : "flex-start" }}>
              <span style={{ ...styles.bubble, backgroundColor: isMe ? "#007bff" : "#e4e6eb", color: isMe ? "#fff" : "#000" }}>
                {msg.message_text}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} style={styles.form}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your text message here..."
          style={styles.input}
        />
        <button type="submit" style={styles.btn}>Send</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "100%", margin: "10px", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", fontFamily: "sans-serif" },
  header: { padding: "15px", margin: 0, background: "#f8f9fa", borderBottom: "1px solid #ddd", textAlign: "center" },
  chatWindow: { backgroundColor: "rgb(255 237 213)", height: "350px", overflowY: "auto", padding: "15px", display: "flex", flexDirection: "column", gap: "10px" },
  messageRow: { display: "flex", width: "100%" },
  bubble: { padding: "8px 14px", borderRadius: "16px", fontSize: "14px", inlineSize: "anywhere" },
  form: { display: "flex", borderTop: "1px solid #ddd" },
  input: { flexGrow: 1, padding: "12px", border: "none", outline: "none" },
  btn: { padding: "12px 20px", background: "#007bff", color: "#fff", border: "none", cursor: "pointer" }
};

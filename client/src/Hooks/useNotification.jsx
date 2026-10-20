// import {
//     useEffect,
//     useState
// } from "react";

// import { io } from "socket.io-client";


// const SOCKET_URL =
//     "http://localhost:5000";


// const API_URL =
//     process.env.REACT_APP_HOST_URL;


// export default function useNotifications() {


//     const [
//         notifications,
//         setNotifications
//     ] = useState([]);


//     const [
//         loading,
//         setLoading
//     ] = useState(true);


//     useEffect(() => {

//         console.log('notification started...');
//         const token = document.cookie
//             .split('; ')
//             .find(row => row.startsWith(`token=`))
//             ?.split('=')[1];


//         if (!token) {

//             setLoading(false);

//             return;

//         }


//         // =====================================
//         // 1. GET OLD NOTIFICATIONS
//         // =====================================

//         const loadNotifications =
//             async () => {
//         console.log('notification loading...');

//                 try {

//                     const response =
//                         await fetch(
//                             `${API_URL}/notifications`,
//                             {
//                                 headers: {
//                                     Authorization:
//                                         `Bearer ${token}`
//                                 }
//                             }
//                         );


//                     const result =
//                         await response.json();


//                     if (
//                         !response.ok
//                     ) {

//                         throw new Error(
//                             result.message ||
//                             "Failed to load notifications"
//                         );

//                     }


//                     setNotifications(
//                         result.data
//                     );


//                 } catch (error) {

//                     console.error(
//                         "❌ Notification fetch:",
//                         error
//                     );

//                 } finally {

//                     setLoading(false);

//                 }

//             };


//         loadNotifications();


//         // =====================================
//         // 2. CONNECT SOCKET
//         // =====================================

//         const socket =
//             io(
//                 SOCKET_URL,
//                 {
//                     auth: {
//                         token
//                     }
//                 }
//             );


//         // =====================================
//         // SOCKET CONNECTED
//         // =====================================

//         socket.on(
//             "connect",
//             () => {

//                 console.log(
//                     "🔔 Notification socket connected:",
//                     socket.id
//                 );

//             }

            
//         );


//         // =====================================
//         // NEW NOTIFICATION
//         // =====================================

//         socket.on("new_notification", (notification) => {
//             setNotifications((previous) => [
//                 notification,
//                 ...previous
//             ]);
//         });


//         // =====================================
//         // SOCKET ERROR
//         // =====================================

//         socket.on(
//             "connect_error",
//             (error) => {

//                 console.error(
//                     "❌ Notification socket error:",
//                     error.message
//                 );

//             }
//         );


//         // =====================================
//         // CLEANUP
//         // =====================================

//         return () => {

//             socket.disconnect();

//         };


//     }, []);


//     return {
//         notifications,
//         loading,
//         refreshNotifications: loadNotifications
//     };

// }
import {
    useEffect,
    useState,
    useCallback
} from "react";

import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";
const API_URL = process.env.REACT_APP_HOST_URL;

export default function useNotifications() {

    const [
        notifications,
        setNotifications
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);


    // =====================================
    // GET NOTIFICATIONS
    // =====================================

    const loadNotifications = useCallback(async () => {

        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            setLoading(false);
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/notifications`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to load notifications"
                );
            }

            setNotifications(result.data);

        } catch (error) {

            console.error(
                "❌ Notification fetch:",
                error
            );

        } finally {

            setLoading(false);

        }

    }, []);


    // =====================================
    // INITIAL LOAD + SOCKET
    // =====================================

    useEffect(() => {

        console.log("notification started...");

        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            setLoading(false);
            return;
        }


        // Load old notifications
        loadNotifications();


        // Connect socket
        const socket = io(
            SOCKET_URL,
            {
                auth: {
                    token
                }
            }
        );


        // Socket connected
        socket.on("connect", () => {

            console.log(
                "🔔 Notification socket connected:",
                socket.id
            );

        });


        // New notification
        socket.on(
            "new_notification",
            (notification) => {

                setNotifications((previous) => [
                    notification,
                    ...previous
                ]);

            }
        );


        // Socket error
        socket.on(
            "connect_error",
            (error) => {

                console.error(
                    "❌ Notification socket error:",
                    error.message
                );

            }
        );


        // Cleanup
        return () => {

            socket.disconnect();

        };

    }, [loadNotifications]);


    return {
        notifications,
        loading,
        refreshNotifications: loadNotifications
    };
}
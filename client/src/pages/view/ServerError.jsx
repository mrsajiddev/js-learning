import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServerImage from "../assets/ServerError.png";
import { ArrowRight, RotateCcw } from "lucide-react";



export default function ServerError() {
    const navigate = useNavigate();
    return (
        // Server Crashed Please try later and wait

        <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-[60%] h-[60vh] bg-orange-100 flex flex-row items-center justify-center p-16 rounded-lg shadow-md text-center">
                <div className="w-full mx-auto flex flex-col gap-4 items-start justify-start">
                    <h1 className="text-7xl font-bold">OOPS...</h1> 
                    <h2 className="text-2xl font-semibold">An Unexpedted error has occurred</h2>
                    <p className="text-lg">We are experiencing some technical difficulties. Please try again later.</p>
                    <p className="text-lg">Thank you for your patience</p>
                    <p className="text-lg">Return to <a href="http://localhost:3000/homepage" className="text-orange-500 hover:text-orange-600">Homepage</a></p>
                </div>
                <div className="w-[50%] mx-auto flex items-center justify-center">
                    <img src={ServerImage} alt="Server Down" className="w-[85%] mx-auto h-auto object-cover" />
                </div>
            </div>
        </div>

    );
}   
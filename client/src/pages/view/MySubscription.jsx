import React from 'react'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { Sidebar } from "./layout/Sidebar";
import { Users } from "lucide-react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'
import { jwtDecode } from "jwt-decode";

const MyAccount = () => {
    const [purchasedPlan, setPurchasedPlan] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //get token value
        const token = document.cookie
        .split('; ')
        .find(row => row.startsWith(`token=`))
        ?.split('=')[1];
        if (token) {
            const decoded = jwtDecode(token);
            currentMembership(decoded.id);
        } 
    }, []);
    
    const currentMembership = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/purchased_plan/${id}`,{
                method: "GET",
            });
            const data = await response.json();
            if(response.ok){
                setPurchasedPlan(data.data);
            }
        } catch (error) {
            console.error("Error fetching current membership:", error);
            // Handle error (e.g., show error message)
        } finally {
            setLoading(false);
        }
    }   
    return (
        <main className="w-full h-auto bg-gray-100">
            <Header />
            <div className="w-full flex h-screen">
                <div className='flex w-[15%] h-screen bg-gray-100'>
                    <Sidebar />
                </div>
                <div className="main-container w-[85%] ml-auto mr-auto md:pt-10 pt-5 md:pb-10 pb-6 mb-6 md:mb-10 sm:mb-6 flex flex-col items-start justify-start page">
                {loading ? (
                    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '25vh' }}>
                        <CircularProgress aria-label="Loading…" />
                    </Box>
                ) : (
                    <div className="w-full h-full">
                        <div className="w-[90%] mx-auto h-40 flex flex-col items-center justify-center gap-5 bg-orange-500 rounded-xl mb-5 p-5 border border-gray-200">
                            <h2 className="text-2xl font-bold text-white">Your Subscriptions</h2>
                            <p className="text-white">View your subscription information</p>
                        </div>
                        <div className='w-[90%] mx-auto h-64 grid grid-cols-1 md:grid-cols-2 gap-5'>
                            
                            <div className="w-full h-full flex flex-col items-start justify-start gap-5 bg-white rounded-xl p-5 border border-gray-200">
                                {/* Subscription Payments */}
                                <h2 className="text-2xl font-bold text-orange-500">Subscription Payments</h2>
                                {/* Payment Information */}
                                
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
            <Footer />
        </main>
    )
}


export default MyAccount
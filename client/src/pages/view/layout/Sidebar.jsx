import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { User, ScrollText, List, CreditCard, Users, Tags, ChartNoAxesGantt, LogOut } from "lucide-react";

export const Sidebar = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const location = useLocation();
    useEffect(() => {
        const token = cookies.token;
        if (!token) {
            navigate('/login');
        }
    }, [cookies.token]);
    return (
        <>
            {/* should be sidebar account related tabs menu */}
            <div className="flex flex-col gap-5 border w-[250px] h-auto bg-white">
                <ul className='flex flex-col gap-1 pt-5 pl-5'>
                    <Link className={`cursor-pointer flex items-center gap-2 hover:bg-orange-100 hover:text-orange-400 rounded-l-lg py-2 px-3 ${location.pathname === '/my-account' ? 'bg-orange-100 text-orange-400' : ''}`} to="/my-account">
                        <User className="cursor-pointer" />
                        <li>My Account</li>
                    </Link>
                    <Link className={`cursor-pointer flex items-center gap-2 hover:bg-orange-100 hover:text-orange-400 rounded-l-lg py-2 px-3 ${location.pathname === '/my-posts' ? 'bg-orange-100 text-orange-400' : ''}`} to="/my-posts">
                        <List className="cursor-pointer" />
                        <li>My Posts</li>
                    </Link>
                    <Link className={`cursor-pointer flex items-center gap-2 hover:bg-orange-100 hover:text-orange-400 rounded-l-lg py-2 px-3 ${location.pathname === '/my-orders' ? 'bg-orange-100 text-orange-400' : ''}`} to="/my-orders">
                        <ScrollText className="cursor-pointer" />
                        <li>My Orders</li>
                    </Link>
                    <Link className={`cursor-pointer flex items-center gap-2 hover:bg-orange-100 hover:text-orange-400 rounded-l-lg py-2 px-3 ${location.pathname === '/my-subscriptions' ? 'bg-orange-100 text-orange-400' : ''}`} to="/my-subscriptions">
                        <CreditCard className="cursor-pointer" />
                        <li>My Subscriptions</li>
                    </Link>
                    <Link className={`cursor-pointer flex items-center gap-2 hover:bg-orange-100 hover:text-orange-400 rounded-l-lg py-2 px-3 ${location.pathname === '/my-membership' ? 'bg-orange-100 text-orange-400' : ''}`} to="/my-membership">
                        <Users className="cursor-pointer" />
                        <li>Membership</li>
                    </Link>
                    <Link className={`cursor-pointer flex items-center gap-2 hover:bg-orange-100 hover:text-orange-400 rounded-l-lg py-2 px-3 ${location.pathname === '/subscription-payment' ? 'bg-orange-100 text-orange-400' : ''}`} to="/subscription-payment">
                        <CreditCard className="cursor-pointer" />
                        <li>Subscription Payment</li>
                    </Link>
                </ul> 
                {/* logout button when click it remove token and redirect to login page */}
                <div className="w-full px-5 flex items-center justify-center">
                    <button
                        className="w-full flex items-center justify-center gap-2 cursor-pointer bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-full"
                        onClick={() => {
                            removeCookie('token', { path: '/' });
                            navigate('/login');
                        }}
                    >
                        Logout
                        <LogOut size={18} className="cursor-pointer" />
                    </button>
                </div>
            </div>
        </>
    )
};


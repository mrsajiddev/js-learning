import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { MenuIcon } from 'lucide-react';
import { SidebarMenu } from "./SidebarMenu";
import Logo from "../../assets/logo.png";
import Notification from "../../components/Notifications";

export const Header = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [token, setToken] = useState(null);

    const handleMenuClick = (value) => {
        setIsSidebarOpen(value);
    };
    const handleToken = () => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith(`token=`))
            ?.split('=')[1];
        setToken(token);
    }
    useEffect(() => {
        handleToken();
    }, []);
    return (
        <>
            <div className="w-full flex h-auto border-b border-gray-200  bg-white">
                <div className="w-full flex flex-col">
                    {isSidebarOpen && <SidebarMenu setIsSidebar={handleMenuClick} />}
                    <header className="w-full flex items-center justify-center px-4 py-5 md:px-10 md:py-5 ">
                        <div className="md:w-[80%] w-full flex items-center justify-between">
                            <div className="flex w-[100%]  items-center justify-between gap-20">
                                <img src={`${process.env.PUBLIC_URL}` + Logo} alt="Logo" className="w-[40%] md:w-[20%]  h-auto" />
                                <div className="lg:hidden">
                                    <button className="text-gray-700 hover:text-orange-400 border" onClick={() => handleMenuClick(true)}>
                                        <MenuIcon size={24} />
                                    </button>
                                </div>
                                <ul className="flex w-[60%] hidden lg:flex justify-center items-center gap-10">
                                    <Link to="/homepage" className="cursor-pointer hover:text-orange-400">Home</Link>
                                    <Link to="/posts" className="cursor-pointer hover:text-orange-400">Blogs</Link>
                                    <Link to="/memberships" className="cursor-pointer hover:text-orange-400">Membership</Link>
                                    <Link to="/services" className="cursor-pointer hover:text-orange-400">Services</Link>
                                    <Link to="/contact" className="cursor-pointer hover:text-orange-400">Contact</Link>
                                </ul>
                                <div className="flex items-center justify-center w-[20%] hidden lg:flex items-end justify-end gap-5">
                                <Notification />
                                    {token ? (
                                        <button
                                            className="cursor-pointer bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-full"
                                            onClick={() => navigate('/my-account')}
                                        >
                                            My Account
                                        </button>
                                    ) : (
                                        <button
                                            className="cursor-pointer bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-full"
                                            onClick={() => navigate('/login')}
                                        >
                                            Login/Register
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>
                </div>
            </div>
        </>
    );
}

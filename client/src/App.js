import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from './pages/dashboard/global/UserContext';
import RegisterForm from './pages/auth/RegisterForm';
import Homepage from './pages/view/Homepage';
import Blogs from './pages/view/Blogs';
import SingleBlogPage from './pages/view/SingleBlogPage';
import Memberships from './pages/view/Memberships';
import LoginForm from './pages/auth/LoginForm';
import AdminDashboard from "./pages/dashboard/admin_dashboard";
import AdminLogin from "./pages/dashboard/admin_auth/admin_login";
import AdminRegister from "./pages/dashboard/admin_auth/admin_register";
import AdminProfile from "./pages/dashboard/AdminProfile";
import AdminUsers from "./pages/dashboard/AdminUsers";
import AdminPosts from "./pages/dashboard/AdminPosts";
import AdminMembership from "./pages/dashboard/AdminMembership";
import AdminMembershipPlans from "./pages/dashboard/AdminMembershipPlans";
import AdminCategories from "./pages/dashboard/AdminCategories";
import AdminTags from "./pages/dashboard/AdminTags";
import Checkout from "./pages/dashboard/Checkout";
import MyAccount from "./pages/view/MyAccount";
import MyMembership from "./pages/view/MyMeberships";
import SubscrptionPayment from "./pages/view/SubscrptionPayment";
import MyOrder from "./pages/view/MyOrder";
import MySubscription from "./pages/view/MySubscription";
import MyPosts from "./pages/view/MyPosts";
import AdminComments from "./pages/dashboard/AdminComments";
import Author from "./pages/view/Author";
import ServerError from "./pages/view/ServerError";
import ThankYou from "./pages/dashboard/Thankyou";
import VerifyOTP from "./pages/auth/verifyOTP";  
import ChatInbox from "./pages/chatDashboard/chatInbox";

import { CSpinner } from '@coreui/react'


function App() {
  const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_HOST_URL}/admin-exists`);
        const data = await res.json();
        setAdminExists(data.exists); // assuming API returns { exists: true }
      } catch (error) {
        console.error(error);
        setServerError(true);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="pt-3 text-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    );
  }
if(!adminExists){
  return(
    <BrowserRouter>
        <Routes>
          <Route path="*" element={serverError ? <Navigate to="/server-down" replace/> : <Navigate to="/ds-admin/register" replace/>} />
          <Route path="/ds-admin/register" element={<AdminRegister />} />
          <Route path="/server-down" element={<ServerError />} />
        </Routes>
    </BrowserRouter>
  );
}
return (
    <BrowserRouter>
      <UserProvider>
          <Routes>
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/posts" element={<Blogs />} />
            <Route path="/post/:slug" element={<SingleBlogPage />} />
            <Route path="/memberships" element={<Memberships />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />  
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/profile/:user_id" element={<AdminProfile />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/memberships" element={<AdminMembership />} />
            <Route path="/admin/membership-plans" element={<AdminMembershipPlans />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/tags" element={<AdminTags />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/my-membership" element={<MyMembership />} />
            <Route path="/subscription-payment" element={<SubscrptionPayment />} />
            <Route path="/my-orders" element={<MyOrder />} />
            <Route path="/my-subscriptions" element={<MySubscription />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/admin/comments" element={<AdminComments />} />
            <Route path="/author/:authorId" element={<Author />} />
            <Route path="/chat-dashboard" element={<ChatInbox />} />
            <Route path="/thankyou" element={<ThankYou />} />
            <Route path="/ds-admin/register" element={<Navigate to="/ds-admin/login" />} />
            <Route path="/ds-admin/login" element={<AdminLogin />} />
          </Routes>
        </UserProvider>
    </BrowserRouter>
  );
}

export default App;

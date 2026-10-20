import React from "react";
import DummyImg from "../../assets/dummy-post-square-1.jpg"
import { Link } from "react-router-dom";


export default function AdminHeader(props) {
  // const tokenData = jwtDecode(props.tokenData);
  const userData = props.userD;
  const pageName = props.pageName
        return(

        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h2 className="text-2xl font-semibold">{pageName}</h2>

          <div className="flex items-center gap-3">
            <Link to={`/admin/profile/${userData.id}`}>
              <img
                src={userData.profile_image ? userData.profile_image : `${process.env.PUBLIC_URL}${DummyImg}`}
                alt="Admin"
                className="w-10 h-10 rounded-full cursor-pointer hover:bg-gray-100 transition"
              />
            </Link>
            <div>
              <p className="font-medium">{userData.user_name ? userData.user_name : "---"}</p>
              <p className="text-sm text-gray-500">{userData.user_role ? userData.user_role : "---"}</p>
            </div>
          </div>
        </header>
        )
    }
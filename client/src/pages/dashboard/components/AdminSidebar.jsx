import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  LayoutList,
  ChartNoAxesGantt,
  PanelRightOpen,
  Handshake,
  Reply,
  Tags,
  ListCheck,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";


export default function AdminSidebar() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [openMenu, setOpenMenu] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
    { name: "Users", icon: <Users size={20} />, path: "/admin/users" },
    {
      name: "Posts", icon: <PanelRightOpen size={20} />,
      children: [
        {
          name: "Posts",
          icon: <LayoutList size={18} />,
          path: "/admin/posts",
        },
        {
          name: "Categories",
          icon: <ChartNoAxesGantt size={18} />,
          path: "/admin/categories",
        },
        {
          name: "Tags",
          icon: <Tags size={18} />,
          path: "/admin/tags",
        },
      ],
    },
    {
      name: "Memberships", path: "", icon: <Handshake size={20} />,
      children: [
        {
          name: "Memberships",
          icon: <Handshake size={18} />,
          path: "/admin/memberships",
        },
        {
          name: "Plans",
          icon: <ListCheck size={18} />,
          path: "/admin/membership-plans",
        },
      ],
    },
    { name: "Comments", icon: <Reply size={20} />, path: "/admin/comments" },
    { name: "Settings", icon: <Settings size={20} /> },
  ];
  useEffect(() => {
    if (location.pathname === "/admin/posts") {
      setOpenMenu("Posts");
    }
    if (location.pathname === "/admin/categories") {
      setOpenMenu("Posts");
    }
    if (location.pathname === "/admin/tags") {
      setOpenMenu("Posts");
    }
    if (location.pathname === "/admin/memberships") {
      setOpenMenu("Memberships");
    }
    if (location.pathname === "/admin/membership-plans") {
      setOpenMenu("Memberships");
    }

  }, [location.pathname]);
  // logout function
  const logoutUser = () => {
    removeCookie('token', { path: '/' });
    navigate('/ds-admin/login');
  };

  const handleSidebar = (item) => {
    if (item.children) {
      setOpenMenu(openMenu === item.name ? "" : item.name);
      return;
    }
    navigate(item.path);
  };
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-slate-700">
        <h1 className="text-2xl font-bold">Book Admin</h1>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <div key={item.name}>
            <button
              onClick={() => handleSidebar(item)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition ${location.pathname === item.path
                ? "bg-orange-500"
                : "hover:bg-slate-800"
                }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
              </div>

              {item.children &&
                (openMenu === item.name ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                ))}
            </button>

            {item.children && openMenu === item.name && (
              <div className="ml-8 mb-2 space-y-1">
                {item.children.map((child) => (
                  <button
                    key={child.name}
                    onClick={() => navigate(child.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${location.pathname === child.path
                      ? "bg-orange-400"
                      : "hover:bg-slate-800"
                      }`}
                  >
                    {child.icon}
                    {child.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <button onClick={logoutUser} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  )
}
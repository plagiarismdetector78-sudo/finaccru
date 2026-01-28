import React from "react";
import { CircleUserRound, LogOut, MessageSquareMore } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getNavLinks } from "../../MenuItems";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Actions/User";
import { PROFILE_URL } from "../../constant/endpoints";
import { SHOW_CHAT_IN_SIDEBAR, SHOW_PROFILE_IN_SIDEBAR } from "../../constant";

const Sidebar = ({ isCollapsed }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = location.pathname.split("/")[1];

    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleProfileRedirect = () => {
        const newTab = window.open(PROFILE_URL, "_blank");
        if (newTab) {
            newTab.focus();
        }
    };

    const navLinks = getNavLinks(isUserTaxRegistered);

    return (
        <nav
            className={`bg-white h-screen p-5 shadow-md flex flex-col justify-between ${
                isCollapsed ? "hidden lg:flex w-fit" : "w-64"
            } overflow-y-auto`}
        >
            {/* Logo Section - Fixed at the top */}
            <div className="flex items-center gap-3 sticky top-0 bg-white pb-4">
                <img
                    src="/assets/images/Logo.svg"
                    alt="Logo"
                    className="h-10 w-10"
                />
                {!isCollapsed && (
                    <h5 className="text-xl font-semibold text-blue-500">
                        Finaccru
                    </h5>
                )}
            </div>

            {/* Navigation Links - Scrollable */}
            <div className="flex flex-col gap-4 mt-8 flex-grow overflow-y-auto">
                {navLinks.map((item, idx) => {
                    const href = item?.href?.split("/")[1] || "";
                    const isActive = currentPath === href;

                    return (
                        <Link
                            key={idx}
                            to={item.href || "/"}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                                isActive
                                    ? "bg-gray-200 font-bold"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            {item.icon &&
                                React.createElement(item.icon, {
                                    className: "w-5 h-5",
                                })}
                            {!isCollapsed && (
                                <p className="text-gray-700 font-medium">
                                    {item.title || "Untitled"}
                                </p>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* User Profile, Chat & Logout - Fixed at the bottom */}
            <div className="mt-auto flex flex-col gap-4 border-t pt-4 sticky bottom-0 bg-white">
                {SHOW_PROFILE_IN_SIDEBAR && (
                    <div
                        onClick={handleProfileRedirect}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <CircleUserRound className="w-5 h-5" />
                        {!isCollapsed && (
                            <p className="text-gray-700 font-medium">Profile</p>
                        )}
                    </div>
                )}
                {SHOW_CHAT_IN_SIDEBAR && (
                    <Link
                        to="/chat"
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <MessageSquareMore className="w-5 h-5" />
                        {!isCollapsed && (
                            <p className="text-gray-700 font-medium">Chat</p>
                        )}
                    </Link>
                )}
                <div
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer text-red-500"
                >
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && <p className="font-medium">Logout</p>}
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;

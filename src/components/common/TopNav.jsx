import { AlignLeft, Bell } from "lucide-react";
import React, { useState, useEffect } from "react";
import NotificationModal from "../Modals/NotificationModal";
import { useSelector } from "react-redux";
import Spinner from "./Spinner";
import { Fragment } from "react";
import { DASHBOARD_URL } from "../../constant/endpoints";
import AIChatLauncher from "../AIChat/AIChatLauncher";

const bellRingAnimation = `
@keyframes bellRing {
    0% { transform: rotate(0); }
    10% { transform: rotate(15deg); }
    20% { transform: rotate(-15deg); }
    30% { transform: rotate(10deg); }
    40% { transform: rotate(-10deg); }
    50% { transform: rotate(5deg); }
    60% { transform: rotate(-5deg); }
    70% { transform: rotate(2deg); }
    80% { transform: rotate(-2deg); }
    90% { transform: rotate(1deg); }
    100% { transform: rotate(0); }
}

.animate-bell-ring {
    animation: bellRing 1s ease;
    transform-origin: top center;
}
`;

const TopNav = ({ toggleSidebar }) => {
    const [isActive, setIsActive] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] =
        useState(false);

    const { loading, user, isUserTaxRegistered } = useSelector(
        (state) => state.userReducer || {}
    );

    const getInitials = (fullName) => {
        if (!fullName) return "";
        const names = fullName.trim().split(" ");
        return names.map((n) => n[0]?.toUpperCase() || "").join("");
    };

    const toggleNotificationModal = () => {
        setIsNotificationModalOpen(!isNotificationModalOpen);
    };

    useEffect(() => {
        if (isUserTaxRegistered) return;

        const animationInterval = setInterval(() => {
            setIsActive(true);

            const timeout = setTimeout(() => {
                setIsActive(false);
            }, 1000);

            return () => clearTimeout(timeout);
        }, 2000);

        return () => {
            clearInterval(animationInterval);
        };
    }, [isUserTaxRegistered]);

    const handleNotificationModalSubmit = () => {
        window.open(`${DASHBOARD_URL}account?currentTab=basic-info`, "_blank");
    };

    return (
        <Fragment>
            <style>{bellRingAnimation}</style>

            <div className="sticky top-0 z-25 flex items-center justify-between p-5 bg-white">
                <div className="cursor-pointer" onClick={toggleSidebar}>
                    <AlignLeft />
                </div>

                <div className="flex items-center gap-5">
                    {!isUserTaxRegistered && (
                        <div className="relative cursor-pointer">
                            <div
                                className={`transform transition-transform duration-100 ${
                                    isActive ? "animate-bell-ring" : ""
                                }`}
                                onClick={toggleNotificationModal}
                            >
                                <Bell size={20} />
                            </div>
                            <div
                                className={`absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isActive
                                        ? "opacity-100 scale-100"
                                        : "opacity-0 scale-0"
                                }`}
                            >
                                <span className="relative flex h-2 w-2">
                                    <span
                                        className={`${
                                            isActive ? "animate-ping" : ""
                                        } absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75`}
                                    ></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* AI Assistant Launcher */}
                    <AIChatLauncher />

                    {/* User Initials */}
                    {loading ? (
                        <Spinner type="small" />
                    ) : (
                        user && (
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 flex items-center justify-center bg-primary text-white font-bold rounded-full pointer-events-none">
                                    {getInitials(user?.displayName)}
                                </div>
                                <p>{user?.displayName || ""}</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Modals */}
            <NotificationModal
                isOpen={isNotificationModalOpen}
                onClose={toggleNotificationModal}
                title={"Missing Tax Details"}
                message={
                    "Some tax details are missing. Please provide the required information to proceed."
                }
                actionLabel={"Submit"}
                onAction={handleNotificationModalSubmit}
            />
        </Fragment>
    );
};

export default TopNav;

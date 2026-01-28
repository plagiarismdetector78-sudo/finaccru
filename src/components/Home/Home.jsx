import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import TopNav from "../common/TopNav";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../Actions/User";

const Home = () => {
    const [isSidebarCollapased, setIsSidebarCollapased] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapased(!isSidebarCollapased);
    };

    // const dispatch = useDispatch();

    // useEffect(dispatch(loadUser()), []);

    const user = useSelector((state) => state.userReducer);
    // console.log(user);

    return (
        <div className="flex h-screen">
            <div className="">
                <Sidebar isCollapsed={isSidebarCollapased} />
            </div>
            <div className="flex-1 overflow-auto bg-secondary">
                <TopNav toggleSidebar={toggleSidebar} />
                <div className="p-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Home;

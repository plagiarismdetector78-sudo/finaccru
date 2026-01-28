import React from "react";
import { useLocation } from "react-router-dom";
import CreateCustomer from "../CreateCustomer";
import EditCustomer from "../EditCustomer";
import ViewCustomer from "../ViewCustomer";

const CustomerLayout = () => {
    const { pathname } = useLocation();

    // console.log("Path Name:", pathname);

    if (pathname.includes("/customer/create")) {
        return <CreateCustomer />;
    } else if (pathname.includes("/customer/view")) {
        return <ViewCustomer />;
    } else {
        return <EditCustomer />;
    }
};

export default CustomerLayout;

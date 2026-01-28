import React, { useEffect, useState } from "react";
import Button from "../common/Button";
import { Edit } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import Details from "./CustomerDetails/Details";
import Transactions from "./CustomerDetails/Transactions";
import Breadcrumb from "../common/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import {
    getCustomerDetails,
    getShippingAddressList,
} from "../../Actions/Customer";
import Spinner from "../common/Spinner";
import CustomerStatement from "./CustomerRead/Tabs/Statement/Statement";

const ViewCustomer = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const customerId = params.id;
    const [activeTab, setActiveTab] = useState("details");
    const [searchParams, setSearchParams] = useSearchParams();
    const { loading, customer, shippingAddresses } = useSelector(
        (state) => state.customerReducer
    );

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchParams({
            current_tab: tab,
        });
    };

    useEffect(() => {
        // Set Search Params
        setSearchParams({
            current_tab: "details",
        });

        dispatch(getCustomerDetails(customerId));
        dispatch(getShippingAddressList(customerId));
    }, [dispatch, customerId]);

    return (
        <div>
            <Breadcrumb
                item={{ label: "Customers", viewLabel: "View Customers" }}
            />
            <div className="flex items-center justify-between my-5">
                <div className="flex items-center gap-5">
                    <div
                        onClick={() => handleTabChange("details")}
                        className={`${
                            activeTab === "details"
                                ? "border-b-2 border-primary pb-1 text-center cursor-pointer"
                                : "border-b-2 border-transparent  pb-1 text-center cursor-pointer"
                        }`}
                    >
                        Details
                    </div>
                    <div
                        onClick={() => handleTabChange("transactions")}
                        className={`${
                            activeTab === "transactions"
                                ? "border-b-2 border-primary pb-1 text-center cursor-pointer"
                                : "border-b-2 border-transparent pb-1 text-center cursor-pointer"
                        }`}
                    >
                        Transactions
                    </div>
                    <div
                        onClick={() => handleTabChange("statement")}
                        className={`${
                            activeTab === "statement"
                                ? "border-b-2 border-primary pb-1 text-center cursor-pointer"
                                : "border-b-2 border-transparent pb-1 text-center cursor-pointer"
                        }`}
                    >
                        Statement
                    </div>
                </div>
                {/* <div className="w-32">
                    <Button icon={Edit} text={"Edit"} />
                </div> */}
            </div>
            <div className="my-5">
                {activeTab === "details" ? (
                    <>
                        {loading ? (
                            <Spinner type="fullscreen" />
                        ) : (
                            <Details
                                customer={customer}
                                shippingAddresses={shippingAddresses}
                            />
                        )}
                    </>
                ) : activeTab === "transactions" ? (
                    <Transactions />
                ) : activeTab === "statement" ? (
                    <CustomerStatement customer_id={customerId} />
                ) : null}
            </div>
        </div>
    );
};

export default ViewCustomer;

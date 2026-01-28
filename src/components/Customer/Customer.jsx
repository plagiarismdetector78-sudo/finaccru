import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import Input from "../common/Input";
import { Search, Plus } from "lucide-react";
import Button from "../common/Button";
import CustomerTable from "./CustomerTable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCustomerList } from "../../Actions/Customer";
import Spinner from "../common/Spinner";
import Breadcrumb from "../common/BreadCrumb";

const Customer = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading: isCustomerLoading, customers } = useSelector(
        (state) => state.customerReducer
    );

    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCustomers = (page = 1, search = "") => {
        dispatch(getCustomerList(page, search));
    };

    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            setCurrentPage(1);
            fetchCustomers(1, searchValue);
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        if (!searchText) {
            fetchCustomers(currentPage);
        }
    }, [dispatch, currentPage, searchText]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchCustomers(newPage, searchText);
    };

    useEffect(() => {
        fetchCustomers(currentPage);
    }, []);

    useEffect(() => {
        if (searchText.length > 2) {
            debouncedSearch(searchText);
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchText, debouncedSearch]);

    const handleCreateCustomerClick = () => {
        navigate("/customer/create");
    };

    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
    };

    if (isCustomerLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <Breadcrumb
                item={{ label: "Customers", viewLabel: "View Customers" }}
            />
            <div className="flex items-center justify-between my-5">
                <div className="w-1/3">
                    <Input
                        icon={Search}
                        value={searchText}
                        onChange={handleSearchInputChange}
                        placeholder={"Search Customer by Name or Email"}
                    />
                </div>
                <div className="">
                    <Button
                        icon={Plus}
                        text={"Create Customer"}
                        onClick={handleCreateCustomerClick}
                    />
                </div>
            </div>
            <div>
                <CustomerTable
                    customers={customers}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default Customer;

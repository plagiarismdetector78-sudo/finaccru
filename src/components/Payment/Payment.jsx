import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Download, Plus, Search } from "lucide-react";

import Input from "../common/Input";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import Breadcrumb from "../common/BreadCrumb";
import DeviceRestriction from "../common/DeviceRestriction";
import PaymentsTable from "./PaymentsTable";
import {
    deletePayments,
    downloadPaymentsList,
    getPaymentsList,
} from "../../Actions/Payment";
import DeleteModal from "../Modals/DeleteModal";

const Payment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, payments } = useSelector((state) => state.paymentReducer);

    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [record, setRecord] = useState({});

    const fetchPayments = (page = 1, search = "") => {
        dispatch(getPaymentsList(page, search));
    };

    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            setCurrentPage(1);
            fetchPayments(1, searchValue);
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        if (!searchText) {
            fetchPayments(currentPage);
        }
    }, [dispatch, currentPage, searchText]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchPayments(newPage, searchText);
    };

    useEffect(() => {
        fetchPayments(currentPage);
    }, []);

    useEffect(() => {
        if (searchText.length > 2) {
            debouncedSearch(searchText);
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchText, debouncedSearch]);

    const handleCreatePaymentClick = () => {
        navigate("/payment/create");
    };

    const handlePaymentDownloadClick = () => {
        dispatch(downloadPaymentsList());
    };

    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleDelete = () => {
        if (record.receipt_id) dispatch(deletePayments(record.receipt_id));
        setIsDeleteModalOpen(false);
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <DeviceRestriction>
            <div>
                <Breadcrumb
                    item={{
                        label: "Receipts",
                        viewLabel: "View Receipts",
                    }}
                />
                <div className="flex items-center justify-between gap-40 my-5">
                    <div className="w-1/3">
                        <Input
                            icon={Search}
                            value={searchText}
                            onChange={handleSearchInputChange}
                            placeholder={"Search Receipt by Receipt Number"}
                        />
                    </div>
                    <div className="flex items-center gap-5 w-1/3">
                        <Button
                            icon={Download}
                            text={"Download"}
                            variant="outlined"
                            onClick={handlePaymentDownloadClick}
                        />
                        <Button
                            icon={Plus}
                            text={"Create Receipt"}
                            onClick={handleCreatePaymentClick}
                        />
                    </div>
                </div>
                <div>
                    <PaymentsTable
                        payments={payments}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        showModal={(record) => {
                            setRecord(record);
                            setIsDeleteModalOpen(true);
                        }}
                    />
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
        </DeviceRestriction>
    );
};

export default Payment;

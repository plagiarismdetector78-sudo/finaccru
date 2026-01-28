import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Download, Plus, Search, Info } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import Breadcrumb from "../common/BreadCrumb";
import DeviceRestriction from "../common/DeviceRestriction";
import TaxInvoiceTable from "./TaxInvoiceTable";
import {
    downloadTaxInvoiceList,
    getTaxInvoiceList,
    extractDataFromTaxInvoice,
} from "../../Actions/TaxInvoice";
import CreateInvoiceModal from "../Modals/CreateInvoiceModal";
import { TAX_INVOICE_API_RECALL_TIME } from "../../constant";

const TaxInvoice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, taxInvoices, extractedTaxInvoices } = useSelector(
        (state) => state.taxInvoiceReducer
    );

    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Add this state
    const [isCreateTaxModalOpen, setIsCreateTaxModalOpen] = useState(false);
    const [fileError, setFileError] = useState([false, ""]);

    const fetchTaxInvoices = (page = 1, search = "") => {
        dispatch(getTaxInvoiceList(page, search));
    };

    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            setCurrentPage(1);
            fetchTaxInvoices(1, searchValue);
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        if (!searchText) {
            fetchTaxInvoices(currentPage);
        }
    }, [dispatch, currentPage, searchText]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchTaxInvoices(newPage, searchText);
    };

    useEffect(() => {
        fetchTaxInvoices(currentPage);
    }, []);

    useEffect(() => {
        if (searchText.length > 2) {
            debouncedSearch(searchText);
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchText, debouncedSearch]);

    const handleCreateTaxInvoiceClick = () => {
        navigate("/tax-invoice/create");
    };

    const handleTaxInvoiceDownloadClick = () => {
        dispatch(downloadTaxInvoiceList());
    };

    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
    };

    const showModalCreateTax = () => {
        setIsCreateTaxModalOpen(true);
    };

    const handleCancelCreateTax = () => {
        setIsCreateTaxModalOpen(false);
        setFileError([false, ""]);
    };

    const handleSubmitFile = (file) => {
        if (!file) {
            setFileError([true, "Please select a file first"]);
            return;
        }

        if (file.size > 5 * 1000 * 1024) {
            setFileError([true, "File size should be less than 5MB"]);
            return;
        }

        if (
            file.type !== "application/pdf" &&
            file.type !== "image/png" &&
            file.type !== "image/jpeg"
        ) {
            setFileError([true, "File type should be pdf, png, or jpeg"]);
            return;
        }

        dispatch(extractDataFromTaxInvoice(file, navigate));
        handleCancelCreateTax();

        setTimeout(() => {
            dispatch(getTaxInvoiceList());
        }, TAX_INVOICE_API_RECALL_TIME);
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <DeviceRestriction>
            <div>
                <Breadcrumb
                    item={{
                        label: isUserTaxRegistered ? "Tax Invoice" : "Invoice",
                        viewLabel: isUserTaxRegistered
                            ? "View Tax Invoices"
                            : "View Invoice",
                    }}
                />
                <div className="flex items-center justify-between gap-40 my-2">
                    <div className="w-1/3">
                        <Input
                            icon={Search}
                            value={searchText}
                            onChange={handleSearchInputChange}
                            placeholder={"Search Tax Invoice by Invoice Number"}
                        />
                    </div>
                    <div className="flex items-center gap-5 w-1/3">
                        <Button
                            icon={Download}
                            text={"Download"}
                            variant="outlined"
                            onClick={handleTaxInvoiceDownloadClick}
                        />
                        <Button
                            icon={Plus}
                            text={
                                isUserTaxRegistered
                                    ? "Tax Invoice"
                                    : "Create Invoice"
                            }
                            onClick={showModalCreateTax}
                        />
                    </div>
                </div>

                {taxInvoices?.total_pending_items > 0 ? (
                    <Link
                        to={"/tax-invoice/pending"}
                        className="text-red-600 font-bold px-2 pt-2 flex items-center gap-1 w-fit hover:underline"
                    >
                        {`${taxInvoices?.total_pending_items} ${
                            isUserTaxRegistered
                                ? "Tax Invoices Pending"
                                : "Invoices Pending"
                        }`}
                        <Info size={16} className="text-red-600" />
                    </Link>
                ) : (
                    ""
                )}

                <div className="mt-5">
                    <TaxInvoiceTable
                        taxInvoices={taxInvoices}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            <CreateInvoiceModal
                isOpen={isCreateTaxModalOpen}
                onClose={handleCancelCreateTax}
                onCreateManually={handleCreateTaxInvoiceClick}
                onSubmitFile={handleSubmitFile}
                fileError={fileError}
            />
        </DeviceRestriction>
    );
};

export default TaxInvoice;

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
import CreditNoteTable from "./CreditNoteTable";
import {
    deleteCreditNote,
    downloadCreditNoteList,
    getCreditNoteList,
    adjustCreditNoteAgainstInvoice,
} from "../../Actions/CreditNote";
import { readOpenTaxInvoicesForCustomer } from "../../Actions/TaxInvoice";
import { getCurrency } from "../../Actions/Onboarding";
import DeleteModal from "../Modals/DeleteModal";
import InvoiceAdjustmentModal from "../Modals/InvoiceAdjustmentModal";

const CreditNote = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, creditNotes } = useSelector(
        (state) => state.creditNoteReducer
    );
    const { loading: taxLoading, openTaxInvoices } = useSelector(
        (state) => state.taxInvoiceReducer
    );
    const { currencies } = useSelector((state) => state.onboardingReducer);

    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [record, setRecord] = useState({});
    const [invoiceList, setInvoiceList] = useState([]);

    const fetchCreditNotes = (page = 1, search = "") => {
        dispatch(getCreditNoteList(page, search));
    };

    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            setCurrentPage(1);
            fetchCreditNotes(1, searchValue);
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        if (!searchText) {
            fetchCreditNotes(currentPage);
        }
    }, [dispatch, currentPage, searchText]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchCreditNotes(newPage, searchText);
    };

    useEffect(() => {
        dispatch(getCurrency());
        fetchCreditNotes(currentPage);
    }, []);

    useEffect(() => {
        if (searchText.length > 2) {
            debouncedSearch(searchText);
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchText, debouncedSearch]);

    const handleCreateCreditNoteClick = () => {
        navigate("/credit-note/create");
    };

    const handleCreditNoteDownloadClick = () => {
        dispatch(downloadCreditNoteList());
    };

    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleDelete = () => {
        if (record.cn_id) dispatch(deleteCreditNote(record.cn_id));
        setIsDeleteModalOpen(false);
    };

    const showAdjustModal = (record) => {
        setRecord(record);
        setIsAdjustModalOpen(true);
        dispatch(
            readOpenTaxInvoicesForCustomer(
                record.customer_id,
                record.currency_id
            )
        );
    };

    const handleAdjustCancel = () => {
        setIsAdjustModalOpen(false);
        setInvoiceList([]);
    };

    const handleAdjust = () => {
        if (record.cn_id) {
            dispatch(
                adjustCreditNoteAgainstInvoice(record.cn_id, {
                    invoice_list: invoiceList,
                })
            ).then(() => {
                fetchCreditNotes(currentPage);
            });
            setIsAdjustModalOpen(false);
            setInvoiceList([]);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <DeviceRestriction>
            <div>
                <Breadcrumb
                    item={{
                        label: "Credit Note",
                        viewLabel: "View Credit Notes",
                    }}
                />
                <div className="flex items-center justify-between gap-40 my-5">
                    <div className="w-1/3">
                        <Input
                            icon={Search}
                            value={searchText}
                            onChange={handleSearchInputChange}
                            placeholder={"Search Credit Note by Number"}
                        />
                    </div>
                    <div className="flex items-center gap-5 w-2/5">
                        <Button
                            icon={Download}
                            text={"Download"}
                            variant="outlined"
                            onClick={handleCreditNoteDownloadClick}
                        />
                        <Button
                            icon={Plus}
                            text={"Create Credit Note"}
                            onClick={handleCreateCreditNoteClick}
                        />
                    </div>
                </div>
                <div>
                    <CreditNoteTable
                        creditNotes={creditNotes}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        showModal={(record) => {
                            setRecord(record);
                            setIsDeleteModalOpen(true);
                        }}
                        showAdjustModal={showAdjustModal}
                    />
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />

            {/* Adjust Modal */}
            <InvoiceAdjustmentModal
                isOpen={isAdjustModalOpen}
                onClose={handleAdjustCancel}
                onAdjust={handleAdjust}
                openInvoices={openTaxInvoices}
                selectedInvoices={invoiceList}
                setSelectedInvoices={setInvoiceList}
                isLoading={taxLoading}
                currencies={currencies}
            />
        </DeviceRestriction>
    );
};

export default CreditNote;

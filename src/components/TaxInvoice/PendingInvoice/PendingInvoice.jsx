import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../common/Spinner";
import DeviceRestriction from "../../common/DeviceRestriction";
import PendingInvoiceTable from "./PendingInvoiceTable";
import { getExtractedTaxInvoiceList } from "../../../Actions/TaxInvoice";
import Breadcrumb from "../../common/BreadCrumb";

function PendingInvoice() {
    const dispatch = useDispatch();
    const { loading, extractedTaxInvoices } = useSelector(
        (state) => state.taxInvoiceReducer
    );

    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getExtractedTaxInvoiceList(currentPage));
    }, [dispatch, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <DeviceRestriction>
            <div>
                <Breadcrumb
                    item={{
                        label: isUserTaxRegistered
                            ? "Pending Tax Invoices"
                            : "Pending Invoices",
                        viewLabel: "View Pending Invoices",
                    }}
                />

                <div className="py-10">
                    <PendingInvoiceTable
                        taxInvoices={extractedTaxInvoices}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </DeviceRestriction>
    );
}

export default PendingInvoice;

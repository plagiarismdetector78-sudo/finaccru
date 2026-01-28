import React, { Fragment, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import DeleteModal from "../Modals/DeleteModal";
import Pagination from "../common/Pagination";
import EmptyDataState from "../common/EmptyDataStateTable";
import { deleteTaxInvoice } from "../../Actions/TaxInvoice";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../utils/date";
import { renderRelatedDocumentCell } from "../../utils/RelatedDocumentLink";
import StatusBadge from "../common/StatusBadge";
import { formatNegativeAmount } from "../../utils/formatting";
import { SHOW_STATUS_COLUMN_TAX_INVOICE } from "../../constant";

const TaxInvoiceTable = ({ taxInvoices, currentPage, onPageChange }) => {
    const dispatch = useDispatch();
    const [taxInvoiceId, setTaxInvoiceId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const handleDelete = () => {
        if (taxInvoiceId) dispatch(deleteTaxInvoice(taxInvoiceId));
    };

    const columns = [
        {
            id: "ti_date",
            accessorKey: "ti_date",
            header: () => (
                <div className="text-start">
                    {isUserTaxRegistered ? "Tax Invoice Date" : "Invoice Date"}
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="text-start">{formatDate(getValue())}</div>
            ),
        },
        {
            id: "ti_number",
            accessorKey: "ti_number",
            header: () => (
                <div className="text-start">
                    {" "}
                    {isUserTaxRegistered
                        ? "Tax Invoice Number"
                        : "Invoice Number"}
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="text-start">{getValue()}</div>
            ),
        },
        {
            id: "customer_name",
            accessorKey: "customer_name",
            header: () => <div className="text-start">Customer Name</div>,
            cell: ({ getValue }) => (
                <div className="text-start">{getValue()}</div>
            ),
        },

        ...(isUserTaxRegistered
            ? [
                  {
                      id: "total_amount_excl_tax",
                      accessorKey: "total_amount_excl_tax",
                      header: () => (
                          <div className="text-right">Amount Excl. Tax</div>
                      ),
                      cell: ({ getValue }) => (
                          <div className="text-right">{getValue()}</div>
                      ),
                  },
                  {
                      id: "total_tax",
                      accessorKey: "total_tax",
                      header: () => <div className="text-right">Total Tax</div>,
                      cell: ({ getValue }) => (
                          <div className="text-right">{getValue()}</div>
                      ),
                  },
              ]
            : []),

        {
            id: "total",
            accessorKey: "total",
            header: () => <div className="text-right">Total Amount</div>,
            cell: ({ getValue }) => (
                <div className="text-right">{getValue()}</div>
            ),
        },
        {
            id: "due_amount",
            accessorKey: "due_amount",
            header: () => <div className="text-right">Due Amount</div>,
            cell: ({ getValue }) => (
                <div className="text-right">
                    {getValue()}
                </div>
            ),
        },
        {
            id: "related_document",
            accessorKey: "related_document_number",
            header: () => <div className="text-start">Related Document</div>,
            cell: ({ row }) => {
                const relatedDocId = row.original.related_document_id;
                const relatedDocNumber = row.original.related_document_number;
                return renderRelatedDocumentCell(
                    relatedDocId,
                    relatedDocNumber
                );
            },
        },
        ...(SHOW_STATUS_COLUMN_TAX_INVOICE
            ? [
                  {
                      id: "status",
                      accessorKey: "status",
                      header: () => <div className="text-center">Status</div>,
                      cell: ({ getValue }) => (
                          <StatusBadge status={getValue()} />
                      ),
                  },
              ]
            : []),
        {
            accessorKey: "invoice_payment_status",
            header: () => <div className="text-center">Payment Status</div>,
            cell: ({ getValue }) => {
                const status = getValue();
                let styles =
                    "px-2 py-1 rounded-full text-xs text-center font-medium ";

                if (status === "Fully Paid") {
                    styles += " text-green-600 bg-green-100";
                } else if (status === "Partially Paid") {
                    styles += " text-yellow-600 bg-yellow-100";
                } else if (status === "Unpaid") {
                    styles += " text-red-400 bg-red-100";
                } else {
                    styles += " text-gray-400 bg-gray-100";
                }

                return <div className={styles}>{status}</div>;
            },
        },

        {
            id: "actions",
            header: () => <div className="text-start">Actions</div>,
            cell: ({ row }) => {
                const tiId = row.original.ti_id;

                return (
                    <div className="flex items-center gap-5 justify-start">
                        <Link to={`/tax-invoice/view/${tiId}`}>
                            <Eye
                                size={20}
                                color="gray"
                                className="cursor-pointer"
                            />
                        </Link>
                        <Link to={`/tax-invoice/edit/${tiId}?action_type=edit`}>
                            <Edit
                                size={20}
                                color="gray"
                                className="cursor-pointer"
                            />
                        </Link>
                        {row.original.status !== "Void" &&
                            parseFloat(row.original.due_amount) !== 0 && (
                                <Trash2
                                    size={20}
                                    color="red"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setTaxInvoiceId(tiId);
                                        toggleDeleteModal();
                                    }}
                                />
                            )}
                    </div>
                );
            },
        },
    ];

    const toggleDeleteModal = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen);
    };

    const hasData = taxInvoices?.items && taxInvoices.items.length > 0;

    const table = useReactTable({
        columns,
        data: taxInvoices?.items || [],
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Fragment>
            <div>
                <div className="rounded-lg border border-gray-200 overflow-x-auto">
                    {hasData ? (
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="px-6 py-3 text-start text-sm font-semibold text-gray-900 border border-gray-200"
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {table
                                    .getRowModel()
                                    .rows.map((row, rowIndex) => (
                                        <tr
                                            key={row.id}
                                            className={`hover:bg-gray-50 transition-colors ${
                                                rowIndex % 2 === 1
                                                    ? "bg-gray-100"
                                                    : ""
                                            }`}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className="px-6 py-4 text-sm text-gray-500 border border-gray-200 text-start"
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                ))}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyDataState
                            title={`No ${
                                isUserTaxRegistered
                                    ? "Tax Invoices"
                                    : "Invoices"
                            } Found`}
                            message={`There are no ${
                                isUserTaxRegistered
                                    ? "tax invoices"
                                    : "invoices"
                            } available at the moment. Create a new ${
                                isUserTaxRegistered ? "tax invoice" : "invoice"
                            } to get started.`}
                            buttonText={`Create ${
                                isUserTaxRegistered ? "Tax Invoice" : "Invoice"
                            }`}
                            buttonLink="/tax-invoice/create"
                        />
                    )}
                </div>
                {hasData && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={taxInvoices?.total_pages}
                        onPageChange={onPageChange}
                    />
                )}
            </div>

            {/* Modals */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={toggleDeleteModal}
                onConfirm={handleDelete}
            />
        </Fragment>
    );
};

export default TaxInvoiceTable;

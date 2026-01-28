import React, { Fragment } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { formatDate } from "../../../utils/date";
import EmptyDataState from "../../common/EmptyDataStateTable";
import Pagination from "../../common/Pagination";
import { useSelector } from "react-redux";

const PendingInvoiceTable = ({ taxInvoices, currentPage, onPageChange }) => {
    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

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
                    {isUserTaxRegistered
                        ? "Tax Invoice Number"
                        : "Invoice Number"}
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="text-start">{getValue()}</div>
            ),
        },
        // {
        //     id: "customer_name",
        //     accessorKey: "customer_name",
        //     header: () => <div className="text-start">Customer Name</div>,
        //     cell: ({ getValue }) => (
        //         <div className="text-start">{getValue() || "-"}</div>
        //     ),
        // },

        {
            id: "attachment",
            accessorKey: "attachment_url",
            header: () => <div className="text-start">Attachment</div>,
            cell: ({ getValue }) => (
                <div className="text-start">
                    {getValue() ? (
                        <a
                            href={getValue()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            View Document
                        </a>
                    ) : (
                        "N/A"
                    )}
                </div>
            ),
        },
        // {
        //     id: "status",
        //     accessorKey: "ti_status",
        //     header: () => <div className="text-center">Status</div>,
        //     cell: ({ getValue }) => (
        //         <div className="flex justify-center">
        //             <div className="px-2 py-1 rounded-full text-xs text-center font-medium border-2 border-blue-600 text-blue-600">
        //                 {getValue()}
        //             </div>
        //         </div>
        //     ),
        // },
    ];

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
                            title="No Pending Invoices Found"
                            message="There are no pending invoices available for approval at the moment."
                        />
                    )}
                </div>
                {hasData && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={taxInvoices?.total_pages || 1}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
        </Fragment>
    );
};

export default PendingInvoiceTable;

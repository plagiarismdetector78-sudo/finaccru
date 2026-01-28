import React, { Fragment } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "../common/Pagination";
import EmptyDataState from "../common/EmptyDataStateTable";
import { formatDate } from "../../utils/date";
import StatusBadge from "../common/StatusBadge";

const PaymentsTable = ({ payments, showModal, currentPage, onPageChange }) => {
    const hasData = payments?.items && payments.items.length > 0;

    const columns = [
        {
            id: "receipt_date",
            accessorKey: "receipt_date",
            header: () => <div className="text-start">Receipt Date</div>,
            cell: ({ getValue }) => (
                <div className="text-start">{formatDate(getValue())}</div>
            ),
        },
        {
            id: "receipt_number",
            accessorKey: "receipt_number",
            header: () => <div className="text-start">Receipt Number</div>,
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
        {
            id: "amount",
            accessorKey: "amount",
            header: () => <div className="text-right">Amount</div>,
            cell: ({ getValue }) => (
                <div className="text-right">{getValue()}</div>
            ),
        },
        {
            id: "payment_mode",
            accessorKey: "payment_mode",
            header: () => <div className="text-start">Payment Mode</div>,
            cell: ({ getValue }) => (
                <div className="text-start">{getValue()}</div>
            ),
        },
        {
            id: "status",
            accessorKey: "status",
            header: () => <div className="text-center">Status</div>,
            cell: ({ getValue }) => <StatusBadge status={getValue()} />,
        },
        {
            id: "actions",
            header: () => <div className="text-start">Actions</div>,
            cell: ({ row }) => {
                const receiptId = row.original.receipt_id;
                return (
                    <div className="flex items-center gap-5 justify-start">
                        <Link to={`/payment/view/${receiptId}`}>
                            <Eye
                                size={20}
                                color="gray"
                                className="cursor-pointer"
                            />
                        </Link>
                        <Link
                            to={`/payment/edit/${receiptId}?action_type=edit`}
                        >
                            <Edit
                                size={20}
                                color="gray"
                                className="cursor-pointer"
                            />
                        </Link>
                        {row.original.status !== "Void" && (
                            <Trash2
                                size={20}
                                color="red"
                                className="cursor-pointer"
                                onClick={() => showModal(row.original)}
                            />
                        )}
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        columns,
        data: payments?.items || [],
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
                            title="No Payments Found"
                            message="There are no payments available at the moment. Create a new payment to get started."
                            buttonText="Create Payment"
                            buttonLink="/payment/create"
                        />
                    )}
                </div>
                {hasData && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={payments?.total_pages}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
        </Fragment>
    );
};

export default PaymentsTable;

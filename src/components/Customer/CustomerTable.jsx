import React, { Fragment, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import DeleteModal from "../Modals/DeleteModal";
import Pagination from "../common/Pagination";
import EmptyDataState from "../common/EmptyDataStateTable";
import { deleteCustomer } from "../../Actions/Customer";
import { useDispatch } from "react-redux";
import { formatDate } from "../../utils/date";
import { formatNegativeAmount } from "../../utils/formatting";

const CustomerTable = ({ customers, currentPage, onPageChange }) => {
    const dispatch = useDispatch();
    const [customerId, setCustomerId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = () => {
        if (customerId) dispatch(deleteCustomer(customerId));
    };

    const hasData = customers?.items && customers.items.length > 0;

    const columns = [
        {
            id: "customer_name",
            accessorKey: "customer_name",
            header: () => <div className="text-start">Customer Name</div>,
            cell: ({ getValue }) => (
                <div className="text-start">{getValue()}</div>
            ),
        },
        {
            id: "display_name",
            accessorKey: "display_name",
            header: () => <div className="text-start">Display Name</div>,
            cell: ({ getValue }) => (
                <div className="text-start">{getValue()}</div>
            ),
        },
        {
            id: "contact_name",
            accessorKey: "contact_name",
            header: () => <div className="text-start">Contact Name</div>,
            cell: ({ getValue }) => (
                <div className="text-start">{getValue()}</div>
            ),
        },
        {
            id: "email",
            accessorKey: "email",
            header: () => <div className="text-start">Email</div>,
            cell: ({ getValue }) => (
                <div className="text-start">{getValue()}</div>
            ),
        },
        {
            id: "amount_receivable",
            accessorKey: "amount_receivable",
            header: () => <div className="text-right">Amount Receivable</div>,
            cell: ({ getValue }) => {
                return (
                    <div className="text-right">
                        {getValue()}
                    </div>
                );
            },
        },
        {
            id: "is_active",
            accessorKey: "is_active",
            header: () => <div className="text-center">Active</div>,
            cell: ({ getValue }) => (
                <div className="flex justify-center">
                    <div
                        className={`px-2 py-1 rounded-full text-xs text-center font-medium ${
                            getValue()
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                    >
                        {getValue() ? "Active" : "Inactive"}
                    </div>
                </div>
            ),
        },
        {
            id: "created_at",
            accessorKey: "created_at",
            header: () => <div className="text-start">Created At</div>,
            cell: ({ getValue }) => (
                <div className="text-start">{formatDate(getValue())}</div>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-start">Actions</div>,
            cell: ({ row }) => {
                const customerId = row.original.customer_id;

                return (
                    <div className="flex items-center gap-5 justify-start">
                        <Link to={`/customer/view/${customerId}`}>
                            <Eye
                                size={20}
                                color="gray"
                                className="cursor-pointer"
                            />
                        </Link>
                        <Link to={`/customer/edit/${customerId}`}>
                            <Edit
                                size={20}
                                color="gray"
                                className="cursor-pointer"
                            />
                        </Link>
                        {row.original.is_active && (
                            <Trash2
                                size={20}
                                color="red"
                                className="cursor-pointer"
                                onClick={() => {
                                    setCustomerId(customerId);
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

    const table = useReactTable({
        columns,
        data: customers?.items || [],
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
                                                className="px-6 py-3 text-right text-sm font-semibold text-gray-900 border border-gray-200"
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
                                                        className="px-6 py-4 text-sm text-gray-500 border border-gray-200 text-right"
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
                            title="No Customers Found"
                            message="There are no customer available at the moment. Create a new customer to get started."
                            buttonText="Create Customer"
                            buttonLink="/customer/create"
                        />
                    )}
                </div>
                {hasData && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={customers?.total_pages}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={toggleDeleteModal}
                onConfirm={handleDelete}
            />
        </Fragment>
    );
};

export default CustomerTable;

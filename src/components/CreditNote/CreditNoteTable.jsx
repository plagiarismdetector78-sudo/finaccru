import React, { Fragment } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Edit, Eye, Trash2, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "../common/Pagination";
import EmptyDataState from "../common/EmptyDataStateTable";
import { formatDate } from "../../utils/date";
import { useSelector } from "react-redux";
import StatusBadge from "../common/StatusBadge";
import { formatNegativeAmount } from "../../utils/formatting";

const CreditNoteTable = ({
    creditNotes,
    showModal,
    showAdjustModal,
    currentPage,
    onPageChange,
}) => {
    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const hasData = creditNotes?.items && creditNotes.items.length > 0;

    const columns = [
        {
            accessorKey: "cn_date",
            header: () => <div className="">CN Date</div>,
            cell: ({ getValue }) => (
                <div className="">{formatDate(getValue())}</div>
            ),
        },
        { accessorKey: "cn_number", header: "Credit Note Number" },
        { accessorKey: "customer_name", header: "Customer Name" },

        ...(isUserTaxRegistered
            ? [
                  {
                      accessorKey: "total_amount_excl_tax",
                      header: "Amount (excl. VAT)",
                      cell: ({ getValue }) => (
                          <div className="text-right">{getValue()}</div>
                      ),
                  },
                  {
                      accessorKey: "total_tax",
                      header: "Total Tax",
                      cell: ({ getValue }) => (
                          <div className="text-right">{getValue()}</div>
                      ),
                  },
              ]
            : []),

        {
            accessorKey: "total",
            header: () => <div className="text-right">Total</div>,
            cell: ({ getValue }) => (
                <div className="text-right">{getValue()}</div>
            ),
        },
        {
            accessorKey: "remaining_balance",
            header: () => <div className="text-right">Remaining Balance</div>,
            cell: ({ getValue }) => (
                <div className="text-right">
                    {getValue()}
                </div>
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
                const cnId = row.original.cn_id;

                return (
                    <div className="flex items-center gap-5 justify-start">
                        <Link to={`/credit-note/view/${cnId}`}>
                            <Eye
                                size={20}
                                color="gray"
                                className="cursor-pointer"
                            />
                        </Link>
                        <Link to={`/credit-note/edit/${cnId}?action_type=edit`}>
                            <Edit
                                size={20}
                                color="gray"
                                className="cursor-pointer"
                            />
                        </Link>
                        {parseFloat(row.original.remaining_balance) !== 0 &&
                            row.original.status !== "Void" && (
                                <>
                                    <FileText
                                        size={20}
                                        color="gray"
                                        className="cursor-pointer"
                                        onClick={() =>
                                            showAdjustModal(row.original)
                                        }
                                    />

                                    <Trash2
                                        size={20}
                                        color="red"
                                        className="cursor-pointer"
                                        onClick={() => showModal(row.original)}
                                    />
                                </>
                            )}
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        columns,
        data: creditNotes?.items || [],
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
                                                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border border-gray-200"
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
                                                        className="px-6 py-4 text-sm text-gray-500 border border-gray-200"
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
                            title="No Credit Notes Found"
                            message="There are no credit notes available at the moment. Create a new credit note to get started."
                            buttonText="Create Credit Note"
                            buttonLink="/credit-note/create"
                        />
                    )}
                </div>
                {hasData && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={creditNotes?.total_pages}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
        </Fragment>
    );
};

export default CreditNoteTable;

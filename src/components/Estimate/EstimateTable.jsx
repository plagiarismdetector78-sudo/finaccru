import React, { Fragment, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Edit, Eye, GitCompareArrows, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import DeleteModal from "../Modals/DeleteModal";
import Pagination from "../common/Pagination";
import EmptyDataState from "../common/EmptyDataStateTable";
import { deleteEstimate } from "../../Actions/Estimate";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../utils/date";
import EstimateOrInvoiceConversionModal from "../Modals/EstimateOrInvoiceConversionModal";
import { renderRelatedDocumentCell } from "../../utils/RelatedDocumentLink";
import StatusBadge from "../common/StatusBadge";

const EstimateTable = ({ estimates, currentPage, onPageChange }) => {
    const dispatch = useDispatch();
    const [estimateId, setEstimateId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);

    const { user } = useSelector((state) => state.userReducer);
    const isUserTaxRegistered = user?.isUserTaxRegistered || false;

    const handleDelete = () => {
        if (estimateId) dispatch(deleteEstimate(estimateId));
    };

    const hasData = estimates?.items && estimates.items.length > 0;

    const columns = [
        {
            id: "estimate_date",
            accessorKey: "estimate_date",
            header: () => <div className="text-start">Estimate Date</div>,
            cell: ({ getValue }) => (
                <div className="text-start">{formatDate(getValue())}</div>
            ),
        },
        {
            id: "estimate_number",
            accessorKey: "estimate_number",
            header: () => <div className="text-start">Estimate Number</div>,
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
                          <div className="text-start">{getValue()}</div>
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
        {
            id: "created_at",
            accessorKey: "created_at",
            header: () => <div className="text-start">Created At</div>,
            cell: ({ getValue }) => (
                <div className="text-start">{formatDate(getValue())}</div>
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
                const estimateId = row.original.estimate_id;

                return (
                    <div className="flex items-center gap-5 justify-start">
                        <Link to={`/estimate/view/${estimateId}`}>
                            <Eye
                                size={20}
                                color="gray"
                                className="cursor-pointer"
                            />
                        </Link>
                        <Link
                            to={`/estimate/edit/${estimateId}?action_type=edit`}
                        >
                            <Edit
                                size={20}
                                color="gray"
                                className="cursor-pointer"
                            />
                        </Link>
                        <GitCompareArrows
                            size={20}
                            color="gray"
                            className="cursor-pointer"
                            onClick={() => {
                                setEstimateId(estimateId);
                                toggleConversionModal();
                            }}
                        />
                        {row.original.status !== "Void" && (
                            <Trash2
                                size={20}
                                color="red"
                                className="cursor-pointer"
                                onClick={() => {
                                    setEstimateId(estimateId);
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

    const toggleConversionModal = () => {
        setIsConversionModalOpen(!isConversionModalOpen);
    };

    const table = useReactTable({
        columns,
        data: estimates?.items || [],
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
                            title="No Estimates Found"
                            message="There are no estimates available at the moment. Create a new estimate to get started."
                            buttonText="Create Estimate"
                            buttonLink="/estimate/create?action_type=create"
                        />
                    )}
                </div>
                {hasData && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={estimates?.total_pages}
                        onPageChange={onPageChange}
                    />
                )}
            </div>

            {/* Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={toggleDeleteModal}
                onConfirm={handleDelete}
            />

            <EstimateOrInvoiceConversionModal
                isOpen={isConversionModalOpen}
                onClose={toggleConversionModal}
                itemId={estimateId}
                reference={"estimate"}
            />
        </Fragment>
    );
};

export default EstimateTable;

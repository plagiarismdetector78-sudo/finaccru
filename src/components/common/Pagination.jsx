import React from "react";

const Pagination = ({ currentPage = 1, totalPages = 0, onPageChange }) => {
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 3;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > maxVisiblePages + 2) {
                pages.push("...");
            }

            for (
                let i = Math.max(2, currentPage - maxVisiblePages);
                i <= Math.min(totalPages - 1, currentPage + maxVisiblePages);
                i++
            ) {
                pages.push(i);
            }

            if (currentPage < totalPages - maxVisiblePages - 1) {
                pages.push("...");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    if (totalPages === 0) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md transition ${
                    currentPage === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-blue-700"
                }`}
            >
                Previous
            </button>

            {/* Page Numbers */}
            {generatePageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => page !== "..." && onPageChange(page)}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === page
                            ? "bg-primary text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                    } ${page === "..." ? "cursor-default" : ""}`}
                    disabled={page === "..."}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md transition ${
                    currentPage === totalPages
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-blue-700"
                }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;

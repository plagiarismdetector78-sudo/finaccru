import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import ReactModal from "react-modal";
import { Search, X, ChevronDown, Plus, Loader } from "lucide-react";

ReactModal.setAppElement("#react-modal");

const BankIniniteScrollModal = ({
    loadMoreOptions,
    onChange,
    customerKeyword,
    setCustomerKeyword,
}) => {
    const listRef = useRef(null);
    const { loading, customersInf, totalCustomers } = useSelector(
        (state) => state.customerReducer
    );

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [visibleOptions, setVisibleOptions] = useState([]);

    // Handle infinite scroll
    const handleScroll = () => {
        if (listRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listRef.current;

            // If scrolled near bottom, load more
            if (scrollHeight - scrollTop - clientHeight < 100 && !loading) {
                const optionsPerPage = 20;
                const currentScrollPage =
                    Math.ceil(customersInf.length / optionsPerPage) + 1;
                loadMoreOptions(currentScrollPage);
            }
        }
    };

    // Add scroll event listener
    useEffect(() => {
        const list = listRef.current;
        if (list) {
            list.addEventListener("scroll", handleScroll);
            return () => list.removeEventListener("scroll", handleScroll);
        }
    }, [loading, customersInf.length]);

    // Update visible options when customers change
    useEffect(() => {
        setVisibleOptions(customersInf);
    }, [customersInf]);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        closeModal();
        setCustomerKeyword("");
        onChange(option);
    };

    return (
        <div className="relative my-2">
            {/* Input field that opens the modal */}
            <div
                className="w-52 cursor-pointer border-2 rounded px-3 py-2 bg-white flex items-center justify-between"
                onClick={openModal}
            >
                <p className="text-sm text-gray-500">Select Billing Address</p>
                <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>

            {/* Modal */}
            <ReactModal
                isOpen={isOpen}
                onRequestClose={closeModal}
                // style={customStyles}
                className="bg-white p-0 rounded-lg shadow-lg max-w-md w-full mx-auto overflow-hidden outline-none"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
                contentLabel="Select Customer"
            >
                {/* Modal header */}
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                        Select Customer
                    </h3>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Search input */}
                <div className="px-4 py-2 border-b border-gray-200">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={customerKeyword}
                            onChange={(e) => setCustomerKeyword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                {/* Customer list */}
                <div ref={listRef} className="max-h-64 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                        <li
                            className="px-4 py-3 bg-gray-50 hover:bg-gray-100 cursor-pointer font-medium flex items-center"
                            onClick={() =>
                                handleOptionClick({
                                    customer_id: "addCustomer",
                                    customer_name: "Add Customer",
                                })
                            }
                        >
                            <Plus className="h-4 w-4 mr-2 text-green-600" />
                            Add Customer
                        </li>

                        {visibleOptions.map((option) => (
                            <li
                                key={option.customer_id}
                                className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleOptionClick(option)}
                            >
                                {option.customer_name}
                            </li>
                        ))}

                        {loading && (
                            <li className="px-4 py-3 flex justify-center">
                                <Loader className="h-5 w-5 text-green-600 animate-spin" />
                            </li>
                        )}
                    </ul>
                </div>

                {/* Modal footer */}
                <div className="px-4 py-3 bg-gray-50 text-right">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        onClick={closeModal}
                    >
                        Done
                    </button>
                </div>
            </ReactModal>
        </div>
    );
};

export default BankIniniteScrollModal;

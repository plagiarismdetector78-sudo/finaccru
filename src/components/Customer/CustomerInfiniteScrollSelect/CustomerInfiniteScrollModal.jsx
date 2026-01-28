import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import ReactModal from "react-modal";
import {
    Search,
    X,
    ChevronDown,
    Plus,
    Loader,
    MapPin,
    User,
} from "lucide-react";

ReactModal.setAppElement("#react-modal");

const CustomerModalSelect = ({
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
    const [tempSelectedOption, setTempSelectedOption] = useState(null);
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

    const closeModal = () => {
        setIsOpen(false);
        setTempSelectedOption(null); // Reset temp selection on cancel
    };

    const handleOptionClick = (option) => {
        setTempSelectedOption(option); // Only store as temporary selection
    };

    const handleDoneClick = () => {
        if (tempSelectedOption) {
            setSelectedOption(tempSelectedOption);
            onChange(tempSelectedOption);
            setCustomerKeyword("");
        }
        setIsOpen(false);
    };

    return (
        <div className="relative my-2">
            {/* Enhanced Select Field */}
            <div
                className="cursor-pointer group transition-all duration-300 w-full max-w-xs rounded-lg overflow-hidden flex items-center bg-white border border-gray-300"
                onClick={openModal}
            >
                <div className=" p-3 flex items-center justify-center">
                    <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-grow p-3">
                    {selectedOption ? (
                        <p className="text-gray-800 font-medium truncate">
                            {selectedOption.customer_name}
                        </p>
                    ) : (
                        <p className="text-gray-500">Select Customer</p>
                    )}
                </div>
                <div className="pr-3">
                    <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-green-600 transition-colors" />
                </div>
            </div>

            {/* Modal */}
            <ReactModal
                isOpen={isOpen}
                onRequestClose={closeModal}
                className="bg-white p-0 rounded-lg shadow-lg max-w-md w-full mx-auto overflow-hidden outline-none"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
                contentLabel="Select Customer"
            >
                {/* Modal header */}
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-green-600 text-white">
                    <h3 className="text-lg font-medium flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Select Customer
                    </h3>
                    <button
                        onClick={closeModal}
                        className="text-white hover:text-gray-200 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Search input */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={customerKeyword}
                            onChange={(e) => setCustomerKeyword(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                        />
                    </div>
                </div>

                {/* Customer list */}
                <div ref={listRef} className="max-h-64 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                        {/* <li
                            className={`px-4 py-3 ${
                                tempSelectedOption?.customer_id ===
                                "addCustomer"
                                    ? "bg-green-100"
                                    : "bg-gray-50"
                            } hover:bg-green-50 cursor-pointer font-medium flex items-center transition-colors`}
                            onClick={() =>
                                handleOptionClick({
                                    customer_id: "addCustomer",
                                    customer_name: "Add Customer",
                                })
                            }
                        >
                            <Plus className="h-5 w-5 mr-2 text-green-600" />
                            Add Customer
                        </li> */}

                        {visibleOptions.map((option) => (
                            <li
                                key={option.customer_id}
                                className={`px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors ${
                                    tempSelectedOption?.customer_id ===
                                    option.customer_id
                                        ? "bg-green-100"
                                        : ""
                                }`}
                                onClick={() => handleOptionClick(option)}
                            >
                                <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>{option.customer_name}</span>
                                </div>
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
                <div className="px-4 py-3 bg-gray-50 text-right border-t border-gray-200">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors mr-2 font-medium"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                        onClick={handleDoneClick}
                    >
                        Done
                    </button>
                </div>
            </ReactModal>
        </div>
    );
};

export default CustomerModalSelect;

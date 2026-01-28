import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import ReactModal from "react-modal";
import { Search, X, ChevronDown, Plus, Loader, CreditCard } from "lucide-react";

ReactModal.setAppElement("#react-modal");

const BankModalSelect = ({
    loadMoreOptions,
    onChange,
    bankKeyword,
    setBankKeyword,
    excludedBankId,
    banks = [],
}) => {
    const listRef = useRef(null);
    const { loading } = useSelector((state) => state.bankReducer);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [tempSelectedOption, setTempSelectedOption] = useState(null);

    // Handle infinite scroll
    const handleScroll = () => {
        if (listRef.current && !loading) {
            const { scrollTop, scrollHeight, clientHeight } = listRef.current;
            const threshold = 100;

            if (scrollHeight - scrollTop - clientHeight < threshold) {
                loadMoreOptions();
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
    }, [loading]);

    // Filter banks based on keyword and excluded bank
    const filteredBanks = banks.filter((bank) => {
        const matchesKeyword = bankKeyword
            ? bank.bank_name
                  .toLowerCase()
                  .includes(bankKeyword.toLowerCase()) ||
              bank.account_number.includes(bankKeyword)
            : true;

        const notExcluded = excludedBankId
            ? bank.bank_id !== excludedBankId
            : true;

        return matchesKeyword && notExcluded;
    });

    const formatBankDisplay = (bank) => {
        if (bank.bank_id === "addBank") return "Add New Bank";
        return `${bank.bank_name} (${bank.account_number})`;
    };

    const openModal = () => setIsOpen(true);

    const closeModal = () => {
        setIsOpen(false);
        setTempSelectedOption(null);
    };

    const handleOptionClick = (option) => {
        setTempSelectedOption(option);
    };

    const handleDoneClick = () => {
        if (tempSelectedOption) {
            setSelectedOption(tempSelectedOption);
            onChange(tempSelectedOption);
            setBankKeyword("");
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
                <div className="p-3 flex items-center justify-center">
                    <Search className="h-5 w-5" />
                </div>
                <div className="flex-grow p-3">
                    {selectedOption ? (
                        <p className="text-gray-800 font-medium truncate">
                            {formatBankDisplay(selectedOption)}
                        </p>
                    ) : (
                        <p className="text-gray-500">Select Bank Account</p>
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
                contentLabel="Select Bank Account"
            >
                {/* Modal header */}
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-green-600 text-white">
                    <h3 className="text-lg font-medium flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Select Bank Account
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
                            placeholder="Search bank accounts..."
                            value={bankKeyword}
                            onChange={(e) => setBankKeyword(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                        />
                    </div>
                </div>

                {/* Bank list */}
                <div ref={listRef} className="max-h-64 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                        <li
                            className={`px-4 py-3 ${
                                tempSelectedOption?.bank_id === "addBank"
                                    ? "bg-green-100"
                                    : "bg-gray-50"
                            } hover:bg-green-50 cursor-pointer font-medium flex items-center transition-colors`}
                            onClick={() =>
                                handleOptionClick({
                                    bank_id: "addBank",
                                    label: "Add New Bank",
                                })
                            }
                        >
                            {/* <Plus className="h-5 w-5 mr-2 text-green-600" />
                            Add New Bank */}
                        </li>

                        {filteredBanks.map((bank) => (
                            <li
                                key={bank.bank_id}
                                className={`px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors ${
                                    tempSelectedOption?.bank_id === bank.bank_id
                                        ? "bg-green-100"
                                        : ""
                                }`}
                                onClick={() => handleOptionClick(bank)}
                            >
                                <div className="flex items-center">
                                    <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                                    <div className="min-w-0">
                                        <div className="font-medium truncate">
                                            {bank.bank_name}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {bank.account_number}
                                        </div>
                                        {bank.account_holder_name && (
                                            <div className="text-xs text-gray-400">
                                                {bank.account_holder_name}
                                            </div>
                                        )}
                                        {bank.iban_number && (
                                            <div className="text-xs text-gray-400">
                                                IBAN: {bank.iban_number}
                                            </div>
                                        )}
                                    </div>
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
                        disabled={!tempSelectedOption}
                    >
                        Done
                    </button>
                </div>
            </ReactModal>
        </div>
    );
};

BankModalSelect.propTypes = {
    loadMoreOptions: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    bankKeyword: PropTypes.string,
    setBankKeyword: PropTypes.func.isRequired,
    excludedBankId: PropTypes.number,
    banks: PropTypes.arrayOf(
        PropTypes.shape({
            bank_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            bank_name: PropTypes.string.isRequired,
            account_holder_name: PropTypes.string.isRequired,
            account_number: PropTypes.string.isRequired,
            iban_number: PropTypes.string,
            branch_name: PropTypes.string,
            currency_id: PropTypes.number,
            bank_type: PropTypes.string,
        })
    ),
};

export default BankModalSelect;

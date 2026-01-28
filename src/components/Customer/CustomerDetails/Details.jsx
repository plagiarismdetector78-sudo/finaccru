import React, { Fragment, useState } from "react";
import { formatDate } from "../../../utils/date";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DeleteModal from "../../Modals/DeleteModal";
import AddShippingAddressModal from "../../Modals/AddShippingAddressModal";
import EditShippingAddressModal from "../../Modals/EditShippingAddressModal";
import { useDispatch } from "react-redux";
import { deleteShippingAddress } from "../../../Actions/Customer";
import { ASYNC_STORAGE_KEYS } from "../../../constant/AsyncStorage";

const Details = ({ customer, shippingAddresses }) => {
    const dispatch = useDispatch();
    const customerId = customer?.customer_id;
    const [shippingAddressId, setShippingAddressId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [currentShippingAddress, setCurrentShippingAddress] = useState(null);

    const toggleDeleteModal = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen);
    };

    const toggleEditModal = () => {
        setIsEditModalOpen(!isEditModalOpen);
    };

    const toggleAddModal = () => {
        setIsAddModalOpen(!isAddModalOpen);
    };

    const handleDelete = () => {
        if (shippingAddressId)
            dispatch(deleteShippingAddress(shippingAddressId, customerId));
    };

    return (
        <Fragment>
            <div className="p-5 bg-white rounded-lg grid gap-5">
                <div className="border-2 rounded-md p-5">
                    <h2 className="text-xl font-semibold mb-4">
                        Personal Information
                    </h2>
                    <div className="mb-2">
                        <strong>Name:</strong> {customer?.customer_name}
                    </div>
                    <div className="mb-2">
                        <strong>Contact:</strong> {customer?.contact_name}
                    </div>
                    <div className="mb-2">
                        <strong>Display Name:</strong> {customer?.display_name}
                    </div>
                    <div className="mb-2">
                        <strong>Email:</strong> {customer?.email}
                    </div>
                    <div className="mb-2">
                        <strong>Mobile:</strong> {customer?.mobile_number}
                    </div>
                </div>

                <div className="border-2 rounded-md p-5">
                    <h3 className="text-xl font-semibold mt-4">
                        Account Information
                    </h3>
                    <div className="mt-4">
                        <strong>VAT TRN:</strong> {customer?.trn}
                    </div>
                    <div>
                        <strong>Opening Balance:</strong>{" "}
                        {customer?.opening_balance}
                    </div>
                    <div>
                        <strong>Opening Balance Date:</strong>{" "}
                        {formatDate(customer?.opening_balance_date)}
                    </div>
                </div>

                <div className="border-2 rounded-md p-5">
                    <h3 className="text-xl font-semibold mt-4">
                        Billing Address
                    </h3>
                    <div>
                        <strong>Line 1:</strong>{" "}
                        {customer?.billing_address_line_1}
                    </div>
                    <div>
                        <strong>Line 2:</strong>{" "}
                        {customer?.billing_address_line_2}
                    </div>
                    <div>
                        <strong>Line 3:</strong>{" "}
                        {customer?.billing_address_line_3}
                    </div>
                    <div>
                        <strong>State:</strong> {customer?.billing_state}
                    </div>
                    <div>
                        <strong>Country:</strong> {customer?.billing_country}
                    </div>
                </div>

                <div className="border-2 rounded-md p-5">
                    <h3 className="text-xl font-semibold mt-4">
                        Shipping Address
                    </h3>

                    {!shippingAddresses || shippingAddresses.length === 0 ? (
                        <p className="text-gray-500">
                            No Shipping Address Found
                        </p>
                    ) : (
                        shippingAddresses.map((address, index) => (
                            <div
                                key={index}
                                className="mt-2 border-b pb-2 flex justify-between items-start"
                            >
                                <div className="flex-1 space-y-1">
                                    <div>
                                        <strong>Label:</strong> {address?.label}
                                    </div>
                                    <div>
                                        <strong>Line 1:</strong>{" "}
                                        {address?.address_line_1}
                                    </div>
                                    <div>
                                        <strong>Line 2:</strong>{" "}
                                        {address?.address_line_2}
                                    </div>
                                    <div>
                                        <strong>Line 3:</strong>{" "}
                                        {address?.address_line_3}
                                    </div>
                                    <div>
                                        <strong>State:</strong> {address?.state}
                                    </div>
                                    <div>
                                        <strong>Country:</strong>{" "}
                                        {address?.country}
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <Pencil
                                        onClick={() => {
                                            setShippingAddressId(
                                                address.shipping_address_id
                                            );
                                            // localStorage.setItem(
                                            //     ASYNC_STORAGE_KEYS.SELECTED_SHIPPING_ADDRESS,
                                            //     JSON.stringify(address)
                                            // );
                                            setCurrentShippingAddress(address)
                                            toggleEditModal(address);
                                        }}
                                        className="w-5 h-5 text-blue-500 cursor-pointer"
                                    />
                                    <Trash2
                                        onClick={() => {
                                            setShippingAddressId(
                                                address.shipping_address_id
                                            );
                                            toggleDeleteModal(address);
                                        }}
                                        className="w-5 h-5 text-red-500 cursor-pointer"
                                    />
                                </div>
                            </div>
                        ))
                    )}

                    {/* Add New Address Button */}
                    <div
                        onClick={toggleAddModal}
                        className="mt-4 flex items-center space-x-2 text-blue-600 cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">
                            Add New Shipping Address
                        </span>
                    </div>
                </div>
            </div>

            {/* Modal */} 
            <AddShippingAddressModal
                customerId={customerId}
                isOpen={isAddModalOpen}
                onClose={toggleAddModal}
            />
            <EditShippingAddressModal
                customerId={customerId}
                shippingAddressId={shippingAddressId}
                currentShippingAddress={currentShippingAddress}
                isOpen={isEditModalOpen}
                onClose={toggleEditModal}
            />
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={toggleDeleteModal}
                onConfirm={handleDelete}
            />
        </Fragment>
    );
};

export default Details;

import React, { useState } from "react";
import Modal from "react-modal";
import { useFormik } from "formik";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { shippingAddressValidationSchema } from "../../schemas";
import { useDispatch } from "react-redux";
import { createShippingAddress } from "../../Actions/Customer";
import { toast } from "react-toastify";
import { ASYNC_STORAGE_KEYS } from "../../constant/AsyncStorage";

const AddShippingAddressModal = ({ isOpen, onClose, customerId }) => {
    const dispatch = useDispatch();
    const [selectedCountry, setSelectedCountry] = useState(
        "United Arab Emirates"
    );
    const [selectedState, setSelectedState] = useState("Dubai");

    const formik = useFormik({
        initialValues: {
            label: "",
            address_line_1: "",
            address_line_2: "",
            address_line_3: "",
            state: "Dubai",
            country: "United Arab Emirates",
        },
        validationSchema: shippingAddressValidationSchema,
        onSubmit: (values, { resetForm, setSubmitting }) => {
            if (!customerId) {
                toast.error("Customer Id not found");
                return;
            }
            try {
                // console.log("Shipping Address: ", values);
                dispatch(createShippingAddress(values, customerId));
                // resetForm();
                onClose();
                localStorage.removeItem(
                    ASYNC_STORAGE_KEYS.SELECTED_SHIPPING_ADDRESS
                );
            } catch (error) {
                console.error("Add Shipping Address Error: ", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleCountryChange = (value) => {
        formik.setFieldValue("country", value);
        formik.setFieldValue("state", "");
        setSelectedCountry(value);
    };

    const handleStateChange = (value) => {
        formik.setFieldValue("state", value);
        setSelectedState(value);
    };

    // console.log("Formik Errors: ", formik.errors);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-auto h-[600px] hide-scrollbar overflow-y-scroll"
            overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center"
        >
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3">
                Add Shipping Address
            </h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-6">
                    <div className="grid gap-5">
                        <Input
                            label="Label"
                            placeholder="Home, Office, etc."
                            name="label"
                            value={formik.values.label}
                            onChange={formik.handleChange}
                            error={formik.errors.label}
                            touched={formik.touched.label}
                            onBlur={formik.handleBlur}
                        />
                        <Input
                            label="Address Line 1"
                            placeholder="Street address, building"
                            name="address_line_1"
                            value={formik.values.address_line_1}
                            onChange={formik.handleChange}
                            error={formik.errors.address_line_1}
                            touched={formik.touched.address_line_1}
                            onBlur={formik.handleBlur}
                        />
                        <Input
                            label="Address Line 2"
                            placeholder="Apartment, suite, unit"
                            name="address_line_2"
                            value={formik.values.address_line_2}
                            onChange={formik.handleChange}
                            error={formik.errors.address_line_2}
                            touched={formik.touched.address_line_2}
                            onBlur={formik.handleBlur}
                        />
                        <Input
                            label="Address Line 3"
                            placeholder="Area, district"
                            name="address_line_3"
                            value={formik.values.address_line_3}
                            onChange={formik.handleChange}
                            error={formik.errors.address_line_3}
                            touched={formik.touched.address_line_3}
                            onBlur={formik.handleBlur}
                        />

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Country
                            </label>
                            <CountryDropdown
                                value={formik.values.country}
                                onChange={handleCountryChange}
                                name="country"
                                id="country"
                                className="w-full p-3 border border-gray-300 rounded-md outline-none"
                            />
                            {formik.touched.country &&
                                formik.errors.country && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {formik.errors.country}
                                    </p>
                                )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                State/Region
                            </label>
                            <RegionDropdown
                                country={formik.values.country}
                                value={formik.values.state}
                                onChange={handleStateChange}
                                className="w-full p-3 border border-gray-300 rounded-md outline-none"
                            />
                            {formik.touched.state && formik.errors.state && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.state}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 pt-2 border-t">
                    <Button
                        type="submit"
                        text={
                            formik.isSubmitting
                                ? "Please wait..."
                                : "Save Address"
                        }
                        disabled={!formik.isValid || formik.isSubmitting}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default AddShippingAddressModal;

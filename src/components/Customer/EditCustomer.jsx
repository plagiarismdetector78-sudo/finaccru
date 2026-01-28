import { ChevronRight, PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "../common/Select";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useFormik } from "formik";
import COUNTRIES from "../../constant/countries";
import { createCustomerValidationSchema } from "../../schemas";
import { useDispatch, useSelector } from "react-redux";
import {
    getCustomerDetails,
    getShippingAddressList,
    updateCustomer,
} from "../../Actions/Customer";
import Breadcrumb from "../common/BreadCrumb";
import { useParams } from "react-router-dom";
import Spinner from "../common/Spinner";

const SHOW_SHIPPING_ADDRESS = false;

const EditCustomer = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const customerId = params.id;
    const [selectedCountry, setSelectedCountry] = useState(
        "United Arab Emirates"
    );
    const [selectedState, setSelectedState] = useState("Dubai");
    const { loading, customer, shippingAddresses } = useSelector(
        (state) => state.customerReducer
    );

    // console.log("CustomerI Info: ", customer);

    // console.log("Shipping Addresses: ", shippingAddresses);

    const formik = useFormik({
        initialValues: {
            customer_name: customer?.customer_name || "",
            contact_name: customer?.contact_name || "",
            display_name: customer?.display_name || "",
            email: customer?.email || "",
            country_code: customer?.country_code || "+971",
            mobile_number: customer?.mobile_number || "",
            billing_address_line_1: customer?.billing_address_line_1 || "",
            billing_address_line_2: customer?.billing_address_line_2 || "",
            billing_address_line_3: customer?.billing_address_line_3 || "",
            billing_state: customer?.billing_state || "Dubai",
            billing_country:
                customer?.billing_country || "United Arab Emirates",
            trn: customer?.trn || "",
            opening_balance: customer?.opening_balance || "",
            opening_balance_date: customer?.opening_balance_date || null,
            shipping_addresses:
                shippingAddresses?.length > 0
                    ? shippingAddresses.map((address) => ({
                          shipping_address_id:
                              address.shipping_address_id || null,
                          label: address.label || "",
                          address_line_1: address.address_line_1 || "",
                          address_line_2: address.address_line_2 || "",
                          address_line_3: address.address_line_3 || "",
                          state: address.state || "Dubai",
                          country: address.country || "United Arab Emirates",
                      }))
                    : [
                          {
                              shipping_address_id: null,
                              label: "",
                              address_line_1: "",
                              address_line_2: "",
                              address_line_3: "",
                              state: "Dubai",
                              country: "United Arab Emirates",
                          },
                      ],
        },
        validationSchema: createCustomerValidationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            // console.log("Edit Customer: ", values);
            try {
                const response = await dispatch(
                    updateCustomer(values, customerId)
                );
                // console.log("Customer updated successfully:", response);
                // resetForm();
            } catch (error) {
                console.error("Create Customer Error: ", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const addShippingAddress = () => {
        const currentAddresses = formik?.values?.shipping_addresses;

        const newAddressLabel = `Shipping Address ${
            currentAddresses?.length + 1
        }`;

        formik.setFieldValue("shipping_addresses", [
            ...currentAddresses,
            {
                label: newAddressLabel,
                address_line_1: "",
                address_line_2: "",
                address_line_3: "",
                state: "Dubai",
                country: "United Arab Emirates",
            },
        ]);
    };

    const removeShippingAddress = (indexToRemove) => {
        if (formik.values.shipping_addresses.length > 1) {
            const updatedAddresses = formik.values.shipping_addresses.filter(
                (_, index) => index !== indexToRemove
            );
            formik.setFieldValue("shipping_addresses", updatedAddresses);
        }
    };

    const handleCountryChange = (value, isShipping = false, index = null) => {
        if (isShipping && index !== null) {
            const updatedAddresses = [...formik.values.shipping_addresses];
            updatedAddresses[index] = {
                ...updatedAddresses[index],
                country: value,
                state: "",
            };
            formik.setFieldValue("shipping_addresses", updatedAddresses);
        } else {
            formik.setFieldValue("billing_country", value);
            formik.setFieldValue("billing_state", "");
        }
        setSelectedCountry(value);
    };

    const handleStateChange = (value, isShipping = false, index = null) => {
        if (isShipping && index !== null) {
            const updatedAddresses = [...formik.values.shipping_addresses];
            updatedAddresses[index] = {
                ...updatedAddresses[index],
                state: value,
            };
            formik.setFieldValue("shipping_addresses", updatedAddresses);
        } else {
            formik.setFieldValue("billing_state", value);
        }
        setSelectedState(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        formik.handleSubmit(event);
    };

    console.log("Formik Errors: ", formik.errors);

    useEffect(() => {
        dispatch(getCustomerDetails(customerId));
        dispatch(getShippingAddressList(customerId));
    }, [dispatch, customerId]);

    if (loading) {
        return <Spinner type="fullscreen" />;
    }

    return (
        <div>
            <Breadcrumb
                item={{ label: "Customers", viewLabel: "Edit Customers" }}
            />
            <form onSubmit={handleSubmit}>
                <div className="my-5 grid gap-5">
                    <div className="bg-white rounded-md p-5">
                        <h3 className="mb-3 font-bold">Personal Information</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <Input
                                label={"Customer Name"}
                                placeholder={"Customer Name"}
                                name={"customer_name"}
                                value={formik.values.customer_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.customer_name}
                                touched={formik.touched.customer_name}
                            />
                            <Input
                                label={"Contact Name"}
                                placeholder={"Contact Name"}
                                name={"contact_name"}
                                value={formik.values.contact_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.contact_name}
                                touched={formik.touched.contact_name}
                            />
                            <Input
                                label={"Email ID"}
                                placeholder={"Email ID"}
                                name={"email"}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.email}
                                touched={formik.touched.email}
                            />
                            <Input
                                label={"Display Name"}
                                placeholder={"Display Name"}
                                name={"display_name"}
                                value={formik.values.display_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.display_name}
                                touched={formik.touched.display_name}
                            />
                            <div className="flex items-center gap-1">
                                <Select
                                    label={"Country Code"}
                                    placeholder={"Select Country Code"}
                                    options={COUNTRIES}
                                    className={"w-full"}
                                    name={"country_code"}
                                    value={formik.values.country_code}
                                    onChange={(value) =>
                                        formik.setFieldValue(
                                            "country_code",
                                            value
                                        )
                                    }
                                    error={formik.errors.country_code}
                                    touched={formik.touched.country_code}
                                />
                                <Input
                                    label={"Phone Number"}
                                    placeholder={"Phone Number"}
                                    className={"w-full"}
                                    name={"mobile_number"}
                                    value={formik.values.mobile_number}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.errors.mobile_number}
                                    touched={formik.touched.mobile_number}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-md p-5">
                        <h3 className="mb-3 font-bold">Account Information</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <Input
                                label={"Vat TRN Number"}
                                placeholder={"Vat TRN Number"}
                                name={"trn"}
                                value={formik.values.trn}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.trn}
                                touched={formik.touched.trn}
                            />
                            <Input
                                label={"Opening Balance"}
                                placeholder={"Opening Balance"}
                                name={"opening_balance"}
                                value={formik.values.opening_balance}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.opening_balance}
                                touched={formik.touched.opening_balance}
                            />
                            <DatePicker
                                selected={formik.values.opening_balance_date}
                                onChange={(date) =>
                                    formik.setFieldValue(
                                        "opening_balance_date",
                                        date
                                    )
                                }
                                placeholderText="Select Date"
                                className="w-full p-3 border rounded outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-md p-5">
                        <h3 className="mb-3 font-bold">Billing Address</h3>
                        <div className="grid grid-cols-2 gap-5">
                            <Input
                                label={"Address Line 1"}
                                placeholder={"Address Line 1"}
                                name={"billing_address_line_1"}
                                value={formik.values.billing_address_line_1}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.billing_address_line_1}
                                touched={formik.touched.billing_address_line_1}
                            />
                            <Input
                                label={"Address Line 2"}
                                placeholder={"Address Line 2"}
                                name={"billing_address_line_2"}
                                value={formik.values.billing_address_line_2}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.billing_address_line_2}
                                touched={formik.touched.billing_address_line_2}
                            />
                            <Input
                                label={"Address Line 3"}
                                placeholder={"Address Line 3"}
                                name={"billing_address_line_3"}
                                value={formik.values.billing_address_line_3}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.billing_address_line_3}
                                touched={formik.touched.billing_address_line_3}
                            />
                            <div>
                                <CountryDropdown
                                    value={formik.values.billing_country}
                                    onChange={(value) =>
                                        handleCountryChange(value, false)
                                    }
                                    name="billing_country"
                                    id="billing_country"
                                    className="w-full p-3 border rounded outline-none"
                                />
                            </div>
                            {formik.values.billing_country && (
                                <RegionDropdown
                                    country={formik.values.billing_country}
                                    value={formik.values.billing_state}
                                    onChange={(value) =>
                                        handleStateChange(value, false)
                                    }
                                    className="w-full p-3 border rounded outline-none"
                                />
                            )}
                        </div>
                    </div>

                    {/* {SHOW_SHIPPING_ADDRESS && ( */}
                    <div className="bg-white rounded-md p-5">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold">Shipping Addresses</h3>
                            <button
                                type="button"
                                onClick={addShippingAddress}
                                className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                                <PlusCircle className="mr-2" size={20} /> Add
                                Shipping Address
                            </button>
                        </div>

                        {formik.values.shipping_addresses.length > 0 &&
                            formik.values.shipping_addresses.map(
                                (address, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 p-4 rounded-md mb-4 relative"
                                    >
                                        {/* {formik.values.shipping_addresses
                                            .length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeShippingAddress(index)
                                                }
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )} */}
                                        <div className="grid grid-cols-2 gap-5">
                                            <Input
                                                label={"Label"}
                                                placeholder={
                                                    "Enter address label"
                                                }
                                                name={`shipping_addresses.${index}.label`}
                                                value={address.label}
                                                onChange={formik.handleChange}
                                            />
                                            <Input
                                                label={"Address Line 1"}
                                                placeholder={"Address Line 1"}
                                                name={`shipping_addresses.${index}.address_line_1`}
                                                value={address.address_line_1}
                                                onChange={formik.handleChange}
                                            />
                                            <Input
                                                label={"Address Line 2"}
                                                placeholder={"Address Line 2"}
                                                name={`shipping_addresses.${index}.address_line_2`}
                                                value={address.address_line_2}
                                                onChange={formik.handleChange}
                                            />
                                            <Input
                                                label={"Address Line 3"}
                                                placeholder={"Address Line 3"}
                                                name={`shipping_addresses.${index}.address_line_3`}
                                                value={address.address_line_3}
                                                onChange={formik.handleChange}
                                            />
                                            <div>
                                                <CountryDropdown
                                                    value={address.country}
                                                    onChange={(value) =>
                                                        handleCountryChange(
                                                            value,
                                                            true,
                                                            index
                                                        )
                                                    }
                                                    name={`shipping_country_${index}`}
                                                    id={`shipping_country_${index}`}
                                                    className="w-full p-3 border rounded outline-none"
                                                />
                                            </div>
                                            {address.country && (
                                                <RegionDropdown
                                                    country={address.country}
                                                    value={address.state}
                                                    onChange={(value) =>
                                                        handleStateChange(
                                                            value,
                                                            true,
                                                            index
                                                        )
                                                    }
                                                    className="w-full p-3 border rounded outline-none"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                    </div>
                    {/* )} */}

                    <div className="w-fit ml-auto">
                        <Button
                            type="submit"
                            text={
                                formik.isSubmitting
                                    ? "Please wait..."
                                    : "Update"
                            }
                            disabled={!formik.isValid || formik.isSubmitting}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditCustomer;

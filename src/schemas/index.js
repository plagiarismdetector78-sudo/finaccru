import * as Yup from "yup";

const createCustomerValidationSchema = Yup.object({
    customer_name: Yup.string().required("Customer name is required"),
    contact_name: Yup.string(),
    display_name: Yup.string().required("Display name is required"),
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    mobile_number: Yup.string()
        .matches(/^[0-9]+$/, "Mobile number must contain only digits")
        .min(6, "Mobile number must be at least 6 digits")
        .required("Mobile number is required"),
    billing_address_line_1: Yup.string().required(
        "Billing address line 1 is required"
    ),
    billing_address_line_2: Yup.string(),
    billing_address_line_3: Yup.string(),
    billing_state: Yup.string().required("Billing state is required"),
    billing_country: Yup.string().required("Billing country is required"),
    trn: Yup.string(),
    opening_balance: Yup.number().min(
        0,
        "Opening balance must be 0 or greater"
    ),
    opening_balance_date: Yup.mixed()
        .nullable()
        .transform((value) => (value === "" ? null : value)),
    shipping_addresses: Yup.array()
        .of(
            Yup.object({
                label: Yup.string().required("Label is required"),
                address_line_1: Yup.string().required(
                    "Address line 1 is required"
                ),
                address_line_2: Yup.string(),
                address_line_3: Yup.string(),
                state: Yup.string().required("State is required"),
                country: Yup.string().required("Country is required"),
            })
        )
        .min(1, "At least one shipping address is required"),
});

const shippingAddressValidationSchema = Yup.object({
    label: Yup.string().required("Label is required"),
    address_line_1: Yup.string().required("Address Line 1 is required"),
    address_line_2: Yup.string().required("Address Line 2 is required"),
    address_line_3: Yup.string().required("Address Line 3 is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
});

const estimateValidationSchema = Yup.object().shape({
    estimateNumber: Yup.string().required("Required"),
    estimateDate: Yup.string().required("Required"),
    validTill: Yup.string().required("Required"),
    reference: Yup.string().nullable(),
    customerName: Yup.string().required("Required"),
    customerId: Yup.number().nullable(),
    currencyId: Yup.number().required("Required"),
    currencyConversionRate: Yup.number().required("Required"),
    subject: Yup.string().nullable(),
    termsAndConditions: Yup.string().nullable(),
    isSetDefaultTncCustomer: Yup.boolean(),
    isSetDefaultTncClient: Yup.boolean(),
    items: Yup.array().of(
        Yup.object().shape({
            item_name: Yup.string().required("Required"),
            unit: Yup.string().required("Required"),
            qty: Yup.number().nullable().required("Required"),
            rate: Yup.number().nullable().required("Required"),
            discount: Yup.number().required("Required"),
            is_percentage_discount: Yup.boolean().required("Required"),
            tax_id: Yup.number().required("Required"),
            description: Yup.string().nullable(),
        })
    ),
    shippingAddress1: Yup.string().nullable(),
    shippingAddress2: Yup.string().nullable(),
    shippingAddress3: Yup.string().nullable(),
    shippingCountry: Yup.string().nullable(),
    shippingState: Yup.string().nullable(),
    currency: Yup.string().required("Required"),
    sameAsBillingAddress: Yup.boolean(),
});

export {
    createCustomerValidationSchema,
    shippingAddressValidationSchema,
    estimateValidationSchema,
};

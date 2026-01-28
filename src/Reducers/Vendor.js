import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loading: true,
    vendor: null,
    vendors: [],
    vendorsInf: [],
    shippingAddresses: [],
}

export const vendorReducer = createReducer(initialState, (builder) => {

    builder
        .addCase("CreateVendorRequest", (state) => {
            state.loading = true;
        })
        .addCase("CreateVendorFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CreateVendorSuccess", (state, action) => {
            state.loading = false;
            state.vendor = action.payload;
            state.error = null;
        })
        .addCase("UpdateVendorRequest", (state) => {
            state.loading = true;
        })
        .addCase("UpdateVendorFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("UpdateVendorSuccess", (state, action) => {
            state.loading = false;
            state.vendor = action.payload;
            state.error = null;
        })
        .addCase("CreateInPurchaseDocumentRequest", (state) => {
            state.loading = true;
        })
        .addCase("CreateInPurchaseDocumentFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CreateInPurchaseDocumentSuccess", (state, action) => {
            state.loading = false;
            state.vendor = action.payload;
            state.error = null;
        })
        .addCase("VendorDetailsRequest", (state) => {
            state.loading = true;
        })
        .addCase("VendorDetailsFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("VendorDetailsSuccess", (state, action) => {
            state.loading = false;
            state.vendor = action.payload;
            state.error = null;
        })
        .addCase("VendorListRequest", (state) => {
            state.loading = true;
        })
        .addCase("VendorListFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("VendorListSuccess", (state, action) => {
            state.loading = false;
            state.vendors = action.payload;
            state.error = null;
        })
        .addCase("VendorInfiniteScrollRequest", (state) => {
            state.loading = true;
        })
        .addCase("VendorInfiniteScrollFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("VendorInfiniteScrollSuccess", (state, action) => {
            state.loading = false;
            state.vendorsInf = action.payload.refresh ? action.payload.data.items : [...state.vendorsInf, ...action.payload.data.items];
            state.totalVendors = action.payload.data.total_items;
            state.error = null;
        })
        .addCase("CreateVendorShippingAddressRequest", (state) => {
            state.loading = true;
        })
        .addCase("CreateVendorShippingAddressFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CreateVendorShippingAddressSuccess", (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
        })
        .addCase("VendorShippingAddressListRequest", (state) => {
            state.loading = true;
        })
        .addCase("VendorShippingAddressListFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("VendorShippingAddressListSuccess", (state, action) => {
            state.loading = false;
            state.shippingAddresses = action.payload;
            state.error = null;
        })
        .addCase("UpdateVendorShippingAddressRequest", (state) => {
            state.loading = true;
        })
        .addCase("UpdateVendorShippingAddressFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("UpdateVendorShippingAddressSuccess", (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
        })
        .addCase("DeleteVendorShippingAddressRequest", (state) => {
            state.loading = true;
        })
        .addCase("DeleteVendorShippingAddressFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("DeleteVendorShippingAddressSuccess", (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = null;
        })
        .addCase("DeleteVendorRequest", (state) => {
            state.loading = true;
        })
        .addCase("DeleteVendorFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("DeleteVendorSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("CreatePettyCashHandlerRequest", (state) => {
            state.loading = true;
        })
        .addCase("CreatePettyCashHandlerFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CreatePettyCashHandlerSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("CreateOtherPaymentRequest", (state) => {
            state.loading = true;
        })
        .addCase("CreateOtherPaymentFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("CreateOtherPaymentSuccess", (state, action) => {
            state.loading = false;
            state.success = action.payload;
            state.error = null;
        })
        .addCase("ReadPaymentMethodRequest", (state) => {
            state.loading = true;
        })
        .addCase("ReadPaymentMethodFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ReadPaymentMethodSuccess", (state, action) => {
            state.loading = false;
            state.paymentMethods = action.payload;
            state.error = null;
        })
        .addCase("ReadPaymentMethodSubCategoriesRequest", (state) => {
            state.loading = true;
        })
        .addCase("ReadPaymentMethodSubCategoriesFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ReadPaymentMethodSubCategoriesSuccess", (state, action) => {
            state.loading = false;
            state.paymentMethodSubCategories = action.payload;
            state.error = null;
        })
        .addCase("ReadPaymentTermsRequest", (state) => {
            state.paymentTermsLoading = true;
        })
        .addCase("ReadPaymentTermsFailure", (state, action) => {
            state.paymentTermsLoading = false;
            state.error = action.payload;
        })
        .addCase("ReadPaymentTermsSuccess", (state, action) => {
            state.paymentTermsLoading = false;
            state.paymentTerms = action.payload;
            state.error = null;
        })
        .addCase("CalculateExpectedDeliveryDateRequest", (state) => {
            state.expectedDeliveryDateLoading = true;
        })
        .addCase("CalculateExpectedDeliveryDateFailure", (state, action) => {
            state.expectedDeliveryDateLoading = false;
            state.error = action.payload;
        })
        .addCase("CalculateExpectedDeliveryDateSuccess", (state, action) => {
            state.expectedDeliveryDateLoading = false;
            state.expectedDeliveryDate = action.payload;
            state.error = null;
        })
        .addCase("ClearExpectedDeliveryDate", (state) => {
            state.expectedDeliveryDate = null;
        })
        .addCase("ReadVendorStatementRequest", (state) => {
            state.loading = true;
        })
        .addCase("ReadVendorStatementFailure", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("ReadVendorStatementSuccess", (state, action) => {
            state.loading = false;
            state.vendorStatement = action.payload;
            state.error = null;
        })
})

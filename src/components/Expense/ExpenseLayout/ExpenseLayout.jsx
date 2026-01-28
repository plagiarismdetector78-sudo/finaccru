import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import moment from 'moment';
import { getCurrency } from '../../../Actions/Onboarding';
import { createExpense, getExpenseDetails, readExpenseCategories, updateExpense } from '../../../Actions/Expense';
import { getVendorInfiniteScroll, readPaymentMethod, readPaymentMethodSubCategories } from '../../../Actions/Vendor';

import "./ExpenseLayout.css";
import "../../../Styles/Layout/LayoutHeader.css";
import "../../../Styles/Layout/LayoutContainer.css";

import { Select, Input, AutoComplete } from "antd";
import backButton from "../../../assets/Icons/back.svg";
import logo from "../../../assets/Icons/cropped_logo.svg";
import VendorInfiniteScrollSelect from '../../Vendor/VendorInfiniteScrollSelect/VendorInfiniteScrollSelect';

const ExpenseLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [vendorId, setVendorId] = useState(null);

    const [currencyId, setCurrencyId] = useState(1);
    const [currency, setCurrency] = useState('AED');

    const [paymentMethod, setPaymentMethod] = useState(null);
    const [paymentMethodType, setPaymentMethodType] = useState("");
    const [paymentMethodId, setPaymentMethodId] = useState(null);
    const [paymentSubcategoryEntry, setPaymentSubcategoryEntry] = useState(null);

    const [categoryId, setCategoryId] = useState(null);
    const [amount, setAmount] = useState(0);
    const [notes, setNotes] = useState("");
    const [expenseDate, setExpenseDate] = useState(moment().format('YYYY-MM-DD'));
    const isAdd = window.location.pathname.split('/')[2] === 'create';

    const { user } = useSelector(state => state.userReducer);
    const { loading: expenseLoading, expense, categories, categoryLoading } = useSelector(state => state.expenseReducer);
    const { loading: vendorLoading, vendorsInf, totalVendors, paymentMethods, paymentMethodSubCategories } = useSelector(state => state.vendorReducer);
    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);

    const filterOption = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    }

    const handleExpenseAccountChange = (value) => {
        setCategoryId(value);
    }

    const onChangeCurrency = (value) => {
        setCurrencyId(value);
        const currency = currencies.find((currency) => currency.currency_id === value);
        setCurrency(currency.currency_abv);
    }

    const handleChangePaymentMethod = (value) => {
        setPaymentMethod(value);
        const paymentMethod = paymentMethods?.find((paymentMethod) => paymentMethod.payment_method_id === value);
        setPaymentMethodType(paymentMethod.description);
        dispatch(readPaymentMethodSubCategories(paymentMethod.description));
        setPaymentSubcategoryEntry("");
        setPaymentMethodId(null);
    }

    const handleChangePaymentSubMethod = (value) => {
        setPaymentMethodId(value);
    }
    const handleChangePaymentSubMethod2 = (value) => {
        setPaymentSubcategoryEntry(value);
        const subCategory = paymentMethodSubCategories?.find((subCategory) => subCategory?.handler_name === value || subCategory?.method_details === value);
        if (subCategory) {
            setPaymentMethodId(subCategory?.bank_id || subCategory?.handler_id || subCategory?.other_method_id);
        } else {

            setPaymentMethodId(null);
        }
    }

    const [vendorKeyword, setVendorKeyword] = useState('');
    const [currrentVendorPage, setCurrrentVendorPage] = useState(1);
    const addPage = (current) => {
        if (vendorLoading) return;
        if ((current - 1) * 20 > totalVendors) return;
        if (currrentVendorPage >= current) return;
        dispatch(getVendorInfiniteScroll(current, false, vendorKeyword));
        setCurrrentVendorPage((prev) => prev + 1);
    }
    useEffect(() => {
        if (vendorKeyword === null) return;
        dispatch(getVendorInfiniteScroll(1, true, vendorKeyword));
        setCurrrentVendorPage(1);
    }, [vendorKeyword, dispatch]);

    const selectBeforeCurrency = (
        <Select
            showSearch
            defaultValue="AED"
            optionFilterProp='children'
            value={currency}
            onChange={onChangeCurrency}
            filterOption={filterOption}
            options={currencies?.map((currency) => ({ value: currency.currency_id, label: currency.currency_abv }))}
            loading={currencyLoading}
        />
    );

    useEffect(() => {
        dispatch(getVendorInfiniteScroll(1, true));
        if (window.location.pathname.split('/')[2] === 'edit') {
            dispatch(getCurrency());
            dispatch(readExpenseCategories());
            dispatch(readPaymentMethod());
            dispatch(getExpenseDetails(window.location.pathname.split('/')[3]));
        }
        if (window.location.pathname.split('/')[2] === 'create') {
            dispatch(getCurrency());
            dispatch(readExpenseCategories());
            dispatch(readPaymentMethod());
        }
    }, [dispatch]);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            if (expense) {
                setExpenseDate(expense.expense_date);
                setCategoryId(expense.sub_category_id);
                setAmount(expense.amount);
                setNotes(expense.notes);
                setCurrencyId(expense.currency_id);
                setCurrency(currencies.find((currency) => currency.currency_id === currencyId).currency_abv);
                setPaymentMethodType(expense.payment_category);
                dispatch(readPaymentMethodSubCategories(expense?.payment_category));
                setPaymentMethod(paymentMethods?.find((paymentMethod) => paymentMethod.description === expense.payment_category).payment_method_id);
                setPaymentMethodId(expense.payment_sub_category_id);
                setVendorId(expense?.vendor?.vendor_id);
                setVendorKeyword(expense.vendor?.vendor_name);
            }
        }
    }, [dispatch, currencies, expense, paymentMethods]);

    useEffect(() => {
        if (paymentMethodSubCategories) {
            setPaymentSubcategoryEntry(paymentMethodSubCategories?.find((subCategory) => subCategory?.bank_id === paymentMethodId || subCategory?.handler_id === paymentMethodId || subCategory?.other_method_id === paymentMethodId)?.bank_name || paymentMethodSubCategories?.find((subCategory) => subCategory?.bank_id === paymentMethodId || subCategory?.handler_id === paymentMethodId || subCategory?.other_method_id === paymentMethodId)?.handler_name || paymentMethodSubCategories?.find((subCategory) => subCategory?.bank_id === paymentMethodId || subCategory?.handler_id === paymentMethodId || subCategory?.other_method_id === paymentMethodId)?.method_details);
        }
    }, [paymentMethodId, paymentMethodSubCategories]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (expenseLoading) {
            return;
        }
        if (expenseDate === null || categoryId === null || amount === null || paymentMethodType === "") {
            toast.error("Please fill all the fields");
            return;
        }
        if (amount <= 0) {
            toast.error("Amount should be greater than 0");
            return;
        }
        const data = {
            vendor_id: vendorId,
            sub_category_id: categoryId,
            currency_id: currencyId,
            payment_method_type: paymentMethodType,
            payment_subcategory_entry: paymentSubcategoryEntry,
            payment_method_id: paymentMethodId,
            amount: amount,
            notes: notes,
            expense_date: expenseDate,
        }
        if (isAdd) {
            dispatch(createExpense(data, null, navigate));
        } else {
            dispatch(updateExpense(data, window.location.pathname.split('/')[3], null, navigate));
        }
    }
    return (
        <>
            <div className='layout__header'>
                <div className='layout__header--left'>
                    <img src={backButton} alt='back' className='layout__header--back-btn' onClick={() => navigate("/expense")} />
                    <h1 className='layout__header--title'> Expenses List </h1>
                </div>
            </div>
            <div className="layout__container">
                <div className="create__layout--main">
                    <div className="create__layout--top">
                        <div style={{ width: "9rem", height: "5rem", overflow: "hidden" }}>
                            <img style={{ width: "100%", height: "100%", objectFit: "contain" }} src={user?.clientInfo?.company_logo_url} alt="logo" />
                        </div>
                        <h1 className='create__payment--head'> Expense </h1>
                    </div>
                    <form className='expense__form'>
                        <div className="create__expense--input">
                            <span className='required__field'>Expense Date</span>
                            <input type="date"
                                name="expenseDate"
                                value={expenseDate}
                                onChange={(e) => setExpenseDate(e.target.value)}
                            />
                        </div>
                        <div className="create__expense--select">
                            <span className='required__field'>Expense Account</span>
                            <Select
                                loading={categoryLoading}
                                placeholder="Select Category"
                                value={categoryId}
                                onChange={handleExpenseAccountChange}
                                options={
                                    categories?.map((category) => {
                                        return {
                                            label: category.category_name,
                                            options: category.subcategories.map((subCategory) => {
                                                return {
                                                    label: subCategory.subcategory_name,
                                                    value: subCategory.subcategory_id
                                                }
                                            })
                                        }
                                    })
                                }
                            />
                        </div>
                        <div className="create__expense--input">
                            <span className='required__field'>Amount</span>
                            <Input type="text" name="amount" addonBefore={selectBeforeCurrency} value={amount}
                                onChange={(e) => {
                                    const valid = e.target.value.match(/^\d*\.?\d{0,2}$/);
                                    if (valid) {
                                        setAmount(e.target.value);
                                    }
                                }}
                            />
                        </div>
                        <div className="create__expense--select">
                            <span className='required__field'>Paid Through</span>
                            <Select
                                placeholder="Select Payment Method"
                                value={paymentMethod}
                                onChange={handleChangePaymentMethod}
                                options={
                                    paymentMethods?.map((payment_method) => {
                                        return {
                                            label: payment_method.method_name,
                                            value: payment_method.payment_method_id
                                        }
                                    })
                                }
                            />
                        </div>
                        {
                            paymentMethod !== null &&
                            (paymentMethodType === "bank" ?
                                <div className="create__expense--select">
                                    <span className='required__field'>Sub Category</span>
                                    <Select
                                        placeholder="Select Payment Category"
                                        value={paymentMethodId}
                                        onChange={handleChangePaymentSubMethod}
                                        options={
                                            paymentMethodSubCategories?.map((payment_method) => {
                                                return {
                                                    label: payment_method.bank_name,
                                                    value: payment_method.bank_id
                                                }
                                            })
                                        }
                                    />
                                </div>
                                :
                                paymentMethodType === "petty_cash" ?
                                    <div className="create__expense--select">
                                        <span className='required__field'>Sub Category</span>
                                        <AutoComplete
                                            placeholder="Select Payment Category"
                                            value={paymentSubcategoryEntry}
                                            onChange={handleChangePaymentSubMethod2}
                                            options={
                                                paymentMethodSubCategories?.map((payment_method) => {
                                                    return {
                                                        value: payment_method.handler_name
                                                    }
                                                })
                                            }
                                        />
                                    </div>
                                    : paymentMethodType === "other" ?
                                        <div className="create__expense--select">
                                            <span className='required__field'>Sub Category</span>
                                            <AutoComplete
                                                placeholder="Select Payment Category"
                                                value={paymentSubcategoryEntry}
                                                onChange={handleChangePaymentSubMethod2}
                                                options={
                                                    paymentMethodSubCategories?.map((payment_method) => {
                                                        return {
                                                            value: payment_method.method_details
                                                        }
                                                    })
                                                }
                                            />
                                        </div> : null
                            )
                        }
                        <div className="create__expense--select">
                            <span>Vendor</span>
                            <VendorInfiniteScrollSelect onChange={(option) => setVendorId(option.vendor_id)} setVendorKeyword={setVendorKeyword} vendorKeyword={vendorKeyword} loadMoreOptions={addPage} />
                        </div>
                        <div className="create__expense--input">
                            <span>Notes</span>
                            <textarea type="text"
                                name="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                        <div className='expense__form--submit-btn'>
                            <button type='submit' onClick={handleSubmit}> Submit </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ExpenseLayout;

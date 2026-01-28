import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import moment from 'moment';
import { getCurrency } from '../../../../Actions/Onboarding';
import { createPDC, getPDCDetails, updatePDC, readPDCStatusList } from '../../../../Actions/PDC';

import { Input, Select } from "antd";
import "../BankLayout.css";
import "../../../../Styles/Layout/LayoutHeader.css";
import "../../../../Styles/Layout/LayoutContainer.css";

const PDC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [bankId, setBankId] = useState(null);
    const [chequeNumber, setChequeNumber] = useState("");
    const [issueDate, setIssueDate] = useState(moment().format('YYYY-MM-DD'));
    const [dueDate, setDueDate] = useState(moment().format('YYYY-MM-DD'));

    const [amount, setAmount] = useState(0);
    const [currencyId, setCurrencyId] = useState(1);
    const [currency, setCurrency] = useState('AED');

    const [pdcStatus, setPDCStatus] = useState(null);
    const [recipientName, setRecipientName] = useState("");
    const [inFavourOf, setInFavourOf] = useState("");
    const [notes, setNotes] = useState("");

    const isAdd = window.location.pathname.split('/')[2] === 'create';

    const { user } = useSelector(state => state.userReducer);
    const { client } = useSelector(state => state.accountantReducer);
    const { loading, statuses, pdc } = useSelector(state => state.pdcReducer);
    const { currencies, currencyLoading } = useSelector(state => state.onboardingReducer);

    const filterOption = (input, option) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    }

    const onChangeCurrency = (value) => {
        setCurrencyId(value);
        const currency = currencies.find((currency) => currency.currency_id === value);
        setCurrency(currency.currency_abv);
    }

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
        dispatch(getCurrency());
        dispatch(readPDCStatusList());
    }, [dispatch]);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            dispatch(getPDCDetails(window.location.pathname.split('/')[3]));
        }
    }, [dispatch]);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            if (pdc) {
                setBankId(pdc?.bank_id);
                setChequeNumber(pdc?.cheque_number);
                setIssueDate(pdc?.issue_date);
                setDueDate(pdc?.due_date);
                setAmount(pdc?.amount);
                setCurrencyId(pdc?.currency_id);
                setPDCStatus(pdc?.pdc_status);
                setRecipientName(pdc?.recipient_name);
                setInFavourOf(pdc?.in_favour_of);
                setNotes(pdc?.notes);
            }
        }
    }, [dispatch, currencies, pdc]);

    const handleSubmitPDC = (e) => {
        e.preventDefault();
        // if (loading) {
        //     toast.warning('Please wait while we are processing your request.');
        //     return;
        // }
        if (bankId === null || chequeNumber === "" || pdcStatus === null || recipientName === "" || inFavourOf === "") {
            toast.error('Please fill all the required fields.');
            return;
        }
        if (amount <= 0) {
            toast.error('Amount must be greater than 0.');
            return;
        }
        const data = {
            bank_id: bankId,
            cheque_number: chequeNumber,
            issue_date: issueDate,
            due_date: dueDate,
            amount: amount,
            currency_id: currencyId,
            pdc_status: pdcStatus,
            recipient_name: recipientName,
            in_favour_of: inFavourOf,
            notes: notes === "" ? null : notes
        }
        if (isAdd) {
            dispatch(createPDC(data, navigate));
        } else {
            dispatch(updatePDC(window.location.pathname.split('/')[3], data, navigate));
        }
    }
    return (
        <form className='banking__form'>
            <div className="create__banking--select">
                <span className='required__field'>Bank Id</span>
                <Select
                    defaultValue={bankId}
                    value={bankId}
                    placeholder='Select Payment Method'
                    onChange={(e) => setBankId(e)}
                    options={[
                        { value: 0, label: 'Cash' },
                        { value: (user?.localInfo?.role ? client : user?.clientInfo)?.primary_bank?.bank_id, label: (user?.localInfo?.role ? client : user?.clientInfo)?.primary_bank?.bank_name },
                        ...((user?.localInfo?.role ? client : user?.clientInfo)?.other_bank_accounts?.map((bank) => ({ value: bank.bank_id, label: bank.bank_name })) ?? [])
                    ]}
                />
            </div>
            <div className="create__banking--input">
                <span className='required__field'>Cheque Number</span>
                <input type='text' placeholder='Cheque Number'
                    name='chequeNumber' value={chequeNumber}
                    onChange={(e) => setChequeNumber(e.target.value)}
                />
            </div>
            <div className="create__banking--input">
                <span className='required__field'>Issue Date</span>
                <input type='date'
                    name='issueDate' value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                />
            </div>
            <div className="create__banking--input">
                <span className='required__field'>Due Date</span>
                <input type='date'
                    name='dueDate' value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            <div className="create__banking--input">
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
            <div className="create__banking--select">
                <span className='required__field'>PDC Status</span>
                <Select
                    defaultValue={pdcStatus}
                    value={pdcStatus}
                    placeholder='Select PDC Status'
                    onChange={(e) => setPDCStatus(e)}
                    options={statuses?.map((status) => ({ value: status.pdc_value, label: status.pdc_value })) ?? []}
                />
            </div>
            <div className="create__banking--input">
                <span className='required__field'>Recipient Name</span>
                <input type='text' placeholder='Recipient Name'
                    name='recipientName' value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                />
            </div>
            <div className="create__banking--input">
                <span className='required__field'>In Favour Of</span>
                <input type='text' placeholder='In Favour Of'
                    name='inFavourOf' value={inFavourOf}
                    onChange={(e) => setInFavourOf(e.target.value)}
                />
            </div>
            <div className="create__banking--input">
                <span>Notes</span>
                <input type='text' placeholder='Notes'
                    name='notes' value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
            <div className='banking__form--submit-btn'>
                <button type='submit' onClick={handleSubmitPDC}> Submit </button>
            </div>
        </form>
    )
}

export default PDC;

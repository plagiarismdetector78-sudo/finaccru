import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {toast} from 'react-toastify';

import {getCurrency} from '../../../../Actions/Onboarding';
import {createBank, getBankDetails, updateBank} from '../../../../Actions/Bank';

import {Select} from "antd";
import "../BankLayout.css";
import "../../../../Styles/Layout/LayoutHeader.css";
import "../../../../Styles/Layout/LayoutContainer.css";

const Banking = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [bankName, setBankName] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [branchName, setBranchName] = useState("");
    const [iban, steIban] = useState("");

    const [currencyId, setCurrencyId] = useState(1);

    const isAdd = window.location.pathname.split('/')[2] === 'create';

    const {loading: bankLoading, bank} = useSelector(state => state.bankReducer);
    const {currencies, currencyLoading} = useSelector(state => state.onboardingReducer);

    useEffect(() => {
        dispatch(getCurrency());
    }, [dispatch]);

    const onChangeCurrency = (value) => {
        setCurrencyId(value);
    }

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            dispatch(getBankDetails(window.location.pathname.split('/')[3]));
        }
    }, [dispatch]);

    useEffect(() => {
        if (window.location.pathname.split('/')[2] === 'edit') {
            if (bank) {
                setBankName(bank?.bank_name);
                setAccountHolderName(bank?.account_holder_name);
                setAccountNumber(bank?.account_number);
                setBranchName(bank?.branch_name);
                steIban(bank?.iban_number);
                setCurrencyId(bank?.currency_id);
            }
        }
    }, [dispatch, currencies, bank]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (bankLoading) {
            return;
        }
        if (bankName === "" || accountHolderName === "" || accountNumber === "" || branchName === "") {
            toast.error("Please fill all the fields correctly.");
            return;
        }
        if (iban.length !== 23) {
            toast.error("IBAN number should contain 23 characters.");
            return;
        }
        const data = {
            bank_name: bankName,
            account_holder_name: accountHolderName,
            account_number: accountNumber,
            iban_number: iban,
            branch_name: branchName,
            currency_id: currencyId
        }
        if (isAdd) {
            dispatch(createBank(data, null, navigate));
        } else {
            dispatch(updateBank(data, window.location.pathname.split('/')[3], null, navigate));
        }
    }

    return (
        <form className='banking__form'>
            <div className="create__banking--input">
                <span className='required__field'>Bank Name</span>
                <input type='text' placeholder='Bank Name'
                       name='bankName' value={bankName}
                       onChange={(e) => setBankName(e.target.value)}
                />
            </div>
            <div className="create__banking--input">
                <span className='required__field'>Account Holder Name</span>
                <input type='text' placeholder='Account Holder Name'
                       name='accountHolderName' value={accountHolderName}
                       onChange={(e) => setAccountHolderName(e.target.value)}
                />
            </div>
            <div className="create__banking--input">
                <span className='required__field'>Account Number</span>
                <input type='text' placeholder='Account Number'
                       name='accountNumber'
                       maxLength={20} value={accountNumber}
                       onChange={(e) => {
                           const number = e.target.value;
                           const numericPhoneNumber = number.replace(/\D/g, '');
                           setAccountNumber(numericPhoneNumber)
                       }}
                />
            </div>
            <div className="create__banking--input">
                <span className='required__field'>IBAN Number</span>
                <input type='text' placeholder='IBAN Number'
                       name='iban'
                       maxLength={23} value={iban}
                       onChange={(e) => steIban(e.target.value)}
                />
            </div>
            <div className="create__banking--input">
                <span className='required__field'>Branch Name</span>
                <input type='text' placeholder='Branch Name'
                       name='branchName' value={branchName}
                       onChange={(e) => setBranchName(e.target.value)}
                />
            </div>
            <div className="create__banking--select">
                <span className='required__field'>Currency</span>
                <Select
                    loading={currencyLoading}
                    placeholder="Select Currency"
                    value={currencyId}
                    onChange={onChangeCurrency}
                    options={
                        currencies?.map((currency) => {
                            return {
                                label: `${currency.currency_name} (${currency.currency_abv})`,
                                value: currency.currency_id
                            }
                        })
                    }
                />
            </div>
            <div className='banking__form--submit-btn'>
                <button type='submit' onClick={handleSubmit}> Submit</button>
            </div>
        </form>
    )
}

export default Banking;

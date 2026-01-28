import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getBankDetails } from '../../../../Actions/Bank';
import { getCurrency } from '../../../../Actions/Onboarding';

import '../../../../Styles/Read.css';

const BankingRead = () => {
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.userReducer);
    const { loading, bank } = useSelector(state => state.bankReducer);
    const { currencies } = useSelector(state => state.onboardingReducer);

    const bank_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;

    const currency = {
        abv: currencies?.find(currency => currency.currency_id === bank?.currency_id)?.currency_abv,
        full: currencies?.find(currency => currency.currency_id === bank?.currency_id)?.currency_name,
        id: currencies?.find(currency => currency.currency_id === bank?.currency_id)?.currency_id,
    }

    useEffect(() => {
        dispatch(getCurrency());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getBankDetails(bank_id, user?.localInfo?.role));
    }, [dispatch, bank_id, user?.localInfo?.role, client_id]);

    return (
        <form className='banking__form'>
            <div className="create__banking--input">
                <span>Bank Name</span>
                <input value={bank?.bank_name} disabled />
            </div>
            <div className="create__banking--input">
                <span>Account Holder Name</span>
                <input value={bank?.account_holder_name} disabled />
            </div>
            <div className="create__banking--input">
                <span>Account Number</span>
                <input value={bank?.account_number} disabled />
            </div>
            <div className="create__banking--input">
                <span>IBAN Number</span>
                <input value={bank?.iban_number} disabled />
            </div>
            <div className="create__banking--input">
                <span>Branch Name</span>
                <input value={bank?.branch_name} disabled />
            </div>
            <div className="create__banking--input">
                <span>Currency</span>
                <input value={`${currency?.full} (${currency?.abv})`} disabled />
            </div>
        </form>
    );
}

export default BankingRead;
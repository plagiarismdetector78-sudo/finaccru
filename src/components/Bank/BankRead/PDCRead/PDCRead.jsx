import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getPDCDetails } from '../../../../Actions/PDC';
import { getCurrency } from '../../../../Actions/Onboarding';

import '../../../../Styles/Read.css';

const PDCRead = () => {
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.userReducer);
    const { loading, pdc } = useSelector(state => state.pdcReducer);
    const { currencies } = useSelector(state => state.onboardingReducer);

    const pdc_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;

    useEffect(() => {
        dispatch(getCurrency());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getPDCDetails(pdc_id, user?.localInfo?.role));
    }, [dispatch, pdc_id, user?.localInfo?.role, client_id]);

    return (
        <form className='banking__form'>
            <div className="create__banking--input">
                <span>Bank Id</span>
                <input type='text'
                    value={
                        pdc?.bank_id === 0 ?
                            "Cash" :
                            pdc?.bank_id === user?.clientInfo?.primary_bank?.bank_id ?
                                user?.clientInfo?.primary_bank?.bank_name :
                                user?.clientInfo?.other_bank_accounts?.find((bank) => bank.bank_id === pdc?.bank_id)?.bank_name
                    }
                    disabled
                />
            </div>
            <div className="create__banking--input">
                <span>Cheque Number</span>
                <input type='text'
                    value={pdc?.cheque_number}
                    disabled
                />
            </div>
            <div className="create__banking--input">
                <span>Issue Date</span>
                <input type='date'
                    value={pdc?.issue_date}
                    disabled
                />
            </div>
            <div className="create__banking--input">
                <span>Due Date</span>
                <input type='date'
                    value={pdc?.due_date}
                    disabled
                />
            </div>
            <div className="create__banking--input">
                <span>Amount</span>
                <input type='text'
                    value={`${currencies?.find(currency => currency.currency_id === pdc?.currency_id)?.currency_abv} ${new Intl.NumberFormat('en-US', {}).format(parseFloat(pdc?.amount || 0.00).toFixed(2))}`}
                    disabled
                />
            </div>
            <div className="create__banking--input">
                <span>PDC Status</span>
                <input type='text'
                    value={pdc?.pdc_status}
                    disabled
                />
            </div>
            <div className="create__banking--input">
                <span>Recipient Name</span>
                <input type='text'
                    value={pdc?.recipient_name}
                    disabled
                />
            </div>
            <div className="create__banking--input">
                <span>In Favour Of</span>
                <input type='text'
                    value={pdc?.in_favour_of}
                    disabled
                />
            </div>
            <div className="create__banking--input">
                <span>Notes</span>
                <input type='text'
                    value={pdc?.notes}
                    disabled
                />
            </div>
        </form>
    );
}

export default PDCRead;
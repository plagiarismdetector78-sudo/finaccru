import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getExpenseDetails } from '../../../Actions/Expense';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import { readAccountantClient } from '../../../Actions/Accountant';

import '../../../Styles/Read.css';
import backButton from "../../../assets/Icons/back.svg"

import moment from "moment";
import Loader from '../../Loader/Loader';
import ViewHeader from '../../../Shared/ViewHeader/ViewHeader';
import ViewFooter from '../../../Shared/ViewFooter/ViewFooter';

const ExpenseRead = () => {
    const { user } = useSelector(state => state.userReducer);
    const { loading, expense } = useSelector(state => state.expenseReducer);
    const { currencies } = useSelector(state => state.onboardingReducer);

    const expense_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const jr_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[2] : 0;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getTaxRate());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getExpenseDetails(expense_id, user?.localInfo?.role));
        if (user?.localInfo?.role) {
            dispatch(readAccountantClient(client_id));
        }
    }, [dispatch, expense_id, user?.localInfo?.role, client_id]);

    return (
        <>
            <div className='read__header'>
                <div className='read__header--left'>
                    <img src={backButton} alt='back' className='read__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : "/expense"}`)} />
                    <h1 className='read__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Expenses List'}
                    </h1>
                </div>
                <div className='read__header--right'>
                    <a className='read__header--btn1'
                        onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : ""}/expense/edit/${expense?.expense_id}`)}
                    >Edit
                    </a>
                </div>
            </div>
            <div className="read__container">
                {loading ? <Loader /> :
                    <div className="read--main" id="read--main">
                        <ViewHeader title={"Expense"} logo={user?.clientInfo?.company_logo_url}/>
                        <form className='expense__form'>
                            <div className="create__expense--input">
                                <span>Expense Date</span>
                                <input value={moment(expense?.expense_date).format("DD-MM-YYYY")} disabled />
                            </div>
                            <div className="create__expense--input">
                                <span>Expense Account</span>
                                <input value={expense?.sub_category_name} disabled />
                            </div>
                            <div className="create__expense--input">
                                <span>Amount</span>
                                <input value={`${currencies?.find(currency => currency.currency_id === expense?.currency_id)?.currency_abv} ${new Intl.NumberFormat('en-US', {}).format(parseFloat(expense?.amount || 0.00).toFixed(2))}`} disabled />
                            </div>
                            <div className="create__expense--input">
                                <span>Paid Through</span>
                                <input value={expense?.payment_category} disabled />
                            </div>
                            <div className="create__expense--input">
                                <span>Sub Category</span>
                                <input value={expense?.payment_sub_category} disabled />
                            </div>
                            <div className="create__expense--input">
                                <span>Vendor</span>
                                <input value={expense?.vendor?.vendor_name} disabled />
                            </div>
                            <div className="create__expense--input">
                                <span>Notes</span>
                                <input value={expense?.notes} disabled />
                            </div>
                        </form>
                        <ViewFooter />
                    </div>
                }
            </div>
        </>
    )
}

export default ExpenseRead;

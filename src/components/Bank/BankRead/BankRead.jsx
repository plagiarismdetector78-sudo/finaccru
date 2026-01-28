import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import '../../../Styles/Read.css';
import backButton from "../../../assets/Icons/back.svg"
import { Tabs } from 'antd';

import ViewHeader from '../../../Shared/ViewHeader/ViewHeader';
import ViewFooter from '../../../Shared/ViewFooter/ViewFooter';
import BankingRead from './BankingRead/BankingRead';
import PDCRead from './PDCRead/PDCRead';
import Statement from './Statement/Statement';

const BankRead = () => {
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get('type');

    const { user } = useSelector(state => state.userReducer);

    const bank_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const jr_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[2] : 0;

    const items = [
        {
            key: '1',
            label: 'Details',
            children: <>
                <div className="read__container">
                    <div className="read--main2" id="read--main">
                        <ViewHeader title={type} logo={user?.clientInfo?.company_logo_url}/>
                        {
                            type == "bank" ?
                                <BankingRead /> : <PDCRead />
                        }
                        <ViewFooter />
                    </div>
                </div>
            </>,
        },
        {
            key: '2',
            label: type === "pdc" ? "" : "Statement",
            children: <Statement bank_id={bank_id} />,
            disabled: type === "pdc" ? true : false,
        },
    ];

    return (
        <>
            <div className='read__header'>
                <div className='read__header--left'>
                    <img src={backButton} alt='back' className='read__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : "/bank"}`)} />
                    <h1 className='read__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Banks List'}
                    </h1>
                </div>
                <div className='read__header--right'>
                    <a className='read__header--btn1'
                        onClick={() => {
                            navigate(`${user?.localInfo?.role === 2 ?
                                `/jr/${jr_id}/clients/${client_id}` :
                                user?.localInfo?.role === 1 ?
                                    `/clients/${client_id}` :
                                    ""
                                }/bank/edit/${bank_id}?type=${type === "bank" ? "bank" : "pdc"}`)
                        }}
                    >Edit
                    </a>
                </div>
            </div>
            <div className='read__customer--main2'>
                <div className="read__customer--tabs2">
                    <Tabs defaultActiveKey="1" items={items} />
                </div>
            </div>
        </>
    )
}

export default BankRead;

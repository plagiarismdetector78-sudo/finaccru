import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getEstimateList } from '../../../../Actions/Estimate';
import { getProformaList } from '../../../../Actions/Proforma';
import { getTaxInvoiceList } from '../../../../Actions/TaxInvoice';
import { getPaymentsList } from '../../../../Actions/Payment';
import { getCreditNoteList } from '../../../../Actions/CreditNote';

import TableCard from '../../../../Shared/TableCard/TableCard';

import creditNoteColumns from '../../../../Columns/CreditNote';
import estimateColumns from '../../../../Columns/Estimate';
import performaColumns from '../../../../Columns/Proforma';
import paymentColumns from '../../../../Columns/Payment';
import taxInvoiceColumns from '../../../../Columns/TaxInvoice';

import { Collapse } from 'antd';

const CustomerTransactions = ({ customer_id }) => {
    const dispatch = useDispatch();
    
    const { loading: loadingEstimate, estimates } = useSelector((state) => state.estimateReducer);
    const { loading: loadingProforma, proformas } = useSelector((state) => state.proformaReducer);
    const { loading: loadingInvoice, taxInvoices } = useSelector((state) => state.taxInvoiceReducer);
    const { loading: loadingPayment, payments } = useSelector((state) => state.paymentReducer);
    const { loading: loadingCreditNote, creditNotes } = useSelector((state) => state.creditNoteReducer);
    
    useEffect(() => {
        dispatch(getEstimateList(1, "", customer_id));
    }, [dispatch, customer_id]);
    
    const items = [
        {
            key: "1",
            label: 'Estimates',
            children: <TableCard columns={estimateColumns()} dispatch={dispatch} loading={loadingEstimate} items={estimates} getList={getEstimateList} customer_id={customer_id} />,
        },
        {
            key: "2",
            label: 'Proforma Invoices',
            children: <TableCard columns={performaColumns()} dispatch={dispatch} loading={loadingProforma} items={proformas} getList={getProformaList} customer_id={customer_id} />,
        },
        {
            key: "3",
            label: 'Tax Invoices',
            children: <TableCard columns={taxInvoiceColumns()} dispatch={dispatch} loading={loadingInvoice} items={taxInvoices} getList={getTaxInvoiceList} customer_id={customer_id} />,
        },
        {
            key: "4",
            label: 'Payments',
            children: <TableCard columns={paymentColumns()} dispatch={dispatch} loading={loadingPayment} items={payments} getList={getPaymentsList} customer_id={customer_id} />,
        },
        {
            key: "5",
            label: 'Credit Notes',
            children: <TableCard columns={creditNoteColumns()} dispatch={dispatch} loading={loadingCreditNote} items={creditNotes} getList={getCreditNoteList} customer_id={customer_id} />,
        },
    ];
    const handleCollapseChange = (keys) => {
        keys.forEach((key) => {
            if (key === "1") {
                dispatch(getEstimateList(1, "", customer_id));
            }
            if (key === "2") {
                dispatch(getProformaList(1, "", customer_id));
            }
            if (key === "3") {
                dispatch(getTaxInvoiceList(1, "", customer_id));
            }
            if (key === "4") {
                dispatch(getPaymentsList(1, "", customer_id));
            }
            if (key === "5") {
                dispatch(getCreditNoteList(1, "", customer_id));
            }
        });
    };
    return (
        <div className="read__customer--transaction">
            {
                items?.map((item, index) => (
                    <div className='read__customer--transaction-collapse' key={index}>
                        <Collapse
                            items={[item]}
                            defaultActiveKey={["1"]}
                            onChange={handleCollapseChange}
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default CustomerTransactions;

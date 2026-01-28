import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getPurchaseOrderList } from '../../../../Actions/PurchaseOrder';
import { getExpenseList } from '../../../../Actions/Expense';
import { getBillList } from '../../../../Actions/Bill';
import { getBillPaymentList } from '../../../../Actions/BillPayment';
import { getDebitNoteList } from '../../../../Actions/DebitNote';

import TableCard from '../../../../Shared/TableCard/TableCard';

import purchaseOrderColumns from '../../../../Columns/PurchaseOrder';
import expenseColumns from '../../../../Columns/Expense';
import billColumns from '../../../../Columns/Bill';
import billPaymentColumns from '../../../../Columns/BillPayment';
import debitNoteColumns from '../../../../Columns/DebitNote';

import { Collapse } from 'antd';

const VendorTransactions = ({ vendor_id }) => {
    const dispatch = useDispatch();
    
    const { loading: loadingPurchaseOrder, purchaseOrders } = useSelector((state) => state.purchaseOrderReducer);
    const { loading: loadingExpense, expenses } = useSelector((state) => state.expenseReducer);
    const { loading: loadingBill, bills } = useSelector((state) => state.billReducer);
    const { loading: loadingBillPayment, billPayments } = useSelector((state) => state.billPaymentReducer);
    const { loading: loadingDebitNote, debitNotes } = useSelector((state) => state.debitNoteReducer);

    useEffect(() => {
        dispatch(getPurchaseOrderList(1, "", vendor_id));
    }, [dispatch, vendor_id]);

    const items = [
        {
            key: "1",
            label: 'Purchase Orders',
            children: <TableCard columns={purchaseOrderColumns()} dispatch={dispatch} loading={loadingPurchaseOrder} items={purchaseOrders} getList={getPurchaseOrderList} vendor_id={vendor_id} />,
        },
        {
            key: "2",
            label: 'Expenses',
            children: <TableCard columns={expenseColumns()} dispatch={dispatch} loading={loadingExpense} items={expenses} getList={getExpenseList} vendor_id={vendor_id} />,
        },
        {
            key: "3",
            label: 'Bills',
            children: <TableCard columns={billColumns()} dispatch={dispatch} loading={loadingBill} items={bills} getList={getBillList} vendor_id={vendor_id} />,
        },
        {
            key: "4",
            label: 'Bill Payments',
            children: <TableCard columns={billPaymentColumns()} dispatch={dispatch} loading={loadingBillPayment} items={billPayments} getList={getBillPaymentList} vendor_id={vendor_id} />,
        },
        {
            key: "5",
            label: 'Debit Notes',
            children: <TableCard columns={debitNoteColumns()} dispatch={dispatch} loading={loadingDebitNote} items={debitNotes} getList={getDebitNoteList} vendor_id={vendor_id} />,
        },
    ];
    
    const handleCollapseChange = (keys) => {
        keys.forEach((key) => {
            if (key === "1") {
                dispatch(getPurchaseOrderList(1, "", vendor_id));
            }
            if (key === "2") {
                dispatch(getBillList(1, "", vendor_id));
            }
            if (key === "3") {
                dispatch(getExpenseList(1, "", vendor_id));
            }
            if (key === "4") {
                dispatch(getBillPaymentList(1, "", vendor_id));
            }
            if (key === "5") {
                dispatch(getDebitNoteList(1, "", vendor_id));
            }
        });
    };

    return (
        <div className="read__vendor--transaction">
            {
                items?.map((item, index) => (
                    <div className='read__vendor--transaction-collapse' key={index}>
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

export default VendorTransactions;

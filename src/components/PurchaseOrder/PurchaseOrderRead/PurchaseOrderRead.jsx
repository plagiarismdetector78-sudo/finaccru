import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getPurchaseOrderDetails, markPurchaseOrderVoid, markPurchaseOrderSent } from '../../../Actions/PurchaseOrder';
import { getCurrency, getTaxRate } from '../../../Actions/Onboarding';
import { readAccountantClient } from '../../../Actions/Accountant';

import Loader from '../../Loader/Loader';

import '../../../Styles/Read.css';
import backButton from "../../../assets/Icons/back.svg"

import PdfDownload from '../../../Shared/PdfDownload/PdfDownload';

// Read Parts
import ReadFrom from '../../../Shared/PurchaseModule/ReadFrom/ReadFrom';
import { styles as headStyles } from '../../../Styles/PurchaseModule/ReadFrom';
import ReadFor from '../../../Shared/ReadFor/ReadFor';
import { styles as forStyles } from '../../../Styles/ReadFor';
import ReadMeta from '../../../Shared/ReadMeta/ReadMeta';
import { styles as metaStyles } from '../../../Styles/ReadMeta';
import LineItem from '../../../Shared/LineItem/LineItem';
import { styles as lineItemStyles } from '../../../Styles/LineItem';
import ReadNotes from '../../../Shared/PurchaseModule/ReadNotes/ReadNotes';
import { styles as bankStyles } from '../../../Styles/PurchaseModule/ReadNotes';
import ReadTax from '../../../Shared/ReadTax/ReadTax';
import { styles as taxStyles } from '../../../Styles/ReadTax';

import calculateTotalAmounts from '../../../utils/calculateTotalAmounts';
import PurchaseReadContent from '../../../utils/PurchaseReadContent';
import ViewHeader from '../../../Shared/ViewHeader/ViewHeader';
import ViewFooter from '../../../Shared/ViewFooter/ViewFooter';
// import { setChatDocument } from '../../../Actions/Chat';

const PurchaseOrderRead = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.userReducer);
    const { client } = useSelector(state => state.accountantReducer);
    const { loading, purchaseOrder } = useSelector(state => state.purchaseOrderReducer);
    const { taxRates } = useSelector(state => state.onboardingReducer);

    const po_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[7] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[5] : window.location.pathname.split('/')[3];
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const jr_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[2] : 0;

    const [itemTotal, setItemTotal] = useState([]);
    const [itemTax, setItemTax] = useState([]);
    const [groupedItems, setGroupedItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const { currencies } = useSelector(state => state.onboardingReducer);

    useEffect(() => {
        dispatch(getCurrency());
        dispatch(getTaxRate());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getPurchaseOrderDetails(po_id, user?.localInfo?.role));
        if (user?.localInfo?.role) {
            dispatch(readAccountantClient(client_id));
        }
    }, [dispatch, po_id, client_id, user?.localInfo?.role]);

    useEffect(() => {
        const amount = calculateTotalAmounts(purchaseOrder?.line_items, setSubTotal, setDiscount, setTax, setTotal, setItemTax, taxRates);
        setItemTotal(amount);
    }, [purchaseOrder, taxRates]);

    useEffect(() => {
        const groupedByTaxId = purchaseOrder?.line_items?.reduce((acc, item, index) => {
            const existingGroup = acc.find((group) => group.tax_id === item.tax_id);
            if (existingGroup) {
                existingGroup.taxable_amount += (itemTotal?.at(index) - itemTax?.at(index));
                existingGroup.tax_amount += (itemTax?.at(index));
                existingGroup.total_amount += (itemTotal?.at(index));
            } else {
                const taxItem = taxRates?.find((tr) => tr.tax_rate_id === item.tax_id);
                acc.push({
                    tax_id: item.tax_id,
                    tax_rate_name: taxItem.tax_rate_name,
                    taxable_amount: (itemTotal?.at(index) - itemTax?.at(index)),
                    tax_amount: (itemTax?.at(index)),
                    total_amount: (itemTotal?.at(index)),
                });
            }
            return acc;
        }, []);

        setGroupedItems(groupedByTaxId);
    }, [itemTotal, itemTax, purchaseOrder, taxRates]);

    const [clientData, setClientData] = useState({});
    useEffect(() => {
        if (user?.localInfo?.role) {
            setClientData({ clientInfo: client });
        } else {
            setClientData(user);
        }
    }, [user, client]);
    const contents = PurchaseReadContent("Purchase Order", purchaseOrder, clientData, currencies, taxRates, itemTax, itemTotal, subTotal, discount, tax, total, groupedItems);

    return (
        <>
            <div className='read__header'>
                <div className='read__header--left'>
                    <img src={backButton} alt='back' className='read__header--back-btn' onClick={() => navigate(`${user?.localInfo?.role === 2 ? `/jr/${jr_id}/clients/${client_id}` : user?.localInfo?.role === 1 ? `/clients/${client_id}` : "/purchase-order"}`)} />
                    <h1 className='read__header--title'>
                        {user?.localInfo?.role ? 'Go Back' : 'Purchase Orders List'}
                    </h1>
                </div>
                <div className='read__header--right'>
                    {
                        purchaseOrder?.po_status === "Draft" ?
                            <a className='read__header--btn1'
                                onClick={() => {
                                    dispatch(markPurchaseOrderSent(po_id))
                                }}
                            >
                                Mark as Sent
                            </a>
                            : purchaseOrder?.po_status === "Sent" ?
                                <a className='read__header--btn1'
                                    onClick={() => {
                                        dispatch(markPurchaseOrderVoid(po_id))
                                    }}
                                >
                                    Mark as Void
                                </a>
                                :
                                ""
                    }
                    {
                        purchaseOrder?.po_status === "Converted" ? "" :
                            purchaseOrder?.po_status === "Void" ? "" :
                                <a className='read__header--btn1' onClick={() => navigate(`/purchase-order/edit/${purchaseOrder?.po_id}`)}>Edit</a>
                    }
                    <PdfDownload contents={contents} heading={"Purchase Order"} name={purchaseOrder?.po_number} logo={user?.clientInfo?.company_logo_url}/>
                </div>
            </div>
            <div className="read__container">
                {loading ? <Loader /> :
                    <div className="read--main" id="read--main">
                        <ViewHeader title={"Purchase Order"} logo={user?.clientInfo?.company_logo_url} />
                        <ReadFrom
                            title={"Purchase Order"}
                            styles={headStyles}
                            address_line_1={user?.localInfo?.role ? client?.company_data?.address_line_1 : user?.clientInfo?.company_data?.address_line_1}
                            address_line_2={user?.localInfo?.role ? client?.company_data?.address_line_2 : user?.clientInfo?.company_data?.address_line_2}
                            address_line_3={user?.localInfo?.role ? client?.company_data?.address_line_3 : user?.clientInfo?.company_data?.address_line_3}
                            company_name={user?.localInfo?.role ? client?.company_data?.company_name : user?.clientInfo?.company_data?.company_name}
                            country={user?.localInfo?.role ? client?.company_data?.country : user?.clientInfo?.company_data?.country}
                            state={user?.localInfo?.role ? client?.company_data?.state : user?.clientInfo?.company_data?.state}
                            vat_trn={user?.clientInfo?.company_data?.vat_trn}
                            corporate_tax_trn={user?.clientInfo?.company_data?.corporate_tax_trn}
                            number={purchaseOrder?.po_number}
                            date={purchaseOrder?.order_date}
                            expected_delivery_date={purchaseOrder?.expected_delivery_date}
                        />
                        <ReadFor
                            title={"Purchase Order"}
                            styles={forStyles}
                            vendor_name={purchaseOrder?.vendor?.vendor_name}
                            billing_address_line_1={purchaseOrder?.vendor?.billing_address_line_1}
                            billing_address_line_2={purchaseOrder?.vendor?.billing_address_line_2}
                            billing_address_line_3={purchaseOrder?.vendor?.billing_address_line_3}
                            billing_state={purchaseOrder?.vendor?.billing_state}
                            billing_country={purchaseOrder?.vendor?.billing_country}
                            shipping_address_line_1={purchaseOrder?.vendor?.shipping_address_line_1}
                            shipping_address_line_2={purchaseOrder?.vendor?.shipping_address_line_2}
                            shipping_address_line_3={purchaseOrder?.vendor?.shipping_address_line_3}
                            shipping_state={purchaseOrder?.vendor?.shipping_state}
                            shipping_country={purchaseOrder?.vendor?.shipping_country}
                            trn={purchaseOrder?.vendor?.trn}
                        />
                        <ReadMeta
                            styles={metaStyles}
                            currency_abv={currencies?.find((currency) => currency.currency_id === purchaseOrder?.currency_id)?.currency_abv}
                            currency_conversion_rate={purchaseOrder?.currency_conversion_rate}
                            subject={purchaseOrder?.subject}
                        />
                        <div className='read__items'>
                            {purchaseOrder?.line_items?.map((item, index) => (
                                <LineItem styles={lineItemStyles} key={index} index={index}
                                    item_name={item?.item_name} unit={item?.unit} qty={item?.qty} rate={item?.rate}
                                    discount={item?.discount} is_percentage_discount={item?.is_percentage_discount}
                                    tax_id={item?.tax_id} taxRateName={taxRates?.find((tax) => tax.tax_rate_id === item?.tax_id)?.tax_rate_name}
                                    taxAmount={itemTax && itemTax[index]} amount={itemTotal && itemTotal[index]}
                                    description={item?.description}
                                />
                            ))}
                        </div>
                        <ReadNotes
                            styles={bankStyles}
                            currency_abv={currencies?.find((currency) => currency.currency_id === purchaseOrder?.currency_id)?.currency_abv}
                            notes={purchaseOrder?.notes}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                        />
                        <ReadTax
                            styles={taxStyles}
                            currency_abv={currencies?.find((currency) => currency.currency_id === purchaseOrder?.currency_id)?.currency_abv}
                            currency_conversion_rate={purchaseOrder?.currency_conversion_rate}
                            subTotal={subTotal} discount={discount} tax={tax} total={total}
                            groupedItems={groupedItems} terms_and_conditions={purchaseOrder?.terms_and_conditions}
                        />
                        <ViewFooter />
                    </div>
                }
            </div>
        </>
    )
}

export default PurchaseOrderRead;

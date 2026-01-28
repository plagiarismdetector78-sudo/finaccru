import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { getUnit } from '../../../../Actions/Unit';
import { getTaxRate } from '../../../../Actions/Onboarding';

import calculateTotalAmounts from '../../../../utils/calculateTotalAmounts';
import "../../../../Styles/Layout/LayoutP2.css";
import "../../../../Styles/Layout/LayoutListItems.css";

import { PlusOutlined } from '@ant-design/icons';
import { Input, Select, AutoComplete } from 'antd';
import MinusIcon from '../../../../assets/Icons/minus.svg'
const { TextArea } = Input;
const { Option } = Select;

const PuchaseOrderLayoutP2 = ({ items, setItems, notes, setNotes, currency }) => {
    const { units, loading: unitLoading } = useSelector(state => state.unitReducer);
    const { taxRates, taxRateLoading } = useSelector(state => state.onboardingReducer);

    const [showDescription, setShowDescription] = useState([]);

    const [itemTotal, setItemTotal] = useState([]);
    const [itemTax, setItemTax] = useState([]);

    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const [allUnits, setAllUnits] = useState([]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUnit());
        dispatch(getTaxRate());
    }, [dispatch]);

    useEffect(() => {
        setAllUnits(units);
    }, [units, unitLoading]);

    const handleUnitSearch = (value) => {
        let res = [];
        if (!value || value.indexOf('@') >= 0) {
            res = units;
        } else {
            res = units?.filter((unit) => unit.unit_name.toLowerCase().includes(value.toLowerCase()));
        }
        setAllUnits(res);
    };

    const handleInputChange = (index, key, value) => {
        const updatedItems = items?.map((item) => ({ ...item }));
        updatedItems[index][key] = value;
        setItems(updatedItems);
    };

    const handleAddDescription = (index, event) => {
        event.preventDefault();
        const updatedShowDescription = [...showDescription];
        updatedShowDescription[index] = true;
        setShowDescription(updatedShowDescription);
    };

    const handleRemoveDescription = (index, e) => {
        e.preventDefault();
        const updatedShowDescription = [...showDescription];
        updatedShowDescription[index] = false;
        setShowDescription(updatedShowDescription);
        const updatedItems = [...items];
        updatedItems[index].description = '';
        setItems(updatedItems);
    };

    const handleAddPerson = (event) => {
        event.preventDefault();
        setItems([...items, { item_name: '', unit: '', qty: null, rate: null, discount: 0, is_percentage_discount: true, tax_id: 1, description: null }]);
        setShowDescription([...showDescription, false]);
    };

    const handleRemovePerson = (index, event) => {
        event.preventDefault();
        const updatedItems = items.filter((_, i) => i !== index);
        const updatedShowDescription = showDescription.filter((_, i) => i !== index);
        setItems(updatedItems);
        setShowDescription(updatedShowDescription);
    };

    useEffect(() => {
        const amount = calculateTotalAmounts(items, setSubTotal, setDiscount, setTax, setTotal, setItemTax, taxRates);
        setItemTotal(amount);
    }, [items, taxRates]);

    return (
        <>
            <div className='layout__items'>
                {items?.map((item, index) => (
                    <div className='layout__items--main' key={index}>
                        <div className='layout__items--whole-item'>
                            <div className='layout__items--itemName'>
                                {index === 0 ? <span className='required__field' style={{ marginBottom: '1rem' }}>Item Name</span> : <></>}
                                <Input
                                    type='text'
                                    placeholder='Item Name'
                                    value={item?.item_name}
                                    defaultValue={item?.item_name}
                                    style={{
                                        width: 110,
                                    }}
                                    onChange={(e) => handleInputChange(index, 'item_name', e.target.value)}
                                />
                            </div>
                            <div className='layout__items--unitSelect'>
                                {index === 0 ? <span className='required__field' style={{ marginBottom: '1rem' }}>Unit</span> : <></>}
                                <AutoComplete
                                    options={allUnits?.map((unit) => ({
                                        label: unit.unit_name,
                                        value: unit.unit_name,
                                    }))
                                    }
                                    style={{
                                        width: 100,
                                    }}
                                    value={item?.unit}
                                    defaultValue={item?.unit}
                                    onSearch={handleUnitSearch}
                                    onChange={(value) => handleInputChange(index, 'unit', value)}
                                    placeholder="Unit"
                                />
                            </div>
                            <div className='layout__items--number-item'>
                                {index === 0 ? <span className='required__field' style={{ marginBottom: '1rem', marginLeft: '3px' }}>Qty</span> : <></>}
                                <Input
                                    type="number"
                                    placeholder="Quantity"
                                    value={item?.qty}
                                    defaultValue={item?.qty}
                                    style={{
                                        width: 70
                                    }}
                                    onChange={(e) => {
                                        const valid = e.target.value.match(/^\d*\.?\d{0,2}$/);
                                        if (valid) {
                                            handleInputChange(index, 'qty', e.target.value);
                                        }
                                    }}
                                />
                            </div>
                            <div className='layout__items--number-item'>
                                {index === 0 ? <span className='required__field' style={{ marginBottom: '1rem', marginLeft: '3px' }}>Rate</span> : <></>}
                                <Input
                                    type="number"
                                    placeholder="Rate"
                                    value={item?.rate ? parseFloat(item?.rate).toFixed(2) : ''} 
                                    defaultValue={item?.rate ? parseFloat(item?.rate).toFixed(2) : ''}
                                    style={{
                                        width: 70
                                    }}
                                    onChange={(e) => {
                                        const valid = e.target.value.match(/^\d*\.?\d{0,2}$/);
                                        if (valid) {
                                            handleInputChange(index, 'rate',parseFloat(e.target.value).toFixed(2));
                                        }
                                    }}
                                   
                                />
                            </div>
                            <div className='layout__items--discount'>
                                {index === 0 ? <span style={{ marginBottom: '1rem', marginLeft: '3px' }}>Discount</span> : <></>}
                                <Input
                                    type="number"
                                    placeholder="Discount"
                                    value={item?.discount? parseFloat(item?.discount).toFixed(2) : ''}
                                    defaultValue={item?.discount? parseFloat(item?.discount).toFixed(2) : ''}
                                    style={{
                                        width: 100
                                    }}
                                    addonAfter={
                                        <Select
                                            onChange={(value) => {
                                                handleInputChange(index, 'is_percentage_discount', value);
                                            }}
                                            defaultValue={item?.is_percentage_discount}
                                            value={item?.is_percentage_discount}
                                            style={{
                                                width: 40,
                                                padding: 0
                                            }}
                                        >
                                            <Option style={{ padding: '0.3rem 0rem 0.2rem 0.5rem' }} value={true}>%</Option>
                                            <Option style={{ padding: '0.5rem 0rem 0.2rem 0.7rem' }} value={false}>$</Option>
                                        </Select>
                                    }
                                    onChange={(e) => {
                                        const valid = e.target.value.match(/^\d*\.?\d{0,2}$/);
                                        if (valid) {
                                            handleInputChange(index, 'discount', e.target.value)
                                        }
                                    }}
                                />
                            </div>
                            <div className='layout__items--tax'>
                                {index === 0 ? <span style={{ marginBottom: '0.9rem' }}>Tax</span> : <></>}
                                <Input
                                    type="number"
                                    placeholder="Tax"
                                    value={itemTax[index]?parseFloat(itemTax[index]).toFixed(2):''}
                                    defaultValue={itemTax[index]?parseFloat(itemTax[index]).toFixed(2):''}
                                    disabled={true}
                                    className={item?.tax_id === 1 ? 'tax__select--standard' : 'tax__select--non-standard'}
                                    addonAfter={
                                        <Select
                                            onChange={(value) => {
                                                handleInputChange(index, 'tax_id', value);
                                            }}
                                            defaultValue={item?.tax_id}
                                            value={item?.tax_id}
                                            loading={taxRateLoading}
                                        >
                                            {
                                                taxRates?.map((taxRate) => (
                                                    <Option key={taxRate.tax_rate_id} value={taxRate.tax_rate_id}>
                                                        {taxRate.tax_rate_name == 'Standard Rated (5%)' ? '(5%)' : taxRate.tax_rate_name}
                                                    </Option>
                                                ))
                                            }
                                        </Select>
                                    }
                                    onChange={(e) => {
                                        const valid = e.target.value.match(/^\d*\.?\d{0,2}$/);
                                        if (valid) {
                                            handleInputChange(index, 'discount', e.target.value)
                                        }
                                    }}
                                />
                            </div>
                            <div className='layout__items--amount'>
                                {index === 0 ? <span style={{ marginBottom: '1rem' }}>Amount</span> : <></>}
                                <Input
                                    type='text'
                                    value={(itemTotal[index] ? itemTotal[index] : 0).toFixed(2)}
                                    defaultValue={(itemTotal[index] ? itemTotal[index] : 0).toFixed(2)}
                                    disabled={true}
                                    style={{
                                        width: 90
                                    }}
                                />
                            </div>
                            {items.length > 1 && (
                                <div className='layout__items--sr'>
                                    {index === 0 ? <span style={{ marginBottom: '1rem' }}>&nbsp;</span> : <></>}
                                    <div className='layout--cancel-icon'>
                                        <img src={MinusIcon} onClick={(e) => handleRemovePerson(index, e)} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='layout__items--description'>
                            {showDescription[index] || item?.description ? (
                                <>
                                    <div className='remove--description-btn'>
                                        <img src={MinusIcon} onClick={(e) => handleRemoveDescription(index, e)} />
                                        <div className='desc__box'>
                                            <span>Description</span>
                                            <input
                                                type="text"
                                                value={item?.description}
                                                defaultValue={item?.description}
                                                onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='add--description-btn'>
                                    <button onClick={(e) => handleAddDescription(index, e)}>
                                        <PlusOutlined />
                                    </button>
                                    <span>Add Description</span>
                                </div>
                            )}
                        </div>
                        {index === items.length - 1 && (
                            <div className='add--item-btn'>
                                <button onClick={(e) => handleAddPerson(e)}>
                                    <PlusOutlined />
                                </button>
                                <span>Add New Item</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className='layout--details'>
                <div className='layout--details--bank'>
                    <div className='layout--details--split'>
                        <div className='layout--details-left'>
                            <div className='layout--details-tnc'>
                                <h3>Note</h3>
                                <TextArea
                                    placeholder="Add a Note"
                                    rows={5}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='layout--details-right'>
                            <div className='layout--details-right-head'>
                                <span>Sub Total</span>
                                <span>Discount</span>
                                <span>Tax</span>
                                <span>Total</span>
                            </div>
                            <div className='layout--details-right-info'>
                                <span>
                                    <p style={{ fontWeight: 500 }}>{currency}</p>
                                    &nbsp; {new Intl.NumberFormat('en-US', {
                                    }).format(subTotal)}
                                </span>
                                <span>
                                    <p style={{ fontWeight: 500 }}>{currency}</p>
                                    &nbsp; {new Intl.NumberFormat('en-US', {
                                    }).format(discount)}
                                </span>
                                <span>
                                    <p style={{ fontWeight: 500 }}>{currency}</p>
                                    &nbsp; {new Intl.NumberFormat('en-US', {
                                    }).format(tax)}
                                </span>
                                <span>
                                    <p style={{ fontWeight: 500 }}>{currency}</p>
                                    &nbsp; {new Intl.NumberFormat('en-US', {
                                    }).format(total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PuchaseOrderLayoutP2;

import { useState } from 'react'
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { getCountries, getStates } from 'country-state-picker';
import { createVendorShippingAddress } from '../../../Actions/Vendor';
import uaeStates from '../../../data/uaeStates';

import "./AddVendorShippingAddress.css"
import { Modal, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const AddVendorShippingAddress = ({ isShippingModalOpen, handleShippingCancel, vendorId, handleAddVendorShippingAddressSubmit }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.vendorReducer);
    const { user } = useSelector(state => state.userReducer);
    const client_id = user?.localInfo?.role === 2 ? window.location.pathname.split('/')[4] : user?.localInfo?.role === 1 ? window.location.pathname.split('/')[2] : 0;
    const [label, setLabel] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [address3, setAddress3] = useState('');
    const [country, setCountry] = useState("United Arab Emirates");
    const [selectedCountry, setSelectedCountry] = useState("ae");
    const [state, setState] = useState('');
    const [allState, setAllStates] = useState(uaeStates);

    const handleCountryChange = (value) => {
        const countryCode = value;
        setSelectedCountry(countryCode);
        const selectedCountry = getCountries().find(country => country.code === countryCode);
        setCountry(selectedCountry ? selectedCountry.name : '');
        if (countryCode === 'ae') {
            setAllStates(uaeStates);
            setState(null);
        } else if (countryCode) {
            const countryStates = getStates(countryCode);
            setAllStates(countryStates);
            setState(null);
        } else {
            setAllStates([]);
        }
    };

    const handleSubmit = () => {
        if (address1 === "" || country === "" || state === "") {
            toast.error("Please fill all the fields.");
            return;
        }
        const values = {
            label: label === "" ? null : label,
            address_line_1: address1,
            address_line_2: address2 === "" ? null : address2,
            address_line_3: address3 === "" ? null : address3,
            state: state,
            country: country
        }
        dispatch(createVendorShippingAddress(values, vendorId, handleAddVendorShippingAddressSubmit, user?.localInfo?.role, client_id));
        setLabel('');
        setAddress1('');
        setAddress2('');
        setAddress3('');
        setCountry("United Arab Emirates");
        setSelectedCountry("ae");
        setState('');
        setAllStates(uaeStates);
    }

    const handleCancelWithReset = () => {
        setLabel('');
        setAddress1('');
        setAddress2('');
        setAddress3('');
        setCountry("United Arab Emirates");
        setSelectedCountry("ae");
        setState('');
        setAllStates(uaeStates);
        handleShippingCancel();
    }

    return (
        <Modal
            open={isShippingModalOpen}
            onCancel={handleCancelWithReset}
            footer={null}
            width={500}
            style={{ top: 20 }}
            className='add__shipping__modal'
        >
            <span className='add__shipping__modal--header'>Add New Shipping Address</span>
            <form className='add__shipping__modal--form'>
                <div className='add__shipping__modal--input'>
                    <span>Label</span>
                    <input type="text" name='label' value={label} onChange={(e) => setLabel(e.target.value)} />
                </div>
                <div className='add__shipping__modal--input'>
                    <span className='required__field'>Shipping Address 1</span>
                    <input type="text" name='address1' value={address1} onChange={(e) => setAddress1(e.target.value)} maxLength="45" />
                </div>
                <div className='add__shipping__modal--input'>
                    <span>Shipping Address 2</span>
                    <input type="text" name='address2' value={address2} onChange={(e) => setAddress2(e.target.value)} maxLength="45" />
                </div>
                <div className='add__shipping__modal--input'>
                    <span>Shipping Address 3</span>
                    <input type="text" name='address3' value={address3} onChange={(e) => setAddress3(e.target.value)} maxLength="45" />
                </div>
                <div className='add__shipping__modal--select'>
                    <span className='required__field'>Shipping Country</span>
                    <Select
                        showSearch
                        id='country'
                        defaultValue="ae"
                        value={selectedCountry}
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        options={getCountries().map((country) => ({ value: country.code, label: country.name }))}
                        onChange={handleCountryChange}
                    />
                </div>
                <div className='add__shipping__modal--select'>
                    {selectedCountry && (
                        <>
                            <span className='required__field'>{selectedCountry == "ae" ? "Emirates" : "Shipping State"}</span>
                            <Select
                                showSearch
                                style={{
                                    color: 'black',
                                    fontWeight: 300,
                                }}
                                id='state'
                                value={state}
                                placeholder="Select State"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={allState.map((state) => ({ value: state, label: state }))}
                                onChange={(value) => setState(value)}

                            />
                        </>
                    )}
                </div>
                <div className='add__shipping__modal--btns'>
                    <a className='add__shipping__modal--cancel-btn' onClick={handleCancelWithReset}>Cancel</a>
                    <a className='add__shipping__modal--submit-btn' onClick={handleSubmit}> {
                        loading ? <LoadingOutlined /> : "Submit"
                    } </a>
                </div>
            </form>
        </Modal>
    )
}

export default AddVendorShippingAddress;

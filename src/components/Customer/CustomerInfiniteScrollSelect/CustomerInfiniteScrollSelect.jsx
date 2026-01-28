import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { LoadingOutlined } from '@ant-design/icons';
import './CustomerInfiniteScrollSelect.css';

const CustomerInfiniteScrollSelect = ({ loadMoreOptions, onChange, customerKeyword, setCustomerKeyword }) => {
    const selectRef = useRef(null);
    const { loading, customersInf, totalCustomers } = useSelector(state => state.customerReducer);
    const [visibleOptions, setVisibleOptions] = useState([]);
    const [scrollTop, setScrollTop] = useState(0);

    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleScroll = (e) => {
        const select = selectRef.current;
        if (select) {
            setScrollTop(select.scrollTop);
            const optionScrollHeight = select.scrollHeight / customersInf.length;
            const optionsPerPage = 20;
            const currentScrollPage = Math.ceil(((select.scrollTop + 500) / optionScrollHeight) / optionsPerPage);
            loadMoreOptions(currentScrollPage);
        }
    };

    useEffect(() => {
        const select = selectRef.current;
        if (select) {
            select.addEventListener('scroll', handleScroll);
            return () => select.removeEventListener('scroll', handleScroll);
        }
    }, [loading]);

    useEffect(() => {
        setVisibleOptions(customersInf); // Initial visible options
    }, [customersInf, loading]);

    useEffect(() => {
        setVisibleOptions(customersInf);
    }, [customersInf, scrollTop]);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onChange(option);
    };

    return (
        <div className={`custom-select-cont ${isOpen ? 'open' : ''}`} ref={inputRef}>
            <div className={`custom-select ${isOpen ? 'open' : ''}`}>
                <div className={`select-header ${isOpen ? 'open' : ''}`} onClick={toggleDropdown} >
                    <input type='text' placeholder='Select Customer' value={customerKeyword} onChange={(e) => setCustomerKeyword(e.target.value)} />
                    <i className={`arrow ${isOpen ? 'up' : 'down'}`} />
                </div>
                <ul className={`options ${isOpen ? 'open' : ''}`} ref={selectRef}>
                    <li key={0}
                        style={{
                            fontWeight: 'bold',
                            backgroundColor: '#f5f5f5',
                            borderBottom: '2px solid #e8e8e8',
                        }}
                        onClick={() => {
                            handleOptionClick({ customer_id: 'addCustomer', customer_name: 'Add Customer' })
                        }}
                    >
                        Add Customer
                    </li>
                    {visibleOptions.map((option) => (
                        <li key={option.customer_id} onClick={() => handleOptionClick(option)}>
                            {option.customer_name}
                        </li>
                    ))}
                    {loading && <LoadingOutlined />}
                </ul>
            </div>
        </div>
    );
};

export default CustomerInfiniteScrollSelect;

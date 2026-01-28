import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import './VendorInfiniteScrollSelect.css';
import { LoadingOutlined } from '@ant-design/icons';

const VendorInfiniteScrollSelect = ({ loadMoreOptions, onChange, vendorKeyword, setVendorKeyword, scrollFor }) => {
    const selectRef = useRef(null);
    const { loading, vendorsInf, totalVendors } = useSelector(state => state.vendorReducer);
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
            const optionScrollHeight = select.scrollHeight / vendorsInf.length;
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
        setVisibleOptions(vendorsInf); // Initial visible options
    }, [vendorsInf, loading]);

    useEffect(() => {
        setVisibleOptions(vendorsInf);
    }, [vendorsInf, scrollTop]);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setVendorKeyword(option.vendor_name);
        setIsOpen(false);
        onChange(option);
    };

    return (
        <>
            {
                scrollFor === 'createPO' ?
                    <>
                        <div className={`custom-select-cont ${isOpen ? 'open' : ''}`} ref={inputRef}>
                            <div className={`custom-select ${isOpen ? 'open' : ''}`}>
                                <div className={`select-header ${isOpen ? 'open' : ''}`} onClick={toggleDropdown} >
                                    <input type='text' placeholder='Select Vendor' value={vendorKeyword} onChange={(e) => setVendorKeyword(e.target.value)} />
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
                                            handleOptionClick({ vendor_id: 'addVendor', vendor_name: 'Add Vendor' })
                                        }}
                                    >
                                        Add Vendor
                                    </li>
                                    {visibleOptions.map((option) => (
                                        <li key={option.vendor_id} onClick={() => handleOptionClick(option)}>
                                            {option.vendor_name}
                                        </li>
                                    ))}
                                    {loading && <LoadingOutlined />}
                                </ul>
                            </div>
                        </div>
                    </> :
                    <>
                        <div className={`custom-select-cont ${isOpen ? 'open' : ''}`} ref={inputRef}>
                            <div className={`custom-select ${isOpen ? 'open' : ''}`}>
                                <div className={`select-header ${isOpen ? 'open' : ''}`} onClick={toggleDropdown} >
                                    <input type='text' placeholder='Select Vendor' value={vendorKeyword} onChange={(e) => setVendorKeyword(e.target.value)} />
                                    <i className={`arrow ${isOpen ? 'up' : 'down'}`} />
                                </div>
                                <ul className={`options ${isOpen ? 'open' : ''}`} ref={selectRef}>
                                    {visibleOptions.map((option) => (
                                        <li key={option.vendor_id} onClick={() => handleOptionClick(option)}>
                                            {option.vendor_name}
                                        </li>
                                    ))}
                                    {loading && <LoadingOutlined />}
                                </ul>
                            </div>
                        </div>
                    </>
            }
        </>
    );
};

export default VendorInfiniteScrollSelect;

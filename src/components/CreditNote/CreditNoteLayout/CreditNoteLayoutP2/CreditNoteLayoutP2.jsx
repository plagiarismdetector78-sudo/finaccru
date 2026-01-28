import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getUnit } from "../../../../Actions/Unit";
import { getTaxRate } from "../../../../Actions/Onboarding";

import { Input, Select, AutoComplete, Switch, Tooltip } from "antd";
import {
    MinusCircle,
    Plus,
    Info,
    X,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { MAX_LENGTH } from "../../../../constant";
const { Option } = Select;

const CreditNoteFormP2 = ({
    items,
    setItems,
    currency,
    termsAndConditions,
    isSetDefaultTncCustomer,
    setIsSetDefaultTncCustomer,
    isSetDefaultTncClient,
    setIsSetDefaultTncClient,
    handleTnCChange,
    showTax,
}) => {
    const { units, loading: unitLoading } = useSelector(
        (state) => state.unitReducer
    );
    const { taxRates, taxRateLoading } = useSelector(
        (state) => state.onboardingReducer
    );
    const { user } = useSelector((state) => state.userReducer);
    const { client_id } = useParams();
    const [showDescription, setShowDescription] = useState([]);
    const [expandedItems, setExpandedItems] = useState([]);

    const [itemTotal, setItemTotal] = useState([]);
    const [itemTax, setItemTax] = useState([]);

    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const [allUnits, setAllUnits] = useState([]);
    const [mobileView, setMobileView] = useState(window.innerWidth < 768);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUnit(user?.localInfo?.role, client_id));
        dispatch(getTaxRate());

        const handleResize = () => {
            setMobileView(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [dispatch, client_id, user?.localInfo?.role]);

    useEffect(() => {
        setAllUnits(units);
    }, [units, unitLoading]);

    const handleUnitSearch = (value) => {
        let res = [];
        if (!value || value.indexOf("@") >= 0) {
            res = units;
        } else {
            res = units?.filter((unit) =>
                unit.unit_name.toLowerCase().includes(value.toLowerCase())
            );
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
        updatedItems[index].description = "";
        setItems(updatedItems);
    };

    const handleAddPerson = (event) => {
        event.preventDefault();
        const newItem = {
            item_name: "",
            unit: "",
            qty: null,
            rate: null,
            discount: 0,
            is_percentage_discount: true,
            tax_id: showTax ? 1 : null,
            description: null,
            is_inclusive: false,
        };
        setItems([...items, newItem]);
        setShowDescription([...showDescription, false]);
        setExpandedItems([...expandedItems, true]);
    };

    const handleRemovePerson = (index, event) => {
        event.preventDefault();
        const updatedItems = items.filter((_, i) => i !== index);
        const updatedShowDescription = showDescription.filter(
            (_, i) => i !== index
        );
        const updatedExpandedItems = expandedItems.filter(
            (_, i) => i !== index
        );
        setItems(updatedItems);
        setShowDescription(updatedShowDescription);
        setExpandedItems(updatedExpandedItems);
    };

    const toggleItemExpansion = (index) => {
        const newExpandedItems = [...expandedItems];
        newExpandedItems[index] = !newExpandedItems[index];
        setExpandedItems(newExpandedItems);
    };

    //for individual line item
    const toggleTaxInclusive = (index, checked) => {
        const updatedItems = [...items];
        updatedItems[index] = {
            ...updatedItems[index],
            is_inclusive: checked,
        };
        setItems(updatedItems);
    };

    useEffect(() => {
        const calculateTotalAmounts = () => {
            let subTotalAmount = 0;
            let discountAmount = 0;
            let taxAmount = 0;
            const calculatedTax = [];

            const calculateFinalAmount =
                items?.map((item) => {
                    // Ensure values are treated as numbers
                    const qty = parseFloat(item.qty) || 0;
                    const rate = parseFloat(item.rate) || 0;
                    const discount = parseFloat(item.discount) || 0;
                    const { is_percentage_discount, tax_id, is_inclusive } =
                        item;

                    // Calculate amount before discount
                    const lineAmountBeforeDiscount = rate * qty;

                    // Apply discount
                    let lineDiscountAmount = 0;
                    if (is_percentage_discount) {
                        lineDiscountAmount =
                            (lineAmountBeforeDiscount * discount) / 100;
                    } else {
                        lineDiscountAmount = discount * qty;
                    }

                    const amountAfterDiscount =
                        lineAmountBeforeDiscount - lineDiscountAmount;

                    // Add to running discount total
                    discountAmount += lineDiscountAmount;

                    // Fetch tax rate
                    const taxItem = taxRates?.find(
                        (tax) => tax.tax_rate_id === tax_id
                    );
                    const taxPercentage = taxItem?.tax_percentage || 0;

                    let tax = 0;
                    let finalAmount = 0;
                    let taxableAmount = 0;

                    if (taxPercentage !== 0 && showTax) {
                        if (is_inclusive) {
                            // TAX INCLUSIVE LOGIC
                            // The price already includes tax, so we need to extract the base amount
                            // Formula: base_amount = total_inclusive_amount / (1 + tax_rate/100)
                            const taxFactor = 1 + taxPercentage / 100;
                            taxableAmount = amountAfterDiscount / taxFactor;
                            tax = amountAfterDiscount - taxableAmount;

                            // For inclusive tax, final amount equals amount after discount (which already includes tax)
                            finalAmount = amountAfterDiscount;

                            // For inclusive tax, the subtotal should be the taxable amount (pre-tax)
                            subTotalAmount += taxableAmount;
                        } else {
                            // TAX NON-INCLUSIVE LOGIC
                            // Tax is calculated on top of the amount after discount
                            taxableAmount = amountAfterDiscount;
                            tax = taxableAmount * (taxPercentage / 100);

                            // For non-inclusive tax, final amount is taxable amount plus tax
                            finalAmount = taxableAmount + tax;

                            // For non-inclusive tax, subtotal is the amount before tax
                            subTotalAmount += taxableAmount;
                        }
                    } else {
                        // No tax
                        taxableAmount = amountAfterDiscount;
                        finalAmount = amountAfterDiscount;
                        subTotalAmount += taxableAmount;
                    }

                    // Add to running tax total
                    taxAmount += tax;

                    // Store the exact tax for this item
                    calculatedTax.push(tax);

                    // Return the final amount for this line (what customer pays)
                    return finalAmount;
                }) || [];

            // Set all state values with exact precision
            setSubTotal(subTotalAmount);
            setDiscount(discountAmount);
            setTax(taxAmount);
            setTotal(subTotalAmount + taxAmount); // For correct totals: subtotal (taxable amount) + tax
            setItemTax(calculatedTax);

            return calculateFinalAmount;
        };

        const calculatedItemTotals = calculateTotalAmounts();
        setItemTotal(calculatedItemTotals);
    }, [items, taxRates, showTax]);

    useEffect(() => {
        if (items && items.length > expandedItems.length) {
            setExpandedItems(items.map(() => true));
        }
    }, [items, expandedItems.length]);

    const renderMobileItemView = (item, index) => {
        return (
            <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                <div
                    className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                    onClick={() => toggleItemExpansion(index)}
                >
                    <div className="font-medium">
                        {item.item_name || `Item #${index + 1}`}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="text-sm font-medium">
                                {currency} {itemTotal[index] || "0.00"}
                            </span>
                        </div>
                        {expandedItems[index] ? (
                            <ChevronUp size={18} />
                        ) : (
                            <ChevronDown size={18} />
                        )}
                    </div>
                </div>

                {expandedItems[index] && (
                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <label className="text-xs text-gray-500 mb-1 block">
                                    Item Name
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Item Name"
                                    value={item?.item_name}
                                    defaultValue={item?.item_name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "item_name",
                                            e.target.value
                                        )
                                    }
                                    className="rounded border bg-white text-black text-sm font-normal leading-loose outline-none w-full"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
                                    Unit
                                </label>
                                <AutoComplete
                                    options={allUnits?.map((unit) => ({
                                        label: unit.unit_name,
                                        value: unit.unit_name,
                                    }))}
                                    value={item?.unit}
                                    defaultValue={item?.unit}
                                    onSearch={handleUnitSearch}
                                    onChange={(value) =>
                                        handleInputChange(index, "unit", value)
                                    }
                                    placeholder="Unit"
                                    className="w-full rounded border bg-white text-black text-sm font-normal leading-loose outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
                                    Quantity
                                </label>
                                <Input
                                    type="number"
                                    placeholder="Qty"
                                    value={item?.qty}
                                    defaultValue={item?.qty}
                                    onChange={(e) => {
                                        const valid =
                                            e.target.value.match(
                                                /^\d*\.?\d{0,2}$/
                                            );
                                        if (valid) {
                                            handleInputChange(
                                                index,
                                                "qty",
                                                e.target.value
                                            );
                                        }
                                    }}
                                    className="w-full rounded border bg-white text-black text-sm font-normal leading-loose outline-none text-right"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
                                    Rate
                                </label>
                                <Input
                                    type="number"
                                    placeholder="Rate"
                                    value={item?.rate}
                                    defaultValue={item?.rate}
                                    onChange={(e) => {
                                        const valid =
                                            e.target.value.match(
                                                /^\d*\.?\d{0,2}$/
                                            );
                                        if (valid) {
                                            handleInputChange(
                                                index,
                                                "rate",
                                                e.target.value
                                            );
                                        }
                                    }}
                                    className="w-full rounded border bg-white text-black text-sm font-normal leading-loose outline-none text-right"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
                                    Discount
                                </label>
                                <Input
                                    type="number"
                                    placeholder="Discount"
                                    value={item?.discount}
                                    defaultValue={item?.discount}
                                    addonAfter={
                                        <Select
                                            onChange={(value) => {
                                                handleInputChange(
                                                    index,
                                                    "is_percentage_discount",
                                                    value
                                                );
                                            }}
                                            defaultValue={
                                                item?.is_percentage_discount
                                            }
                                            value={item?.is_percentage_discount}
                                            style={{ width: 50, padding: 0 }}
                                        >
                                            <Option value={true}>%</Option>
                                            <Option value={false}>$</Option>
                                        </Select>
                                    }
                                    onChange={(e) => {
                                        const valid =
                                            e.target.value.match(
                                                /^\d*\.?\d{0,2}$/
                                            );
                                        if (valid) {
                                            handleInputChange(
                                                index,
                                                "discount",
                                                e.target.value
                                            );
                                        }
                                    }}
                                    className="w-full rounded border overflow-hidden text-right text-black"
                                />
                            </div>

                            {showTax && (
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">
                                        Tax
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="Tax"
                                        value={itemTax[index]}
                                        defaultValue={itemTax[index]}
                                        disabled={true}
                                        className="w-full rounded border overflow-hidden text-right"
                                        addonAfter={
                                            <Select
                                                onChange={(value) => {
                                                    handleInputChange(
                                                        index,
                                                        "tax_id",
                                                        value
                                                    );
                                                }}
                                                defaultValue={item?.tax_id}
                                                value={item?.tax_id}
                                                loading={taxRateLoading}
                                                style={{
                                                    width: 70,
                                                    padding: 0,
                                                }}
                                            >
                                                {taxRates?.map((taxRate) => (
                                                    <Option
                                                        key={
                                                            taxRate.tax_rate_id
                                                        }
                                                        value={
                                                            taxRate.tax_rate_id
                                                        }
                                                    >
                                                        {taxRate.tax_rate_name ==
                                                        "Standard Rated (5%)"
                                                            ? "(5%)"
                                                            : taxRate.tax_rate_name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        }
                                    />
                                </div>
                            )}

                            <div
                                className={
                                    showTax ? "col-span-1" : "col-span-2"
                                }
                            >
                                <label className="text-xs text-gray-500 mb-1 block">
                                    Amount
                                </label>
                                <Input
                                    type="text"
                                    value={itemTotal[index]}
                                    defaultValue={itemTotal[index]}
                                    disabled={true}
                                    className="w-full rounded border text-sm text-right"
                                />
                            </div>
                        </div>

                        {showTax && (
                            <div className="flex items-center justify-between gap-3 mt-6 bg-white p-4 rounded-md shadow-sm">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">
                                        Tax Setting
                                    </p>
                                    <Tooltip title="Choose whether tax is included in the item price or added on top">
                                        <Info
                                            size={16}
                                            className="text-gray-500 cursor-help"
                                        />
                                    </Tooltip>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`text-sm ${
                                            item.is_inclusive
                                                ? "font-medium"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        Inclusive
                                    </span>
                                    <Switch
                                        checked={item.is_inclusive}
                                        onChange={(checked) =>
                                            toggleTaxInclusive(index, checked)
                                        }
                                    />
                                    <span
                                        className={`text-sm ${
                                            !item.is_inclusive
                                                ? "font-medium"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        Exclusive
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Description section */}
                        <div className="mt-4">
                            {showDescription[index] || item?.description ? (
                                <div className="flex flex-col w-full">
                                    <div className="flex items-center gap-2">
                                        <MinusCircle
                                            size={16}
                                            onClick={(e) =>
                                                handleRemoveDescription(
                                                    index,
                                                    e
                                                )
                                            }
                                            className="cursor-pointer text-gray-500"
                                        />
                                        <label className="text-gray-700 text-sm font-medium">
                                            Description
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={item?.description}
                                        onChange={(e) => {
                                            if (
                                                e.target.value.length <=
                                                MAX_LENGTH
                                            ) {
                                                handleInputChange(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                );
                                            }
                                        }}
                                        maxLength={MAX_LENGTH}
                                        className="border-b border-gray-400 focus:border-gray-600 border-dotted bg-transparent mt-1 text-gray-800 text-sm font-normal leading-6 w-full outline-none transition-all duration-200 placeholder-gray-500"
                                        placeholder="Enter description..."
                                    />
                                    <span className="text-gray-500 text-xs mt-1">
                                        {item?.description?.length || 0}/
                                        {MAX_LENGTH} characters
                                    </span>
                                </div>
                            ) : (
                                <button
                                    onClick={(e) =>
                                        handleAddDescription(index, e)
                                    }
                                    className="flex items-center gap-1 border border-gray-400 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md shadow-sm hover:bg-gray-300 hover:text-black transition-all duration-200"
                                >
                                    <Plus size={14} />
                                    Add Description
                                </button>
                            )}
                        </div>

                        {/* Remove item button */}
                        <div className="mt-4 flex justify-end">
                            {items.length > 1 && (
                                <button
                                    className="flex items-center gap-1 border border-red-400 text-red-500 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition-all duration-200"
                                    onClick={(e) =>
                                        handleRemovePerson(index, e)
                                    }
                                >
                                    <X size={14} />
                                    Remove Item
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderDesktopItemView = () => {
        return (
            <div className="w-full bg-[#ECF1F3] pt-8">
                {/* Table Headers */}
                <div className="flex justify-between items-center px-4 mb-2">
                    <div style={{ width: 110 }} className="text-sm font-medium">
                        Item Name
                    </div>
                    <div style={{ width: 100 }} className="text-sm font-medium">
                        Unit
                    </div>
                    <div
                        style={{ width: 70 }}
                        className="text-sm font-medium text-center"
                    >
                        Qty
                    </div>
                    <div
                        style={{ width: 70 }}
                        className="text-sm font-medium text-center"
                    >
                        Rate
                    </div>
                    <div
                        style={{ width: 100 }}
                        className="text-sm font-medium text-center"
                    >
                        Discount
                    </div>
                    {showTax && (
                        <div
                            style={{ width: 140 }}
                            className="text-sm font-medium text-center"
                        >
                            Tax
                        </div>
                    )}
                    <div
                        style={{ width: 90 }}
                        className="text-sm font-medium text-center"
                    >
                        Amount
                    </div>
                    <div style={{ width: 20 }}></div>
                </div>

                {/* Item Rows */}
                {items?.map((item, index) => (
                    <div className="w-full py-2" key={index}>
                        <div className="flex justify-between items-start px-4">
                            <div className="flex flex-col justify-end text-right">
                                <Input
                                    type="text"
                                    placeholder="Item Name"
                                    value={item?.item_name}
                                    defaultValue={item?.item_name}
                                    style={{ width: 110 }}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "item_name",
                                            e.target.value
                                        )
                                    }
                                    className="rounded border bg-white text-black text-xs font-normal leading-loose outline-none"
                                />
                            </div>
                            <div className="flex flex-col justify-end text-right">
                                <AutoComplete
                                    options={allUnits?.map((unit) => ({
                                        label: unit.unit_name,
                                        value: unit.unit_name,
                                    }))}
                                    style={{ width: 100 }}
                                    value={item?.unit}
                                    defaultValue={item?.unit}
                                    onSearch={handleUnitSearch}
                                    onChange={(value) =>
                                        handleInputChange(index, "unit", value)
                                    }
                                    placeholder="Unit"
                                    className="rounded border bg-white text-black text-xs font-normal leading-loose outline-none"
                                />
                            </div>
                            <div className="flex flex-col justify-end text-right">
                                <Input
                                    type="number"
                                    placeholder="Quantity"
                                    value={item?.qty}
                                    defaultValue={item?.qty}
                                    style={{ width: 70 }}
                                    onChange={(e) => {
                                        const valid =
                                            e.target.value.match(
                                                /^\d*\.?\d{0,2}$/
                                            );
                                        if (valid) {
                                            handleInputChange(
                                                index,
                                                "qty",
                                                e.target.value
                                            );
                                        }
                                    }}
                                    className="rounded border bg-white text-black text-xs font-normal leading-loose outline-none text-right"
                                />
                            </div>
                            <div className="flex flex-col justify-end text-right">
                                <Input
                                    type="number"
                                    placeholder="Rate"
                                    value={item?.rate}
                                    defaultValue={item?.rate}
                                    style={{ width: 70 }}
                                    onChange={(e) => {
                                        const valid =
                                            e.target.value.match(
                                                /^\d*\.?\d{0,2}$/
                                            );
                                        if (valid) {
                                            handleInputChange(
                                                index,
                                                "rate",
                                                e.target.value
                                            );
                                        }
                                    }}
                                    className="rounded border bg-white text-black text-xs font-normal leading-loose outline-none text-right"
                                />
                            </div>
                            <div className="flex flex-col justify-end text-right">
                                <Input
                                    type="number"
                                    placeholder="Discount"
                                    value={item?.discount}
                                    defaultValue={item?.discount}
                                    style={{ width: 100 }}
                                    addonAfter={
                                        <Select
                                            onChange={(value) => {
                                                handleInputChange(
                                                    index,
                                                    "is_percentage_discount",
                                                    value
                                                );
                                            }}
                                            defaultValue={
                                                item?.is_percentage_discount
                                            }
                                            value={item?.is_percentage_discount}
                                            style={{ width: 50, padding: 0 }}
                                        >
                                            <Option value={true}>%</Option>
                                            <Option value={false}>$</Option>
                                        </Select>
                                    }
                                    onChange={(e) => {
                                        const valid =
                                            e.target.value.match(
                                                /^\d*\.?\d{0,2}$/
                                            );
                                        if (valid) {
                                            handleInputChange(
                                                index,
                                                "discount",
                                                e.target.value
                                            );
                                        }
                                    }}
                                    className="rounded border h-8 overflow-hidden text-right text-black"
                                />
                            </div>
                            {showTax && (
                                <div
                                    className="flex flex-col justify-end text-right"
                                    style={{ width: 140 }}
                                >
                                    <Input
                                        type="number"
                                        placeholder="Tax"
                                        value={
                                            typeof itemTax[index] ===
                                                "number" &&
                                            !isNaN(itemTax[index])
                                                ? new Intl.NumberFormat(
                                                      "en-US",
                                                      {
                                                          minimumFractionDigits: 1,
                                                          maximumFractionDigits: 2,
                                                      }
                                                  ).format(
                                                      parseFloat(
                                                          itemTax[
                                                              index
                                                          ].toFixed(2)
                                                      )
                                                  )
                                                : "0.00"
                                        }
                                        defaultValue={
                                            typeof itemTax[index] ===
                                                "number" &&
                                            !isNaN(itemTax[index])
                                                ? itemTax[index]
                                                : 0
                                        }
                                        disabled={true}
                                        className="rounded border h-8 overflow-hidden text-right"
                                        addonAfter={
                                            <Select
                                                onChange={(value) => {
                                                    handleInputChange(
                                                        index,
                                                        "tax_id",
                                                        value
                                                    );
                                                }}
                                                defaultValue={item?.tax_id}
                                                value={item?.tax_id}
                                                loading={taxRateLoading}
                                            >
                                                {taxRates?.map((taxRate) => (
                                                    <Option
                                                        key={
                                                            taxRate.tax_rate_id
                                                        }
                                                        value={
                                                            taxRate.tax_rate_id
                                                        }
                                                    >
                                                        {taxRate.tax_rate_name ===
                                                        "Standard Rated (5%)"
                                                            ? "(5%)"
                                                            : taxRate.tax_rate_name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        }
                                    />
                                </div>
                            )}
                            <div className="flex flex-col justify-end text-right">
                                <Input
                                    type="text"
                                    value={itemTotal[index]}
                                    defaultValue={itemTotal[index]}
                                    disabled={true}
                                    style={{ width: 90 }}
                                    className="rounded border text-xs h-8 text-right"
                                />
                            </div>
                            {items.length > 1 && (
                                <div className="flex flex-col justify-center items-center cursor-pointer">
                                    <div className="flex items-center mt-2">
                                        <MinusCircle
                                            size={20}
                                            onClick={(e) =>
                                                handleRemovePerson(index, e)
                                            }
                                            className="w-4 h-full cursor-pointer text-red-500 hover:text-red-700"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        {showTax && (
                            <div className="px-4 flex items-center gap-5 my-1">
                                <p className="text-sm">Tax Inclusive</p>
                                <Switch
                                    checked={item.is_inclusive}
                                    onChange={(checked) =>
                                        toggleTaxInclusive(index, checked)
                                    }
                                />
                                <p className="text-sm">Tax Exclusive</p>
                                <Tooltip title="Choose whether tax is included in the item price or added on top">
                                    <Info
                                        size={16}
                                        className="text-gray-500 cursor-help"
                                    />
                                </Tooltip>
                            </div>
                        )}

                        <div className="flex justify-start px-4 py-2 w-full">
                            {showDescription[index] || item?.description ? (
                                <>
                                    <div className="flex justify-start w-full items-center gap-2">
                                        <MinusCircle
                                            size={20}
                                            onClick={(e) =>
                                                handleRemoveDescription(
                                                    index,
                                                    e
                                                )
                                            }
                                            className="w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                        />
                                        <div className="flex flex-col w-full">
                                            <label className="text-gray-700 text-sm font-medium mt-2">
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                value={item?.description}
                                                onChange={(e) => {
                                                    if (
                                                        e.target.value.length <=
                                                        MAX_LENGTH
                                                    ) {
                                                        handleInputChange(
                                                            index,
                                                            "description",
                                                            e.target.value
                                                        );
                                                    }
                                                }}
                                                maxLength={MAX_LENGTH}
                                                className="border-b border-gray-400 focus:border-gray-600 border-dotted bg-transparent mt-1 text-gray-800 text-sm font-normal leading-6 w-1/2 outline-none transition-all duration-200 placeholder-gray-500"
                                                placeholder="Enter description..."
                                            />
                                            <span className="text-gray-500 text-xs mt-1">
                                                {item?.description?.length || 0}
                                                /{MAX_LENGTH} characters
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex pb-6 justify-start">
                                    <button
                                        onClick={(e) =>
                                            handleAddDescription(index, e)
                                        }
                                        className="flex items-center gap-1 border border-gray-400 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md shadow-sm hover:bg-gray-300 hover:text-black transition-all duration-200"
                                    >
                                        <Plus size={14} />
                                        Add Description
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* Add Item Button at the end of the list */}
                        {index === items.length - 1 && (
                            <div className="flex pb-6 justify-end px-4">
                                <button
                                    onClick={handleAddPerson}
                                    className="flex items-center gap-1 border border-primary text-primary text-xs font-medium px-3 py-1.5 rounded-md shadow-sm hover:bg-primary hover:text-white transition-all duration-200"
                                >
                                    <Plus size={14} />
                                    Add Item
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };
    return (
        <Fragment>
            {/* Responsive Items List */}
            {mobileView ? (
                <div className="w-full bg-gray-50 p-4">
                    {items?.map((item, index) =>
                        renderMobileItemView(item, index)
                    )}

                    {/* Add Item Button */}
                    <div className="flex justify-center mt-2">
                        <button
                            onClick={handleAddPerson}
                            className="flex items-center gap-1 bg-primary text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm hover:bg-primary/90 transition-all duration-200 w-full justify-center"
                        >
                            <Plus size={18} />
                            Add Item
                        </button>
                    </div>
                </div>
            ) : (
                renderDesktopItemView()
            )}

            {/* Terms and Condition & Amount Total */}
            <div className={`w-full ${mobileView ? "px-4" : "px-4"} my-5`}>
                <div
                    className={`flex ${
                        mobileView ? "flex-col" : "flex-row"
                    } justify-between items-start gap-6`}
                >
                    {/* Terms and Conditions */}
                    <div className={`${mobileView ? "w-full" : "w-1/2"}`}>
                        <div className="flex flex-col gap-3 w-full">
                            <h3 className="text-black text-base font-bold">
                                Add Terms and Conditions
                            </h3>
                            <textarea
                                placeholder="Terms and Conditions"
                                rows={5}
                                value={termsAndConditions}
                                onChange={handleTnCChange}
                                className="rounded border bg-white text-black outline-none p-3 w-full resize-none"
                            />
                        </div>
                        <div className="my-4 space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="saveForCustomer"
                                    value={isSetDefaultTncCustomer}
                                    checked={isSetDefaultTncCustomer}
                                    onChange={(e) =>
                                        setIsSetDefaultTncCustomer(
                                            e.target.checked
                                        )
                                    }
                                    className="rounded border-gray-300"
                                />
                                <label
                                    htmlFor="saveForCustomer"
                                    className="ml-2 text-sm font-light leading-normal cursor-pointer"
                                >
                                    Save for this customer
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="saveForAll"
                                    value={isSetDefaultTncClient}
                                    checked={isSetDefaultTncClient}
                                    onChange={(e) =>
                                        setIsSetDefaultTncClient(
                                            e.target.checked
                                        )
                                    }
                                    className="rounded border-gray-300"
                                />
                                <label
                                    htmlFor="saveForAll"
                                    className="ml-2 text-sm font-light leading-normal cursor-pointer"
                                >
                                    Save for all customers
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className={`${mobileView ? "w-full" : "flex-1"}`}>
                        <div
                            className={`${
                                mobileView
                                    ? "border rounded-lg p-4 bg-white"
                                    : ""
                            }`}
                        >
                            <div className={`${mobileView ? "divide-y" : ""}`}>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-base font-semibold">
                                        Sub Total
                                    </span>
                                    <span className="flex text-black text-right justify-end text-base font-medium">
                                        <span className="font-medium">
                                            {currency}
                                        </span>
                                        &nbsp;
                                        {new Intl.NumberFormat("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(subTotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-base font-semibold">
                                        Discount
                                    </span>
                                    <span className="flex text-black text-right justify-end text-base font-medium">
                                        <span className="font-medium">
                                            {currency}
                                        </span>
                                        &nbsp;
                                        {new Intl.NumberFormat("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(discount)}
                                    </span>
                                </div>
                                {showTax && (
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-base font-semibold">
                                            Tax
                                        </span>
                                        <span className="flex text-black text-right justify-end text-base font-medium">
                                            <span className="font-medium">
                                                {currency}
                                            </span>
                                            &nbsp;
                                            {new Intl.NumberFormat("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(tax)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-base font-semibold">
                                        Total
                                    </span>
                                    <span className="flex text-black text-right justify-end text-lg font-bold">
                                        <span className="font-bold">
                                            {currency}
                                        </span>
                                        &nbsp;
                                        {new Intl.NumberFormat("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default CreditNoteFormP2;

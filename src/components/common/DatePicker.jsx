import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

const DatePicker = ({
    label,
    name,
    placeholder = "Select date",
    className,
    error,
    touched,
    onChange,
    onBlur,
    value,
    minDate,
    maxDate,
    dateFormat = "dd/MM/yyyy",
    isHorizontal = false,
}) => {
    const [localTouched, setLocalTouched] = useState(false);

    const handleBlur = () => {
        setLocalTouched(true);
        if (onBlur) {
            onBlur();
        }
    };

    const isFieldTouched = touched || localTouched;

    const verticalParentClassNames = `flex flex-col gap-2 ${className}`;
    const horizontalChildClassNames = `flex flex-row gap-2 items-center justify-between ${className}`;

    return (
        <div
            className={`${
                isHorizontal
                    ? horizontalChildClassNames
                    : verticalParentClassNames
            }`}
        >
            {label && (
                <label
                    className="text-sm text-left font-medium text-gray-700"
                    htmlFor={name}
                >
                    {label}
                </label>
            )}
            <div className="relative w-full">
                <ReactDatePicker
                    id={name}
                    selected={value}
                    onChange={onChange}
                    onBlur={handleBlur}
                    minDate={minDate}
                    maxDate={maxDate}
                    dateFormat={dateFormat}
                    placeholderText={placeholder}
                    className={`outline-none w-full px-3 py-3 border rounded-lg bg-white cursor-pointer ${
                        isFieldTouched && error
                            ? "border-red-500"
                            : "border-gray-300"
                    }`}
                />
                <Calendar
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={20}
                />
            </div>
            {isFieldTouched && error && (
                <span className="text-sm text-red-500 capitalize text-left">
                    {error}
                </span>
            )}
        </div>
    );
};

export default DatePicker;

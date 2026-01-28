import React, { useState } from "react";

const Input = ({
    label,
    name,
    placeholder,
    type = "text",
    icon: Icon,
    className,
    error,
    touched,
    onChange,
    onBlur,
    value,
    maxLength,
    onKeyUp,
    "data-index": dataIndex,
    isHorizontal = false,
}) => {
    const [localTouched, setLocalTouched] = useState(false);

    const handleBlur = (e) => {
        setLocalTouched(true);
        if (onBlur) {
            onBlur(e);
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
            <div className="relative flex items-center">
                {Icon && (
                    <Icon className="absolute left-3 text-gray-500" size={20} />
                )}
                <input
                    id={name}
                    value={value}
                    onChange={onChange}
                    onBlur={handleBlur}
                    type={type}
                    onKeyUp={onKeyUp}
                    placeholder={placeholder}
                    data-index={dataIndex}
                    maxLength={maxLength}
                    className={`outline-none w-full px-3 py-3 border rounded-lg ${
                        Icon ? "pl-10" : ""
                    } 
                        ${
                            isFieldTouched && error
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
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

export default Input;

import React from "react";

const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    className,
    icon: Icon,
    error,
    touched,
    placeholder,
    disabled,
}) => {
    const normalizeOption = (option) => {
        if ("value" in option && "label" in option) {
            return option;
        } else {
            return {
                value: option.dial_code,
                label: `${option.name} (${option.dial_code})`,
            };
        }
    };

    const normalizedOptions = options.map(normalizeOption);

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <div className="flex items-center gap-2">
                {Icon && <Icon className="text-gray-500" size={20} />}
                {label && (
                    <label
                        htmlFor={name}
                        className="text-sm font-medium text-gray-700"
                    >
                        {label}
                    </label>
                )}
            </div>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full p-3 border rounded outline-none"
            >
                <option value="">{placeholder}</option>
                {normalizedOptions.map((option) => (
                    <option key={option.label} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {touched && error && (
                <span className="text-sm text-red-500 text-left">{error}</span>
            )}
        </div>
    );
};

export default Select;

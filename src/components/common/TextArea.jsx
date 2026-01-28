import React from "react";

const TextArea = ({
    label,
    name,
    placeholder,
    className,
    onChange,
    onBlur,
    value,
    maxLength,
    rows = 4,
    readOnly = false,
}) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="text-sm font-medium text-gray-700 text-left"
                >
                    {label}
                </label>
            )}
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                maxLength={maxLength}
                rows={rows}
                readOnly={readOnly}
                className={`outline-none w-full px-3 py-3 border rounded-lg resize-none`}
            />
        </div>
    );
};

export default TextArea;

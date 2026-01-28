const Checkbox = ({
    label,
    name,
    checked,
    onChange,
    className,
    icon: Icon,
    error,
    touched,
}) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <input
                id={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-5 h-5 border rounded outline-none"
            />
            {Icon && <Icon className="text-gray-500" size={20} />}
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
                {label}
            </label>
            {touched && error && (
                <span className="text-sm text-red-500">{error}</span>
            )}
        </div>
    );
};

export default Checkbox;

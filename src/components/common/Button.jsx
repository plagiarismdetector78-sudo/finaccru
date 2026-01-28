const Button = ({
    type = "button",
    text,
    onClick,
    className = "",
    disabled = false,
    icon: Icon,
    iconPosition = "left",
    variant = "filled", // "filled" or "outlined"
}) => {
    const baseClasses =
        "flex items-center justify-center gap-2 px-4 py-3 w-full rounded-lg disabled:cursor-not-allowed";

    const filledClasses = "bg-primary text-white disabled:bg-gray-400";
    const outlinedClasses =
        "border border-primary text-primary bg-transparent disabled:border-gray-400 disabled:text-gray-400";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${
                variant === "outlined" ? outlinedClasses : filledClasses
            } ${className}`}
        >
            {Icon && iconPosition === "left" && <Icon size={20} />}
            <span>{text}</span>
            {Icon && iconPosition === "right" && <Icon size={20} />}
        </button>
    );
};

export default Button;

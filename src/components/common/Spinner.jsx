const Spinner = ({ type = "small" }) => {
    const spinnerTypes = {
        small: "w-8 h-8 border-gray-500",
        fullscreen: "w-16 h-16 border-blue-500",
    };

    return (
        <div className="flex items-center justify-center w-full h-full">
            {type === "fullscreen" ? (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div
                        className={`border-4 border-t-transparent rounded-full animate-spin ${spinnerTypes[type]}`}
                    ></div>
                </div>
            ) : (
                <div
                    className={`border-4 border-t-transparent rounded-full animate-spin ${spinnerTypes[type]}`}
                ></div>
            )}
        </div>
    );
};

export default Spinner;

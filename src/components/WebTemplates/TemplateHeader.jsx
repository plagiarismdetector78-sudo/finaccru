import React from "react";

const TemplateHeader = ({ logo, companyTitle, title }) => {
    return (
        <div className="flex items-center justify-between px-8 py-5">
            <div className="flex items-center gap-2">
                {logo && (
                    <img
                        className="w-12 h-12 object-contain"
                        src={logo}
                        alt="logo"
                    />
                )}
                <h1 className="text-3xl text-blue-500 font-bold">
                    {companyTitle}
                </h1>
            </div>
            <h1 className="text-2xl font-bold">{title}</h1>
        </div>
    );
};

export default TemplateHeader;

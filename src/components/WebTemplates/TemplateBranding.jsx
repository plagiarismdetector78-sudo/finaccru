import React from "react";

const TemplateBranding = () => {
    return (
        <div className="flex items-center justify-center gap-5 py-3 bg-gray-100">
            <img
                className="w-10"
                src={"/assets/images/Logo.svg"}
                alt="Finaccru Branding"
            />
            <div className="text-center">
                <p className="text-xs font-normal">
                    This is an electronically generated document and does not
                    require a sign or stamp.
                </p>
                <span className="mt-1 block text-xs font-semibold capitalize">
                    powered by Finaccru
                </span>
            </div>
        </div>
    );
};

export default TemplateBranding;

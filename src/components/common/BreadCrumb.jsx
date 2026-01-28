import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Breadcrumb = ({ item }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        const pathParts = location.pathname.split("/").filter(Boolean);

        if (pathParts.length >= 2) {
            const baseLevel = item.baseLevel || 1;
            const parentPath = "/" + pathParts.slice(0, baseLevel).join("/");
            navigate(parentPath);
        } else {
            navigate("/");
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <button
                    onClick={handleBack}
                    className="mr-2 p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Go back"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="font-bold text-xl">{item.label}</h3>
            </div>
            <nav className="flex items-center text-gray-600">
                <span className="text-gray-400 font-semibold flex items-center">
                    {item.label} <ChevronRight className="mx-2" />
                </span>
                <span className="text-black">{item.viewLabel}</span>
            </nav>
        </div>
    );
};

export default Breadcrumb;

import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const DeviceRestriction = ({ children }) => {
    const [isRestricted, setIsRestricted] = useState(false);

    useEffect(() => {
        const checkDeviceType = () => {
            const width = window.innerWidth;
            // console.log("Width: ", width);

            // Restrict devices with a width below 1280 pixels (13-inch laptop)
            setIsRestricted(width < 1280);
            // setIsRestricted(width < 280);
        };

        checkDeviceType();
        window.addEventListener("resize", checkDeviceType);
        return () => {
            window.removeEventListener("resize", checkDeviceType);
        };
    }, []);

    if (!isRestricted) {
        return children;
    }

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center p-6 bg-white rounded-lg">
                    <AlertTriangle
                        className="mx-auto mb-4 text-yellow-500"
                        size={64}
                    />
                    <h2 className="text-2xl font-bold mb-4">
                        Access Restricted
                    </h2>
                    <p className="text-gray-600 mb-4">
                        This application is only accessible on devices with a
                        screen size of 13 inches or larger.
                    </p>
                    <p className="text-sm text-gray-500">
                        Please switch to a larger device to view this content.
                    </p>
                </div>
            </div>
            <div className="opacity-80 pointer-events-none">{children}</div>
        </div>
    );
};

export default DeviceRestriction;

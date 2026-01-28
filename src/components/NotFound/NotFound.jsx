import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden bg-global bg-no-repeat bg-cover ">
            <div className="relative  z-10 w-full max-w-4xl mx-auto px-0 md:px-4 py-0 md:py-16 text-center">
                <div className="bg-white h-screen md:h-fit rounded-lg shadow-xl p-8 md:p-12 backdrop-blur-sm bg-opacity-90">
                    <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 to-primary text-transparent bg-clip-text animate-pulse h-[200px] flex items-center justify-center">
                        404
                    </h1>

                    <div className="mt-6 space-y-2">
                        <h2 className="text-2xl md:text-3xl h-11 font-bold text-gray-800">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-gray-600 max-w-md mx-auto">
                            The page you're looking for doesn't exist or has
                            been moved. Let's get you back on track.
                        </p>
                    </div>

                    <div className="mt-8">
                        <Button
                            text="Back to Home"
                            icon={ArrowLeft}
                            onClick={() => navigate("/")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

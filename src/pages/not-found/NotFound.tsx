import { useNavigate } from "react-router-dom";
import { Button } from "@/components/button/Button";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h2>
            <p className="mt-2 text-gray-600">
                Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div className="mt-8">
                <Button onClick={() => navigate("/")} className="w-auto px-6">
                    Go back home
                </Button>
            </div>
        </div>
    );
};

export default NotFound;

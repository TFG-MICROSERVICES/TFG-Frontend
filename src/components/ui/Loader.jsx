export const Loader = () => {
    return (
        <div className="flex justify-center items-center h-40 bg-gray-900 rounded-lg">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-white rounded-full animate-spin border-t-transparent"></div>
            </div>
        </div>
    );
};
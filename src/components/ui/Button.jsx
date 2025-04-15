export const Button = ({ clase = 'w-full', handleOnClick, children }) => {
    return (
        <button className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center ${clase}`} onClick={handleOnClick}>
            {children}
        </button>
    );
};

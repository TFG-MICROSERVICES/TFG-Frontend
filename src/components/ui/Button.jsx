export const Button = ({ clase = 'w-full', handleOnClick, children, disabled }) => {
    return (
        <button
            className={`bg-blue-500 ${!disabled ? 'hover:bg-blue-600' : ''} text-white px-4 py-2 rounded-md flex items-center ${clase}`}
            disabled={disabled}
            onClick={handleOnClick}
        >
            {children}
        </button>
    );
};


export const Button = ({text, className, handleOnClick}) =>{
    return(
        <div className=" w-full flex justify-center items-center max-w-5xl">
            <button
                onClick={handleOnClick}
                className={`border border-slate-300 text-white bg-blue-500 rounded-lg p-2 w-full md:w-1/2 ${className}`}
            >
                {text}
            </button>
        </div>
    )
}
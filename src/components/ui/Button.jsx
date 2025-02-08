export const Button = ({text, clase, handleOnClick}) =>{
    return(
        <div className=" w-full flex justify-center items-center max-w-5xl">
            <button
                onClick={handleOnClick}
                className={`border text-primary bg-transparent border-primary hover:text-white hover:bg-primary rounded-lg p-2 w-full group ${clase}`}
            >
                <span className="inline-block transition-transform group-hover:scale-105">
                    {text}
                </span>
            </button>
        </div>
    )
}
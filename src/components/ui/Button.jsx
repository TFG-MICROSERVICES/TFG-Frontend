export const Button = ({text, clase = "w-full", handleOnClick}) =>{
    return(
        <div className={`flex justify-center items-center max-w-5xl ${clase}`}>
            <button
                onClick={handleOnClick}
                className={`border text-primary bg-transparent border-primary hover:text-white hover:bg-primary rounded-lg p-2 w-full group`}
            >
                <span className="inline-block transition-transform group-hover:scale-105">
                    {text}
                </span>
            </button>
        </div>
    )
}
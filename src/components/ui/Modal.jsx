import { useEffect } from "react"
import { Button } from "./Button";

export const Modal = ({ open, onClose, children, title }) => {

    console.log(open);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    if (!open) return null;

    return (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40" aria-hidden={!open}>
            <button className="absolute top-4 right-4" onClick={onClose}>X</button>
            <h2>{title}</h2>
            <hr />
            <div className="modal-content z-50 bg-white w-3/4 h-1/2 flex flex-col justify-between items-center rounded-lg shadow-lg p-5">
                {children}
            </div>
        </div>
    )
}
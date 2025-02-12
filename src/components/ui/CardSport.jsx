import { Icon, Mail, Phone, MapPin, Pencil, Pen } from "lucide-react";

export const CardSport = ({sport, handleOnEdit}) =>{

    return (
        <div className="bg-white p-4 w-full flex gap-3 mt-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 items-center">
            <div  className="w-full flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800">{sport.name}</h3>
            </div>
            <div 
                className="justify-center items-center cursor-pointer" 
                onClick={() => handleOnEdit()}>
                <Pencil size={18}/>
            </div>
        </div>
    )
}
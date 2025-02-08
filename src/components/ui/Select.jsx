import { useContext, useState, useEffect } from 'react';
import { FormContext } from '../../context/FormContext';

export const Select = ({placeholder, options, disabled, required, label, name, handleSelectOption}) =>{
    const [isTouchedInput, setIsTouchedInput] = useState(false);
    const { formValue, errors, updateFormValue, isTouched, isLoading } = useContext(FormContext);

    const updateRequest = ({target}) =>{
        if(!isTouchedInput) setIsTouchedInput(true);
        updateFormValue({[name]: target.value});
        if(handleSelectOption) handleSelectOption(target.value)
    }

    useEffect(() => {
        if(!isTouched) setIsTouchedInput(false);
    }, [isTouched]);


    return (
        <div className="w-full max-w-5xl items-center flex flex-col gap-2">
            <label className="text-left w-full" htmlFor={name}>{label} {required ? "*" : ""}</label>
            <select 
                className="border border-slate-400 h-10 w-full rounded-lg p-2 bg-white"
                value={formValue[name]}
                name={name}
                disabled={isLoading || disabled}
                required={required}
                onChange={(event) => updateRequest(event)}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {(isTouched || isTouchedInput) && errors?.[name] && !isLoading && 
                <div className="w-full flex justify-start">
                    <span className="text-red-500 text-sm">{errors[name]}</span>
                </div>
            }
        </div>
    )
}
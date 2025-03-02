import { useState, useContext, useEffect } from 'react';
import { FormContext } from '../../context/FormContext';

export const Input = ({ type, name, placeholder, required = false, label, clase = 'w-full', disabled, min, max }) => {
    const [isTouchedInput, setIsTouchedInput] = useState(false);
    const { formValue, errors, updateFormValue, isTouched, isLoading } = useContext(FormContext);

    const updateRequest = ({ target }) => {
        if (!isTouchedInput) setIsTouchedInput(true);
        updateFormValue({ [name]: target.value });
    };

    useEffect(() => {
        if (!isTouched) setIsTouchedInput(false);
    }, [isTouched]);

    return (
        <div className="w-full max-w-5xl items-center flex flex-col gap-2">
            <label className="text-left w-full" htmlFor={name}>
                {label} {required ? '*' : ''}{' '}
            </label>
            <input
                disabled={isLoading || disabled}
                className={`border border-slate-400 h-10 w-full rounded-lg p-2 ${clase}`}
                placeholder={placeholder}
                name={name}
                type={type}
                value={formValue[name]}
                required={required}
                onChange={(event) => updateRequest(event)}
                min={min}
                max={max}
            />
            {(isTouched || isTouchedInput) && errors?.[name] && !isLoading && (
                <div className="w-full flex justify-start" style={{ minHeight: '1.25rem' }}>
                    <span className="text-red-500 text-sm">{errors[name]}</span>
                </div>
            )}
        </div>
    );
};

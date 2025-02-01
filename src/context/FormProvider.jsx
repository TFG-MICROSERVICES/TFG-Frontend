import { useEffect, useState} from 'react';
import { FormContext } from './FormContext'
import { validate } from '../utils/validations.js';

export const FormProvider = ({children, initialValue, schema, onSubmit, clase}) =>{
    const [formState, setFormState] = useState({
        isTouched: false,
        isLoading: false,
        formValue: initialValue || {},
    });

    const[,errors] = validate(schema,formState.formValue);

    const updateFormValue = (newFormValue) =>{
        setFormState((oldFormState)=>{
            return{
                ...oldFormState,
                formValue: {
                    ...oldFormState.formValue,
                    ...newFormValue,
                },
            };
        });
    }

    const updateIsTouched = (newFormValue) =>{
        setFormState((oldFormState) =>{
            return {
                ...oldFormState,
                isTouched: newFormValue,
            };
        });
    }

    useEffect(() => {
        setFormState((oldFormState) => ({
            ...oldFormState,
            formValue: initialValue || {},
            
        }));
    }, [initialValue]);

    const onFormSubmit = async(e) => {
        e.preventDefault();
        console.log('ON FORM SUBMIT', formState.formValue);
        setFormState((oldFormState) =>{
            return {
                ...oldFormState,
                isTouched: true,
                isLoading: true,
            };
        });

        const [isValid, errors] = validate(schema, formState.formValue);

        console.log('IS VALID', isValid);

        if(!isValid){
            console.log('ERRORS',errors);
            return setFormState((oldFormState) =>{
                return {
                    ...oldFormState,
                    isTouched: true,
                    isLoading: false,
                };
            });
        }

        await onSubmit(formState.formValue);

        setFormState({
            isTouched: false,
            isLoading: false,
            formValue: formState.formValue || {},
        });
    }


    const handleOnSubmit = (event) =>{
        event.preventDefault();
    }

    return (
        <FormContext.Provider value={{ ...formState, errors: errors, updateFormValue, updateIsTouched }}>
            <form onSubmit={onFormSubmit} className={clase}>
                {children}
            </form>
        </FormContext.Provider>
    );
};
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select.jsx';
import { useEffect, useState, useContext } from 'react';
import { FormProvider } from '../context/FormProvider';
import { postRegisterAuth } from '../api/request/post/auths/postRegisterAuth.jsx';
import { postRegisterUser } from '../api/request/post/users/postRegisterUser.jsx';
import { comunidades } from '../constants/locations.js';
import { userSchema } from '../api/schemas/schemaRegister.js';
import { schemaEmail } from '../api/schemas/schemaRegisterEmail.js';
import { toast } from 'react-toastify';
import { LoginContext } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';

const initialValue = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    password_confirm: '',
    phone_number: '',
    birthdate: '',
    city: '',
    autonomous_region: '',
};

export const Register = () => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const { login } = useContext(LoginContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (login) navigate('/home');
    }, []);

    const handleRegister = async (formValue) => {
        try {
            formValue.email = email;
            const response = await postRegisterUser(formValue);
            if (response.status === 201) {
                toast.success('Regsitro realizado con éxito');
                navigate('/login');
            } else toast.error(response.message);
        } catch (error) {
            toast.error(error);
        }
    };

    const handleStep = async (formValue) => {
        try {
            const response = await postRegisterAuth(formValue);
            if (response.status !== 201) {
                console.log(response);
                toast.error(response.message);
            } else {
                setEmail(formValue.email);
                setStep((prev) => prev + 1);
            }
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen w-full h-full-screen gap-2 items-center justify-center p-4">
            <FormProvider
                onSubmit={handleStep}
                schema={schemaEmail}
                initialValue={initialValue}
                clase="space-y-4 w-1/2 flex flex-col items-center justify-center"
            >
                {step === 0 && (
                    <>
                        <h2 className="text-4xl text-primary mb-4">Registrarme</h2>
                        <Input label="Correo electrónico" name="email" type="email" required placeholder="Introduzca su email" />

                        <Input label="Contraseña" name="password" type="password" required placeholder="Introduzca su contraseña" />

                        <Input label="Confirmar Contraseña" name="password_confirm" type="password" required placeholder="Confirme su contraseña" />

                        <Button
                            type="submit"
                            text="Siguiente"
                            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-all mt-10"
                        />
                    </>
                )}
            </FormProvider>

            <FormProvider
                onSubmit={handleRegister}
                initialValue={initialValue}
                schema={userSchema}
                clase="space-y-4 w-full md:w-1/2 flex flex-col items-center justify-center"
            >
                {step === 1 && (
                    <div className="flex flex-col w-full justify-center gap-4">
                        <h2 className="text-4xl text-primary mb-4">Un paso más y hemos terminado</h2>
                        <Input label="Nombre" name="name" type="text" required placeholder="Introduzca su nombre" clase="w-full" />

                        <Input label="Apellidos" name="lastName" type="text" required placeholder="Introduzca sus apellidos" />
                        <Input label="Número de Teléfono" name="phone_number" type="phone" required placeholder="Introduzca su número de teléfono" />

                        <Input label="Fecha de nacimiento" name="birthdate" type="date" required />

                        <Select
                            defaultValue="Selecciona tu comunidad autónoma"
                            options={comunidades.map((comunidad) => ({ value: comunidad.id, label: comunidad.name }))}
                            handleSelectOption={(value) => setSelectedCountry(value)}
                            label="Comunidad Autónoma"
                            required
                            name="autonomous_region"
                        />

                        {selectedCountry && comunidades.find((comunidad) => comunidad.id === selectedCountry).provincias && (
                            <Select
                                defaultValue="Selecciona tu ciudad"
                                options={comunidades.find((comunidad) => comunidad.id === selectedCountry).provincias}
                                label="Ciudad"
                                required
                                name="city"
                            />
                        )}

                        <Button
                            type="submit"
                            text="Registrarme"
                            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-all mt-10"
                        />
                    </div>
                )}
            </FormProvider>

            <p className="text-center text-gray-400 mt-5">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-primary hover:text-blue-700">
                    Iniciar sesión
                </Link>
            </p>
        </div>
    );
};

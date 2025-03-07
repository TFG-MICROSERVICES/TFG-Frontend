import { FormProvider } from '../context/FormProvider';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select.jsx';
import { Button } from '../components/ui/Button';
import { toast } from 'react-toastify';
import { LoginContext } from '../context/LoginContext';
import { useContext, useState, useEffect } from 'react';
import { userSchema } from '../api/schemas/schemaRegister.js';
import { comunidades } from '../constants/locations.js';
import { postRegisterGoogle } from '../api/request/post/postRegisterGoogle.jsx';
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

export const Registration = () => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const { login } = useContext(LoginContext);
    const navigate = useNavigate();

    useEffect(() => {
        initialValue.email = login?.email;
    }, [login]);

    const handleRegister = async (formValue) => {
        try {
            const response = await postRegisterGoogle(formValue);
            if (response.status !== 201) {
                toast.error('Error al terminar registro');
                return;
            }
            navigate('/home');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <FormProvider onSubmit={handleRegister} initialValue={initialValue} schema={userSchema} clase="space-y-4 w-full flex flex-col items-center">
            <div className="grid grid-cols-2 w-1/2 justify-center gap-4">
                <div className="w-full flex flex-col gap-4">
                    <Input label="Nombre" name="name" type="text" required placeholder="Introduzca su nombre" clase="w-full" />

                    <Input label="Contraseña" name="password" type="password" required placeholder="Introduzca su contraseña" />

                    <Input label="Fecha de nacimiento" name="birthdate" type="date" required />
                </div>

                <div className="w-full flex flex-col gap-4">
                    <Input label="Apellidos" name="lastName" type="text" required placeholder="Introduzca sus apellidos" />

                    <Input label="Confirmar Contraseña" name="password_confirm" type="password" required placeholder="Confirme su contraseña" />

                    <Input label="Número de Teléfono" name="phone_number" type="phone" required placeholder="Introduzca su número de teléfono" />
                </div>
            </div>

            <Input label="Correo electrónico" name="email" type="email" clase="w-1/2" required placeholder="Introduzca su email" />

            <Select
                placeholder="Selecciona tu comunidad autónoma"
                options={comunidades.map((comunidad) => ({ value: comunidad.id, label: comunidad.name }))}
                handleSelectOption={(value) => setSelectedCountry(value)}
                label="País"
                required
                clase="w-1/2"
                name="autonomous_region"
            />

            {selectedCountry && (
                <Select
                    placeholder="Selecciona tu ciudad"
                    options={comunidades.find((comunidad) => comunidad.id === selectedCountry).provincias}
                    label="Ciudad"
                    required
                    clase="w-1/2"
                    name="city"
                />
            )}

            <Button
                type="submit"
                text="Registrarme"
                className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-all"
            />
        </FormProvider>
    );
};

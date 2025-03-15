import { FormProvider } from '../context/FormProvider';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select.jsx';
import { Button } from '../components/ui/Button';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { userSchema } from '../api/schemas/schemaRegister.js';
import { comunidades } from '../constants/locations.js';
import { postRegisterGoogle } from '../api/request/post/postRegisterGoogle.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const Registration = () => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [searchParams] = useSearchParams();
    const [initialValue, setInitialValue] = useState({
        name: '',
        lastName: '',
        email: searchParams.get('email') || '',
        password: '',
        password_confirm: '',
        phone_number: '',
        birthdate: '',
        city: '',
        autonomous_region: '',
    });
    const navigate = useNavigate();

    const handleRegister = async (formValue) => {
        try {
            const response = await postRegisterGoogle(formValue);
            if (response.status !== 201) {
                toast.error(response.message);
                return;
            }
            toast.success('Registro exitoso');
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen w-full h-full-screen gap-2 items-center p-4">
            <h2 className="text-4xl text-primary mb-4">Complete su registro</h2>
            <FormProvider
                onSubmit={handleRegister}
                initialValue={initialValue}
                schema={userSchema}
                clase="space-y-4 w-1/2 flex flex-col items-center justify-center"
            >
                <div className="grid grid-cols-2 w-full justify-center gap-4">
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

                <Select
                    placeholder="Selecciona tu comunidad autónoma"
                    options={comunidades.map((comunidad) => ({ value: comunidad.id, label: comunidad.name }))}
                    handleSelectOption={(value) => setSelectedCountry(value)}
                    label="País"
                    required
                    name="autonomous_region"
                />

                {selectedCountry && (
                    <Select
                        placeholder="Selecciona tu ciudad"
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
            </FormProvider>
        </div>
    );
};

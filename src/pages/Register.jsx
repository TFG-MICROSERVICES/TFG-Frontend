import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select.jsx';
import { useEffect, useState, useContext } from 'react';
import { FormProvider } from '../context/FormProvider';
import { postRegister } from '../api/request/post/postRegister.jsx';
import { comunidades } from '../constants/locations.js';
import { userSchema } from '../schemas/schemaRegister.js';
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
    const { login } = useContext(LoginContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(login) navigate('/home');
    }, []);

    const handleRegister = async (formValue) => {
        try{
            const response = await postRegister(formValue);
            if(response.status === 201) toast.success('Regsitro realizado con éxito');
            else toast.error(response.message);
        }catch(error){
            toast.error('Ha ocurrido un error al registrarte');
        }
    }

    return (
        <div className="flex flex-col w-full h-full-screen gap-2 items-center justify-center p-4">   
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Registrarme</h2>

            <FormProvider 
                onSubmit={handleRegister} 
                initialValue={initialValue} 
                schema={userSchema} 
                clase="space-y-4 w-1/2 flex flex-col items-center"
            >

                <div className="grid grid-cols-2 w-full justify-center gap-4">
                    <div className="w-full flex flex-col gap-4">
                        <Input 
                            label="Nombre" 
                            name="name" 
                            type="text" 
                            required 
                            placeholder="Introduzca su nombre" 
                            clase="w-full"
                        />

                        <Input 
                            label="Contraseña" 
                            name="password" 
                            type="password" 
                            required 
                            placeholder="Introduzca su contraseña" 
                        />

                        <Input
                            label="Fecha de nacimiento"
                            name="birthdate"
                            type="date"
                            required
                        />
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <Input 
                            label="Apellidos" 
                            name="lastName" 
                            type="text" 
                            required 
                            placeholder="Introduzca sus apellidos" 
                        />

                        
                        <Input 
                            label="Confirmar Contraseña" 
                            name="password_confirm" 
                            type="password" 
                            required 
                            placeholder="Confirme su contraseña" 
                        />

                        <Input 
                            label="Número de Teléfono" 
                            name="phone_number" 
                            type="phone" 
                            required 
                            placeholder="Introduzca su número de teléfono" 
                        />
                    </div>
                </div>

                <Input 
                    label="Correo electrónico" 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="Introduzca su email" 
                />

                <Select
                    placeholder="Selecciona tu comunidad autónoma"
                    options={comunidades.map(comunidad => ({ value: comunidad.id, label: comunidad.name }))}
                    handleSelectOption={(value) => setSelectedCountry(value)}
                    label="País"
                    required
                    name="autonomous_region"
                />

                {selectedCountry && (
                    <Select
                        placeholder="Selecciona tu ciudad"
                        options={comunidades.find(comunidad => comunidad.id === selectedCountry).provincias}
                        label="Ciudad"
                        required
                        name="city"
                    />
                )}

                <Button
                    type="submit"
                    text="Registrarme"
                    className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-all"
                />
            </FormProvider>

            <p className="text-center text-gray-400">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-primary hover:text-blue-700">
                    Iniciar sesión
                </Link>
            </p>
        </div>
    )
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginContext } from "@/context/LoginContext";
import { MapPin, Clock, Shield, User } from "lucide-react"
import { useContext, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatDateTimeDisplay } from "@/utils/formatTime";
import { Badge } from "@/components/ui/badge";
import { FormProvider } from "@/context/FormProvider";
import { updateProfileSchema, updatePasswordSchema } from "@/api/schemas/schemaUser";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SportContext } from "@/context/SportContext";
import { updateUser } from "@/api/request/put/users/updateUser";
import { toast } from "react-toastify";
import { formatDateToInput } from "@/utils/formatDate";
import { generateError } from "@/utils/generateError";
import { updatePassword } from "@/api/request/patch/users/updatePassword";

export const Perfil = () => {
    const { login } = useContext(LoginContext);
    const [activeTab, setActiveTab] = useState("personal");
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
        name: login?.name || "",
        lastName: login?.lastName || "",
        email: login?.email || "",
        phone_number: login?.phone_number || "",
        birthdate: formatDateToInput(login?.birthdate) || "",
        city: login?.city || "",
        autonomous_region: login?.autonomous_region || "",
        main_sport_id: login?.main_sport_id || null,
    });
    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const { sports } = useContext(SportContext);

    //Petición para actualizar el perfil del usuario
    const handleSave = async (formValue) => {
        try{
            setIsEditing((prev) => !prev);
            const response = await updateUser(login?.email,{ data: formValue});
            if(response.status!==200){
                generateError(response.message);
            }else{
                toast.success(response.message || 'Perfil actualizado correctamente');
            }
        }catch(error){
            toast.error(error.message);
        }
    };

    const handleUpdatePassword = async (formValue) => {
        try{
            const data = {
                current_password: formValue.currentPassword,
                password: formValue.confirmPassword
            }
            const response = await updatePassword(login.email, {data: data});
            if(response.status!==200){
                generateError(response.message, response.status);
            }else{
                toast.success(response.message);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    //Función para activar el modo edición de perfil del usuario
    const handleEdit = () => {
        setIsEditing((prev) => !prev)
    }

    return(
        <>
            <div className="min-h-screen bg-white shadow-lg p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">

                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold">{login?.name} {login?.lastName}</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                {login?.city}, {login?.autonomous_region}
                            </p>
                        </div>
                    </div>

                    <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-3 mb-8 gap-1">
                            <TabsTrigger
                                value="personal"
                                className="p-2 shadow-lg data-[state=active]:bg-primary data-[state=active]:text-white rounded-md"
                            >
                                <User className="h-4 w-4 mr-2" />
                                Información personal
                            </TabsTrigger>
                            <TabsTrigger
                                value="password"
                                className="p-2 shadow-lg data-[state=active]:bg-primary data-[state=active]:text-white rounded-md"
                            >
                                <User className="h-4 w-4 mr-2" />
                                Gestionar contraseña
                            </TabsTrigger>
                            <TabsTrigger
                                value="account"
                                className="p-2 shadow-lg data-[state=active]:bg-primary data-[state=active]:text-white rounded-md"
                            >
                                <Shield className="h-4 w-4 mr-2" />
                                Cuenta
                            </TabsTrigger>
                        </TabsList>

                        {/* Pestaña de información personal */}
                        <TabsContent value="personal">
                            <Card className="border-none shadow-none">
                                <CardHeader>
                                    <CardTitle>Actualizar Perfil</CardTitle>
                                    <CardDescription>Modifica tus datos personales</CardDescription>
                                </CardHeader>
                                <FormProvider
                                    initialValue={user}
                                    schema={updateProfileSchema}
                                    onSubmit={handleSave}
                                    clase="space-y-6"
                                >
                                    {/* Información personal */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            name="name"
                                            label="Nombre"
                                            placeholder="Nombre"
                                            disabled={!isEditing}
                                        />
                                        <Input
                                            name="lastName"
                                            label="Apellidos"
                                            placeholder="Apellidos"
                                            disabled={!isEditing}
                                        />
                                        <Input
                                            name="email"
                                            label="Correo electrónico"
                                            placeholder="Correo electrónico"
                                            type="email"
                                            disabled={!isEditing}
                                        />
                                        <Input
                                            name="phone_number"
                                            label="Teléfono"
                                            placeholder="Teléfono"
                                            type="tel"
                                            disabled={!isEditing}
                                        />
                                        <Input
                                            name="birthdate"
                                            label="Fecha de nacimiento"
                                            placeholder="Fecha de nacimiento"
                                            type="date"
                                            disabled={!isEditing}
                                        />
                                        <Input
                                            name="city"
                                            label="Ciudad"
                                            placeholder="Ciudad"
                                            disabled={!isEditing}
                                        />
                                        <Input
                                            name="autonomous_region"
                                            label="Comunidad Autónoma"
                                            placeholder="Comunidad Autónoma"
                                            disabled={!isEditing}
                                        />
                                        <Select
                                            name="main_sport_id"
                                            label="Deporte principal"
                                            options={sports.map((sport) => ({
                                                value: sport.id,
                                                label: sport.name
                                            }))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    {isEditing && (
                                        <Button type="submit" className="mt-4">
                                            Guardar
                                        </Button>
                                    )}
                                </FormProvider>
                                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        handleOnClick={() => handleEdit()}
                                    >
                                        {isEditing ? "Cancelar" : "Editar perfil"}
                                    </Button>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="password">
                            <Card className="mt-8 border-none shadow-none">
                                <CardHeader>
                                    <CardTitle>Actualizar contraseña</CardTitle>
                                    <CardDescription>Cambia tu contraseña de acceso</CardDescription>
                                </CardHeader>
                                <FormProvider
                                    initialValue={password}
                                    schema={updatePasswordSchema}
                                    onSubmit={handleUpdatePassword}
                                    clase="space-y-6"
                                >
                                    <Input
                                        name="currentPassword"
                                        label="Contraseña actual"
                                        type="password"
                                        placeholder="Introduce tu contraseña actual"
                                    />
                                    <Input
                                        name="newPassword"
                                        label="Nueva contraseña"
                                        type="password"
                                        placeholder="Introduce la nueva contraseña"
                                    />
                                    <Input
                                        name="confirmPassword"
                                        label="Confirmar nueva contraseña"
                                        type="password"
                                        placeholder="Repite la nueva contraseña"
                                    />
                                    <Button type="submit" className="mt-4">
                                        Actualizar contraseña
                                    </Button>
                                </FormProvider>
                            </Card>
                        </TabsContent>

                        {/* Pestaña de cuenta */}
                        <TabsContent value="account">
                            <Card className="border-none shadow-none">
                            <CardHeader>
                                <CardTitle>Información de la cuenta</CardTitle>
                                <CardDescription>Detalles sobre la cuenta y permisos del usuario</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo de cuenta</p>
                                        <div>
                                            {login?.admin ? <Badge className="bg-amber-500">Administrador</Badge> : <Badge>Usuario</Badge>}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de creación</p>
                                        <p className="font-medium flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                            {formatDateTimeDisplay(login?.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
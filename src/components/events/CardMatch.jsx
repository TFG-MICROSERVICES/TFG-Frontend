import { useContext, useState } from "react";
import { FormProvider } from "@/context/FormProvider";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateResult } from "@/api/request/put/events/updateResult";
import { generateError } from "@/utils/generateError";
import { toast } from "react-toastify";
import { updateSchemaResult } from "@/api/schemas/schemaResult";
import { LoginContext } from "@/context/LoginContext";

// Helper para formatear fecha a yyyy-MM-ddTHH:mm para input datetime-local
function formatDateTimeLocal(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Ajuste para zona horaria local
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
}

export const CardMatch = ({ match, teams, refetch, event}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [result, setResult] = useState({
        score_home: match.score_home ?? 0,
        score_away: match.score_away ?? 0,
        playedAt: match.playedAt ? formatDateTimeLocal(match.playedAt) : "",
    });
    const { login } = useContext(LoginContext);

    // Helper para mostrar nombre de equipo por id (si tienes teams)
    const getTeamName = (id) => {
        if (!teams) return id;
        const team = teams.find(t => t.id === id);
        return team ? team.name : id;
    };

    const handleSubmit = async (formValue) => {
        try {
            setIsEditing(false);
            console.log(formValue);
            const response = await updateResult(match.id, { data: formValue });

            if (response.status !== 200) {
                generateError(response.message, response.status);
            } else {
                toast.success(response.message);
                refetch && refetch();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center">
                <div className="flex-1 text-right font-medium">{getTeamName(match?.home_team_id)}</div>
                <div className="mx-4 flex items-center">
                    {isEditing ? (
                        <FormProvider
                            initialValue={result}
                            schema={updateSchemaResult}
                            onSubmit={handleSubmit}
                            clase="flex flex-col md:flex-row items-center gap-4 w-full"
                        >
                            <div className="flex flex-col gap-2 w-full md:w-auto">
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col items-center">
                                        <label className="text-xs text-gray-500 mb-1">Local</label>
                                        <Input
                                            name="score_home"
                                            type="number"
                                            min={0}
                                            clase="w-16 text-center"
                                            label=""
                                        />
                                    </div>
                                    <span className="text-gray-400 text-lg font-bold">-</span>
                                    <div className="flex flex-col items-center">
                                        <label className="text-xs text-gray-500 mb-1">Visitante</label>
                                        <Input
                                            name="score_away"
                                            type="number"
                                            min={0}
                                            clase="w-16 text-center"
                                            label=""
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col mt-2">
                                    <label className="text-xs text-gray-500 mb-1">Fecha y hora</label>
                                    <Input
                                        name="playedAt"
                                        type="datetime-local"
                                        clase="w-56"
                                        label=""
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 md:mt-0">
                                <Button type="submit" clase="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">
                                    Guardar
                                </Button>
                                <Button
                                    type="button"
                                    clase="px-3 py-1 text-xs bg-gray-100 text-black rounded hover:bg-gray-200"
                                    handleOnClick={() => setIsEditing(false)}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </FormProvider>
                    ) : match?.playedAt ? (
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center">
                                <span className="font-bold text-lg mx-1">{match?.score_home}</span>
                                <span className="text-gray-400 mx-1">-</span>
                                <span className="font-bold text-lg mx-1">{match?.score_away}</span>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                                {new Date(match.playedAt).toLocaleString()}
                            </span>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1 rounded">vs</div>
                    )}
                </div>
                <div className="flex-1 text-left font-medium">{getTeamName(match?.away_team_id)}</div>
                {!isEditing && (login?.admin || login?.user_id === event?.owner?.user_id) && (
                    <button
                        className="ml-4 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                        onClick={() => setIsEditing(true)}
                        title="Editar resultado"
                    >
                        Editar
                    </button>
                )}
            </div>
        </div>
    );
}
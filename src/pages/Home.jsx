import { useMemo, useContext } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Calendar,
    MapPin,
    Users,
    Crown,
    CalendarDays,
    Timer,
    CheckCircle,
    Eye,
    EyeOff,
} from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { SportContext } from "@/context/SportContext"
import { formatDate } from "@/utils/formatDate"
import { formatDateTime } from "@/utils/formatTime"

export const Home = () => {
    const { events, teams } = useOutletContext();
    const { selectedSport } = useContext(SportContext);
    const navigate = useNavigate();

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    const getEventStatus = (event) => {
        const now = new Date()
        const startTime = new Date(event.start_time)
        const endTime = new Date(event.end_time)
        const registrationEnd = new Date(event.registration_end)

        if (now > endTime) {
            return "Finalizado"
        } else if (now >= startTime && now <= endTime) {
            return "En curso"
        } else if (now < startTime && now > registrationEnd) {
            return "Próximo"
        } else if (now <= registrationEnd) {
            return "Inscripciones abiertas"
        }
        return "Próximo"
    }

    const getEventStatusBadge = (status) => {
        switch (status) {
            case "Finalizado":
                return <Badge className="bg-gray-500">Finalizado</Badge>
            case "En curso":
                return <Badge className="bg-green-500">En curso</Badge>
            case "Próximo":
                return <Badge className="bg-blue-500">Próximo</Badge>
            case "Inscripciones abiertas":
                return <Badge className="bg-amber-500">Inscripciones abiertas</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const filteredTeams = useMemo(() => {
        console.log(teams)
        if (selectedSport === "all") return teams
        return teams.filter((team) => team.sport_id === selectedSport.id)
    }, [selectedSport])

    const filteredEvents = useMemo(() => {
        if (selectedSport === "all") return events
        return events.filter((event) => event.sport_id === selectedSport.id)
    }, [selectedSport])

    const { pastEvents, upcomingEvents } = useMemo(() => {
        const now = new Date()
        const past = filteredEvents.filter((event) => new Date(event.end_time) < now)
        const upcoming = filteredEvents.filter((event) => new Date(event.end_time) >= now)
        return { pastEvents: past, upcomingEvents: upcoming }
    }, [filteredEvents])

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Encabezado */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400">Gestiona tus equipos y eventos deportivos</p>
                    </div>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-4 bg-white rounded-lg">
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-blue-500 mr-3" />
                                <div>
                                    <p className="text-2xl font-bold">{filteredTeams.length}</p>
                                    <p className="text-sm text-gray-500">Mis Equipos</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 bg-white rounded-lg">
                            <div className="flex items-center">
                                <Calendar className="h-8 w-8 text-green-500 mr-3" />
                                <div>
                                    <p className="text-2xl font-bold">{upcomingEvents.length}</p>
                                    <p className="text-sm text-gray-500">Próximos Eventos</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 bg-white rounded-lg">
                            <div className="flex items-cente">
                                <CheckCircle className="h-8 w-8 text-gray-500 mr-3" />
                                <div>
                                    <p className="text-2xl font-bold">{pastEvents.length}</p>
                                    <p className="text-sm text-gray-500">Eventos Pasados</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 bg-white rounded-lg">
                            <div className="flex items-center">
                                <Crown className="h-8 w-8 text-amber-500 mr-3" />
                                <div>
                                    <p className="text-2xl font-bold">{filteredTeams.filter((team) => team.is_captain).length}</p>
                                    <p className="text-sm text-gray-500">Capitanías</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Contenido principal */}
                <Tabs defaultValue="teams" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger
                            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
                            value="teams"
                        >
                            Mis Equipos
                        </TabsTrigger>
                        <TabsTrigger
                            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
                            value="upcoming"
                        >
                            Próximos Eventos
                        </TabsTrigger>
                        <TabsTrigger
                            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg"
                            value="past"
                        >
                            Eventos Pasados
                        </TabsTrigger>
                    </TabsList>

                    {/* Mis Equipos */}
                    <TabsContent value="teams">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTeams.length > 0 ? (
                                filteredTeams.map((userTeam) => (
                                    <Card key={userTeam.id} className="hover:shadow-lg bg-white transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">{userTeam.team.name}</CardTitle>
                                                <div className="flex items-center space-x-2">
                                                    {userTeam.is_captain && (
                                                        <Badge className="bg-amber-500">
                                                            <Crown className="h-3 w-3 mr-1" />
                                                            Capitán
                                                        </Badge>
                                                    )}
                                                    {userTeam.team.public ? (
                                                        <Eye className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex items-center">
                                                    <Avatar className="h-10 w-10 mr-3">
                                                        <AvatarFallback>{getInitials(userTeam.team.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">ID: {userTeam.team.id}</p>
                                                    </div>
                                                </div>

                                                <div className="text-sm text-gray-500">
                                                    <p>Creado: {formatDate(userTeam.team.createdAt)}</p>
                                                    <p>Visibilidad: {userTeam.team.public ? "Público" : "Privado"}</p>
                                                </div>

                                                <Button className="w-full" variant="outline" handleOnClick={() => navigate('/equipos')}>
                                                    Ver Equipo
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-medium mb-2">No tienes equipos</h3>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Próximos Eventos */}
                    <TabsContent value="upcoming">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event) => (
                                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-xl">{event.name}</CardTitle>
                                                {getEventStatusBadge(getEventStatus(event))}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <p className="text-gray-600 dark:text-gray-400">{event.description}</p>

                                                <div className="space-y-2">
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                                                        <span>Inicio: {formatDateTime(event.start_time)}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Timer className="h-4 w-4 mr-2 text-gray-500" />
                                                        <span>Fin: {formatDateTime(event.end_time)}</span>
                                                    </div>
                                                </div>

                                                <div className="border-t pt-3">
                                                    <p className="text-sm text-gray-500">
                                                        Inscripciones hasta: {formatDateTime(event.registration_end)}
                                                    </p>
                                                </div>

                                                <Button className="w-full">Ver Evento</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-medium mb-2">No hay próximos eventos</h3>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Eventos Pasados */}
                    <TabsContent value="past">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pastEvents.length > 0 ? (
                                pastEvents.map((event) => (
                                    <Card key={event.id} className="hover:shadow-lg transition-shadow opacity-75">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-xl">{event.name}</CardTitle>
                                                {getEventStatusBadge(getEventStatus(event))}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <p className="text-gray-600 dark:text-gray-400">{event.description}</p>

                                                <div className="space-y-2">
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                                                        <span>Inicio: {formatDateTime(event.start_time)}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Timer className="h-4 w-4 mr-2 text-gray-500" />
                                                        <span>Fin: {formatDateTime(event.end_time)}</span>
                                                    </div>
                                                </div>

                                                <Button className="w-full" variant="outline">
                                                    Ver Resultados
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-medium mb-2">No hay eventos pasados</h3>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
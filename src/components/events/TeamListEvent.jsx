"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Calendar, MapPin, Mail, Phone } from "lucide-react"
import { SearchBar } from "../ui/SearchBar"
import { formatDateTime } from "@/utils/formatTime"

export const TeamsListEvent = ({ teams }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTeam, setExpandedTeam] = useState("");

  console.log(searchTerm);

  // Filtrar equipos por término de búsqueda
  const filteredTeams = teams.filter((team) => team?.name?.toLowerCase().includes(searchTerm?.toLowerCase()))

  // Función para obtener las iniciales de un nombre
  const getInitials = (name, lastName) => {
    const firstInitial = name ? name.charAt(0) : ""
    const lastInitial = lastName ? lastName.charAt(0) : ""
    return (firstInitial + lastInitial).toUpperCase()
  }

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="w-full rounded-lg bg-primary text-white px-6 py-4 mb-4">
            <h1 className="text-3xl font-bold text-center md:text-left">Equipos</h1>
            <p className="text-white text-center md:text-left">
              Listado de equipos y sus integrantes
            </p>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <SearchBar setSearch={handleSearch} text="Buscar equipos" />
        </div>

        {/* Contador de resultados */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Mostrando {filteredTeams.length} de {teams?.length} equipos
          </p>
        </div>

        {/* Listado de equipos */}
        <div className="space-y-6">
          <Accordion
            type="single"
            collapsible
            value={expandedTeam}
            onValueChange={setExpandedTeam}
            className="space-y-4"
          >
            {filteredTeams.map((team) => (
              <AccordionItem key={team.id} value={team.id.toString()} className="border rounded-lg overflow-hidden bg-white">
                <Card className="border-0 shadow-none bg-white">
                  <CardHeader className="p-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex flex-col md:flex-row md:items-center w-full text-left">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{team.name}</CardTitle>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            Creado: {formatDateTime(team.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0">
                          <Badge variant="outline" className="mr-2">
                            ID: {team.id}
                          </Badge>
                          <Badge className="bg-primary text-white">
                            <Users className="h-3 w-3 mr-1" />
                            {team.user_teams.length} {team.user_teams.length === 1 ? "miembro" : "miembros"}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                  </CardHeader>
                </Card>
                <AccordionContent>
                  <CardContent className="pt-0 pb-4">
                    <div className="mb-4 p-4 bg-gray-50 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">ID del deporte</p>
                          <p className="font-medium">{team.sport_id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Visibilidad</p>
                          <p className="font-medium">{team.public ? "Público" : "Privado"}</p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium mb-4">Integrantes del equipo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {team.user_teams.map((member) => (
                        <div
                          key={member.id}
                          className="flex flex-col p-4 border rounded-md hover:bg-gray-50"
                        >
                          <div className="flex items-center mb-3">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback>{getInitials(member.name, member.lastName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {member.name} {member.lastName}
                              </p>
                              <p className="text-sm text-gray-500">ID: {member.id}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{member.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{member.phone_number}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Fecha de nacimiento: {formatDate(member.birthdate)}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span>
                                {member.city}, {member.autonomous_region}
                              </span>
                            </div>
                          </div>

                          {member.main_sport_id && (
                            <div className="mt-2">
                              <Badge variant="outline">Deporte principal: {member.main_sport_id}</Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {team.user_teams.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Este equipo no tiene integrantes
                      </div>
                    )}
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredTeams.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">
                No se encontraron equipos que coincidan con la búsqueda
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

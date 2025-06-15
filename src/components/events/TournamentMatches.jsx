"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react"
import { CardMatch } from "./CardMatch"

// Función para convertir el número de ronda a un nombre legible
const getRoundName = (roundNumber) => {
  switch (roundNumber) {
    case 64:
      return "64avos de Final"
    case 32:
      return "32avos de Final"
    case 16:
      return "16avos de Final"
    case 8:
      return "Octavos de Final"
    case 4:
      return "Cuartos de Final"
    case 2:
      return "Semifinales"
    case 1:
      return "Final"
    default:
      return `Ronda de ${roundNumber}`
  }
}

const getStatusLabel = (status) => {
    switch (status) {
        case '0':
            return 'Borrador';
        case '1':
            return 'Activo';
        case '2':
            return 'Cancelado';
        case '3':
            return 'Finalizado';
        default:
            return 'Desconocido';
    }
};

export default function TournamentMatches({ teams = [], event = {}, results = [], refetch }) {
  const availableRounds = useMemo(
    () => [...new Set(results.map((result) => result.round))].sort((a, b) => b - a),
    [results]
  )

  // Establecer la ronda seleccionada (por defecto, la primera disponible)
  const [selectedRound, setSelectedRound] = useState(availableRounds[0] || 1)

  // Filtrar los partidos por la ronda seleccionada
  const currentMatches = results.filter((match) => match.round === selectedRound)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado del torneo */}
        <div className="bg-primary text-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{event?.name}</h1>
              <div className="flex items-center mt-2">
                <span>ID del torneo: {event?.id}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-amber-300" />
              <div>
                <Badge className="bg-blue-600">{getStatusLabel(event?.status)}</Badge>
                <p className="text-sm mt-1">
                  Ronda actual: <strong>{getRoundName(selectedRound)}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación entre rondas */}
        <div className="flex justify-between items-center mb-6">
          <Button
            clase="max-w-1/2"
            handleOnClick={() => {
              const idx = availableRounds.indexOf(selectedRound)
              if (idx > 0) setSelectedRound(availableRounds[idx - 1])
            }}
            disabled={availableRounds.indexOf(selectedRound) === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Ronda anterior
          </Button>

          <h2 className="text-2xl font-bold text-center">{getRoundName(selectedRound)}</h2>

          <Button
            clase="max-w-1/2"
            handleOnClick={() => {
              const idx = availableRounds.indexOf(selectedRound)
              if (idx < availableRounds.length - 1) setSelectedRound(availableRounds[idx + 1])
            }}
            disabled={availableRounds.indexOf(selectedRound) === availableRounds.length - 1}
          >
            Ronda siguiente
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Tabs para seleccionar ronda específica */}
        <Tabs
          value={selectedRound.toString()}
          onValueChange={(value) => setSelectedRound(Number.parseInt(value))}
          className="mb-6"
        >
          <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${availableRounds.length}, 1fr)` }}>
            {availableRounds.map((round) => (
              <TabsTrigger key={round} value={round.toString()} className="text-xs md:text-sm">
                {getRoundName(round)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Enfrentamientos de la ronda seleccionada */}
        <div className={`grid ${currentMatches.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
          {currentMatches.length > 0 ? (
            currentMatches.map((match) => (
              <CardMatch
                key={match.id}
                match={match}
                teams={teams}
                event={event}
                refetch={typeof refetch !== "undefined" ? refetch : undefined}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
              <h3 className="text-xl font-bold mb-2">No hay enfrentamientos disponibles</h3>
              <p className="text-gray-500">
                Los enfrentamientos para esta ronda aún no han sido definidos o no están disponibles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

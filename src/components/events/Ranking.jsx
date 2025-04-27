"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Datos de los equipos
const teamsData = [
  {
    id: 1,
    name: "Real Madrid",
    played: 38,
    won: 28,
    drawn: 8,
    lost: 2,
    goalsFor: 89,
    goalsAgainst: 28,
    points: 92,
  },
  {
    id: 2,
    name: "Barcelona",
    played: 38,
    won: 27,
    drawn: 5,
    lost: 6,
    goalsFor: 85,
    goalsAgainst: 34,
    points: 86,
  },
  {
    id: 3,
    name: "Atlético Madrid",
    played: 38,
    won: 24,
    drawn: 7,
    lost: 7,
    goalsFor: 70,
    goalsAgainst: 35,
    points: 79,
  },
  {
    id: 4,
    name: "Girona",
    played: 38,
    won: 23,
    drawn: 8,
    lost: 7,
    goalsFor: 78,
    goalsAgainst: 48,
    points: 77,
  },
  {
    id: 5,
    name: "Athletic Club",
    played: 38,
    won: 19,
    drawn: 11,
    lost: 8,
    goalsFor: 59,
    goalsAgainst: 39,
    points: 68,
  },
  {
    id: 6,
    name: "Real Sociedad",
    played: 38,
    won: 16,
    drawn: 13,
    lost: 9,
    goalsFor: 51,
    goalsAgainst: 38,
    points: 61,
  },
  {
    id: 7,
    name: "Betis",
    played: 38,
    won: 15,
    drawn: 14,
    lost: 9,
    goalsFor: 48,
    goalsAgainst: 42,
    points: 59,
  },
  {
    id: 8,
    name: "Valencia",
    played: 38,
    won: 15,
    drawn: 8,
    lost: 15,
    goalsFor: 43,
    goalsAgainst: 45,
    points: 53,
  },
  {
    id: 9,
    name: "Villarreal",
    played: 38,
    won: 14,
    drawn: 9,
    lost: 15,
    goalsFor: 56,
    goalsAgainst: 57,
    points: 51,
  },
  {
    id: 10,
    name: "Osasuna",
    played: 38,
    won: 13,
    drawn: 10,
    lost: 15,
    goalsFor: 42,
    goalsAgainst: 50,
    points: 49,
  },
  {
    id: 11,
    name: "Getafe",
    played: 38,
    won: 11,
    drawn: 15,
    lost: 12,
    goalsFor: 44,
    goalsAgainst: 48,
    points: 48,
  },
  {
    id: 12,
    name: "Alavés",
    played: 38,
    won: 12,
    drawn: 9,
    lost: 17,
    goalsFor: 37,
    goalsAgainst: 49,
    points: 45,
  },
  {
    id: 13,
    name: "Sevilla",
    played: 38,
    won: 11,
    drawn: 11,
    lost: 16,
    goalsFor: 46,
    goalsAgainst: 53,
    points: 44,
  },
  {
    id: 14,
    name: "Las Palmas",
    played: 38,
    won: 12,
    drawn: 7,
    lost: 19,
    goalsFor: 36,
    goalsAgainst: 54,
    points: 43,
  },
  {
    id: 15,
    name: "Mallorca",
    played: 38,
    won: 9,
    drawn: 15,
    lost: 14,
    goalsFor: 34,
    goalsAgainst: 43,
    points: 42,
  },
  {
    id: 16,
    name: "Rayo Vallecano",
    played: 38,
    won: 9,
    drawn: 14,
    lost: 15,
    goalsFor: 33,
    goalsAgainst: 49,
    points: 41,
  },
  {
    id: 17,
    name: "Celta Vigo",
    played: 38,
    won: 9,
    drawn: 12,
    lost: 17,
    goalsFor: 43,
    goalsAgainst: 56,
    points: 39,
  },
  {
    id: 18,
    name: "Cádiz",
    played: 38,
    won: 5,
    drawn: 16,
    lost: 17,
    goalsFor: 28,
    goalsAgainst: 54,
    points: 31,
  },
  {
    id: 19,
    name: "Granada",
    played: 38,
    won: 5,
    drawn: 9,
    lost: 24,
    goalsFor: 36,
    goalsAgainst: 71,
    points: 24,
  },
  {
    id: 20,
    name: "Almería",
    played: 38,
    won: 3,
    drawn: 10,
    lost: 25,
    goalsFor: 35,
    goalsAgainst: 77,
    points: 19,
  },
]

export const Ranking = () => {
  const [teams, setTeams] = useState(teamsData)
  const [sortKey, setSortKey] = useState("points")
  const [sortDirection, setSortDirection] = useState("desc")

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("desc")
    }

    const sortedTeams = [...teams].sort((a, b) => {
      let valueA, valueB

      if (key === "goalDiff") {
        valueA = a.goalsFor - a.goalsAgainst
        valueB = b.goalsFor - b.goalsAgainst
      } else {
        valueA = a[key]
        valueB = b[key]
      }

      if (sortDirection === "asc") {
        return valueA - valueB
      } else {
        return valueB - valueA
      }
    })

    setTeams(sortedTeams)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-center md:text-left">La Liga</h1>
            <p className="text-gray-500 dark:text-gray-400 text-center md:text-left">Temporada 2024/2025</p>
          </div>
        </div>

        <div className="bg-whiterounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto bg-white rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">Pos</TableHead>
                  <TableHead className="min-w-[200px]">Equipo</TableHead>
                  <TableHead className="w-12 text-center">PJ</TableHead>
                  <TableHead className="w-12 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("won")}
                      className="p-0 h-auto font-semibold"
                    >
                      V <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-12 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("drawn")}
                      className="p-0 h-auto font-semibold"
                    >
                      E <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-12 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("lost")}
                      className="p-0 h-auto font-semibold"
                    >
                      D <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-12 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("goalsFor")}
                      className="p-0 h-auto font-semibold"
                    >
                      GF <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-12 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("goalsAgainst")}
                      className="p-0 h-auto font-semibold"
                    >
                      GC <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-12 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("goalDiff")}
                      className="p-0 h-auto font-semibold"
                    >
                      DG <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-12 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("points")}
                      className="p-0 h-auto font-semibold"
                    >
                      PTS <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-12 text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Últimos 5 partidos</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow key={team.id}>
                    <TableCell className="text-center font-semibold">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-medium">{team.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{team.played}</TableCell>
                    <TableCell className="text-center">{team.won}</TableCell>
                    <TableCell className="text-center">{team.drawn}</TableCell>
                    <TableCell className="text-center">{team.lost}</TableCell>
                    <TableCell className="text-center">{team.goalsFor}</TableCell>
                    <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                    <TableCell className="text-center font-medium">
                      {team.goalsFor - team.goalsAgainst > 0 ? "+" : ""}
                      {team.goalsFor - team.goalsAgainst}
                    </TableCell>
                    <TableCell className="text-center font-bold">{team.points}</TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-1">{generateLastFiveMatches(team.id)}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3">Leyenda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Abreviaturas</h3>
              <ul className="grid grid-cols-2 gap-2">
                <li className="flex items-center">
                  <span className="font-bold mr-2">PJ:</span> Partidos jugados
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">V:</span> Victorias
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">E:</span> Empates
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">D:</span> Derrotas
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">GF:</span> Goles a favor
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">GC:</span> Goles en contra
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">DG:</span> Diferencia de goles
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">PTS:</span> Puntos
                </li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Criterios de clasificación</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>Mayor número de puntos</li>
                <li>Diferencia de goles particular</li>
                <li>Mayor número de goles marcados</li>
                <li>Juego limpio (menos tarjetas)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Función para generar aleatoriamente los últimos 5 resultados
function generateLastFiveMatches(teamId) {
  // Usamos el ID del equipo como semilla para que los resultados sean consistentes
  const results = []

  for (let i = 0; i < 5; i++) {
    // Generamos un número pseudo-aleatorio basado en el ID del equipo y la posición
    const seed = (teamId * 10 + i) % 10

    if (seed < 5) {
      results.push(<div key={i} className="w-3 h-3 rounded-full bg-green-500" title="Victoria" />)
    } else if (seed < 8) {
      results.push(<div key={i} className="w-3 h-3 rounded-full bg-gray-400" title="Empate" />)
    } else {
      results.push(<div key={i} className="w-3 h-3 rounded-full bg-red-500" title="Derrota" />)
    }
  }

  return results
}

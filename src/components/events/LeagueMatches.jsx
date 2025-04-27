"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Función para generar el calendario de la liga
// function generateFixtures(teams) {
//   const fixtures = []
//   const numTeams = teams.length
//   const numRounds = numTeams - 1
//   const matchesPerRound = numTeams / 2

//   // Crear una copia de los equipos sin el primero
//   const teamsCopy = [...teams]
//   const firstTeam = teamsCopy.shift()

//   // Primera vuelta
//   for (let round = 0; round < numRounds; round++) {
//     const roundMatches = []

//     // Primer partido: primer equipo vs equipo rotativo
//     roundMatches.push({
//       home: round % 2 === 0 ? firstTeam : teamsCopy[0],
//       away: round % 2 === 0 ? teamsCopy[0] : firstTeam,
//       result: generateResult(round, 0),
//     })

//     // Resto de partidos
//     for (let match = 1; match < matchesPerRound; match++) {
//       const homeIndex = match
//       const awayIndex = numTeams - 2 - match

//       roundMatches.push({
//         home: round % 2 === 0 ? teamsCopy[homeIndex] : teamsCopy[awayIndex],
//         away: round % 2 === 0 ? teamsCopy[awayIndex] : teamsCopy[homeIndex],
//         result: generateResult(round, match),
//       })
//     }

//     fixtures.push({
//       round: round + 1,
//       matches: roundMatches,
//       date: generateRoundDate(round),
//     })

//     // Rotar equipos para la siguiente ronda (algoritmo de rotación)
//     teamsCopy.push(teamsCopy.shift())
//   }

//   // Segunda vuelta (invertir local y visitante)
//   for (let round = 0; round < numRounds; round++) {
//     const firstRoundMatches = fixtures[round].matches
//     const roundMatches = firstRoundMatches.map((match) => ({
//       home: match.away,
//       away: match.home,
//       result: generateResult(round + numRounds, 0),
//     }))

//     fixtures.push({
//       round: round + numRounds + 1,
//       matches: roundMatches,
//       date: generateRoundDate(round + numRounds),
//     })
//   }

//   return fixtures
// }


export const LeagueMatches = ({teams}) => {
  const [currentRound, setCurrentRound] = useState(1)
  const [viewMode, setViewMode] = useState("list")
  const [totalRounds, setTotalRounds] = useState(0);
  const [matches, setMatches] = useState([]);

  const handlePrevRound = () => {
    setCurrentRound((prev) => Math.max(prev - 1, 1))
  }

  const handleNextRound = () => {
    setCurrentRound((prev) => Math.min(prev + 1, totalRounds))
  }

  useEffect(() => {
    if(teams){
        const total = (teams.length - 1) / 2;
        setTotalRounds(total);
    }
  },[teams])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-center md:text-left">La Liga</h1>
            <p className="text-gray-500 dark:text-gray-400 text-center md:text-left">
              Calendario de Partidos - Temporada 2024/2025
            </p>
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full" onValueChange={setViewMode}>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="list">Lista de Jornadas</TabsTrigger>
              <TabsTrigger value="calendar">Calendario Completo</TabsTrigger>
            </TabsList>

            {viewMode === "list" && (
              <div className="flex items-center  mt-4 sm:mt-0">
                <Button variant="outline" size="icon" onClick={handlePrevRound} disabled={currentRound === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="mx-4 font-medium">
                  Jornada {currentRound} de {totalRounds}
                </div>
                <Button variant="outline" size="icon" onClick={handleNextRound} disabled={currentRound === totalRounds}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="list" className="mt-0">
            <Card>
              <CardContent className="p-4 md:p-6 bg-white">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold">Jornada {currentRound}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex justify-center items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {matches.length}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {matches && matches[currentRound - 1]?.map((match, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 text-right font-medium">{match.home}</div>
                        <div className="mx-4 flex items-center">
                          {match.result ? (
                            <div className="flex items-center justify-center">
                              <span className="font-bold text-lg mx-1">{match.result.home}</span>
                              <span className="text-gray-400 mx-1">-</span>
                              <span className="font-bold text-lg mx-1">{match.result.away}</span>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1 rounded">vs</div>
                          )}
                        </div>
                        <div className="flex-1 text-left font-medium">{match.away}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-8">
                  {matches.map((round, roundIndex) => (
                    <div key={roundIndex} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Jornada {round.round}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {round.date}
                        </p>
                      </div>

                      <div className="grid gap-2">
                        {round.matches.map((match, matchIndex) => (
                          <div
                            key={matchIndex}
                            className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100"
                          >
                            <div className="flex-1 text-right">{match.home}</div>
                            <div className="mx-4 flex items-center">
                              {match.result ? (
                                <div className="flex items-center justify-center">
                                  <span className="font-bold mx-1">{match.result.home}</span>
                                  <span className="text-gray-400 mx-1">-</span>
                                  <span className="font-bold mx-1">{match.result.away}</span>
                                </div>
                              ) : (
                                <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded">vs</div>
                              )}
                            </div>
                            <div className="flex-1 text-left">{match.away}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-3">Información</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span>La temporada consta de 38 jornadas (ida y vuelta)</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span>Cada equipo juega un total de 38 partidos (19 como local y 19 como visitante)</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span>Las fechas pueden estar sujetas a cambios por televisión o competiciones europeas</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">•</span>
              <span>Los resultados se muestran para partidos ya disputados</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

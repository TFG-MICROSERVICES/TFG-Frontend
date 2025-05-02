import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const LeagueMatches = ({ teams, matchesData }) => {
  const [currentRound, setCurrentRound] = useState(1)
  const [viewMode, setViewMode] = useState("list")

  // Agrupa los partidos por jornada (round)
  const rounds = useMemo(() => {
    if (!matchesData) return [];
    const grouped = {};
    matchesData.forEach(match => {
      if (!grouped[match.round]) grouped[match.round] = [];
      grouped[match.round].push(match);
    });
    // Devuelve un array ordenado por round
    return Object.entries(grouped)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([round, matches]) => ({
        round: Number(round),
        matches
      }));
  }, [matchesData]);

  const totalRounds = rounds.length;

  const handlePrevRound = () => {
    setCurrentRound((prev) => Math.max(prev - 1, 1))
  }

  const handleNextRound = () => {
    setCurrentRound((prev) => Math.min(prev + 1, totalRounds))
  }

  // Si cambia el número de jornadas, ajusta la jornada actual
  useEffect(() => {
    if (currentRound > totalRounds) setCurrentRound(1);
  }, [totalRounds]);

  // Helper para mostrar nombre de equipo por id (si tienes teams)
  const getTeamName = (id) => {
    if (!teams) return id;
    const team = teams.find(t => t.id === id);
    return team ? team.name : id;
  };

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

          {/* Vista de lista: solo la jornada actual */}
          <TabsContent value="list" className="mt-0">
            <Card>
              <CardContent className="p-4 md:p-6 bg-white">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold">Jornada {currentRound}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex justify-center items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {rounds[currentRound - 1]?.matches.length || 0} partidos
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {rounds[currentRound - 1]?.matches.length > 0 ? (
                    rounds[currentRound - 1].matches.map((match, index) => (
                      <div key={match.id || index} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-center">
                          <div className="flex-1 text-right font-medium">{getTeamName(match.home_team_id)}</div>
                          <div className="mx-4 flex items-center">
                            {match.playedAt ? (
                              <div className="flex items-center justify-center">
                                <span className="font-bold text-lg mx-1">{match.score_home}</span>
                                <span className="text-gray-400 mx-1">-</span>
                                <span className="font-bold text-lg mx-1">{match.score_away}</span>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1 rounded">vs</div>
                            )}
                          </div>
                          <div className="flex-1 text-left font-medium">{getTeamName(match.away_team_id)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center text-gray-400 py-8">
                      No hay partidos para esta jornada.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vista de calendario: todas las jornadas */}
          <TabsContent value="calendar" className="mt-0">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-8">
                  {rounds.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      No hay partidos programados.
                    </div>
                  ) : (
                    rounds.map((round, roundIndex) => (
                      <div key={round.round} className="border-b pb-6 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold">Jornada {round.round}</h3>
                        </div>
                        <div className="grid gap-2">
                          {round.matches.map((match, matchIndex) => (
                            <div
                              key={match.id || matchIndex}
                              className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100"
                            >
                              <div className="flex-1 text-right">{getTeamName(match.home_team_id)}</div>
                              <div className="mx-4 flex items-center">
                                {match.playedAt ? (
                                  <div className="flex items-center justify-center">
                                    <span className="font-bold mx-1">{match.score_home}</span>
                                    <span className="text-gray-400 mx-1">-</span>
                                    <span className="font-bold mx-1">{match.score_away}</span>
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded">vs</div>
                                )}
                              </div>
                              <div className="flex-1 text-left">{getTeamName(match.away_team_id)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
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
              <span>La temporada consta de {rounds.length} jornadas</span>
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

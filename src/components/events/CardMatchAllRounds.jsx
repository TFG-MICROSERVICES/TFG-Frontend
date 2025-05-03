

export const CardMatchAllRound = ({match, teams}) => {

    // Helper para mostrar nombre de equipo por id (si tienes teams)
    const getTeamName = (id) => {
        if (!teams) return id;
        const team = teams.find(t => t.id === id);
        return team ? team.name : id;
    };

    return (
        <div
        className="flex justify-between bg-white items-center p-2 rounded-lg hover:bg-gray-100"
      >
        <div className="flex-1 text-right">{getTeamName(match?.home_team_id)}</div>
            <div className="mx-4 flex items-center">
            {match?.playedAt ? (
                <div className="flex items-center justify-center">
                <span className="font-bold mx-1">{match?.score_home}</span>
                <span className="text-gray-400 mx-1">-</span>
                <span className="font-bold mx-1">{match?.score_away}</span>
                </div>
            ) : (
                <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded">vs</div>
            )}
            </div>
            <div className="flex-1 text-left">{getTeamName(match?.away_team_id)}</div>
        </div>
    )
}
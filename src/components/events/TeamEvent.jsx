export const TeamEvent = ({ team }) => {
    return (
        <div className="flex items-center bg-blue-100 rounded-lg justify-between p-3 border-b last:border-b-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">{team.name.charAt(0).toUpperCase()}</div>
                <div>
                    <p className="text-sm font-medium">{team.name}</p>
                    <p className="text-xs text-gray-500">{team.name}</p>
                </div>
            </div>
        </div>
    );
};

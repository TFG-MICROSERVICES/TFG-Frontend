export const UserTeam = ({ userTeam }) => {
    return (
        <div className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                    {userTeam.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="text-sm font-medium">{userTeam.user.name}</p>
                    <p className="text-xs text-gray-500">{userTeam.user.email}</p>
                </div>
            </div>
        </div>
    );
};

import { Loader2 } from 'lucide-react';

export function BlueLoader({ size = 'md', showText = true }) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-20 h-20',
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
            <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
                {showText && <p className="text-blue-600 font-medium">Cargando</p>}
            </div>
        </div>
    );
}

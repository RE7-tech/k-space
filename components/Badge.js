export default function Badge({ variant, children }) {
    const colors = {
        red: 'bg-rose-500',
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        yellow: 'bg-yellow-500',
        indigo: 'bg-indigo-500',
        purple: 'bg-purple-500',
        pink: 'bg-pink-500',
        success: 'bg-success-dark',
        warning: 'bg-yellow-400',
        danger: 'bg-rose-500',
    };

    return <span className={`px-2 py-1 w-fit-content rounded-full text-xs font-bold text-white ${colors[variant] ?? colors['blue']}`}>
        {children}
    </span>
}
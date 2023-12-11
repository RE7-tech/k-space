export default function ColoredCard ({ children, color, className }) {


    const colors = {
        red: 'bg-red-100 border-red-500 text-red-500',
        green: 'bg-green-100 border-green-500 text-green-500',
        blue: 'bg-blue-100 border-blue-500 text-blue-500',
        yellow: 'bg-yellow-100 border-yellow-500 text-yellow-500',
        indigo: 'bg-indigo-100 border-indigo-500 text-indigo-500',
        purple: 'bg-purple-100 border-purple-500 text-purple-500',
    };

    const classNames = `p-4 rounded-xl border-2 ${className ?? ''} ${colors[color] ?? colors['blue']}`;

    return <div className={`${classNames}`}>
        {children}
    </div>
}
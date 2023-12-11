import { faCheck, faClock, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PolicyBadge ({ policy }) {
    const policyStatus = policy?.status ?? 'pending';

    const statusClasses = {
        pending: 'bg-blue-200',
        active: 'bg-success-dark',
        inactive: 'bg-red-200'
    };

    const statusTranslation = {
        pending: 'En attente',
        active: 'Activée',
        inactive: 'Inactivée'
    };

    const statusIcons = {
        pending: faClock,
        active: faCheck,
        inactive: faTimes
    };
    
    const badgeClasses = `flex flex-row items-center text-xs text-white font-bold rounded-full px-3 py-1 rounded-xl ${statusClasses[policyStatus] ?? statusClasses['pending']}`;

    return <div className={badgeClasses}>
        {(statusTranslation[policyStatus] ?? statusTranslation['pending']).toUpperCase()}
    </div>;
}
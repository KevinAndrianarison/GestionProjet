const StatusBadge = ({ etat }) => (
    <div className="flex w-full justify-end items-center mt-2 text-gray-600 dark:text-gray-400">
        <div
            className={`relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none py-1 px-2 text-xs rounded-md ${etat === 'Confirmer'
                ? 'bg-green-500/20 text-green-600'
                : etat === 'Brouillon'
                    ? 'bg-yellow-500/20 text-yellow-600'
                    : 'bg-red-500/20 text-red-700'
                }`}
        >
            <span>{etat}</span>
        </div>
    </div>
);

export default StatusBadge;
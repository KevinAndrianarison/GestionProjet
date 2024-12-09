const SelectState = ({ etat, setEtat }) => (
    <div className="flex items-end flex-col mb-2">
        <select
            className="w-fit mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
            value={etat}
            onChange={e => setEtat(e.target.value)}
        >
            <option value="Brouillon">Brouillon</option>
            <option value="Confirmer">Confirmer</option>
            <option value="Annuler">Annuler</option>
        </select>
    </div>
);

export default SelectState;
import { deviseData } from "../../../utils/deviseTest";

const SelectDevise = ({ devise, setDevise }) => (
    <div className="flex items-end flex-col mb-2">
        <select
            className="w-fit mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
            value={devise}
            onChange={e => setDevise(e.target.value)}
        >
            {deviseData.map( item =>(
                <option key={item.abreveation} value={item.abreveation}>{item.nom} ({item.symbole})</option>
            ))}
        </select>
    </div>
);

export default SelectDevise;
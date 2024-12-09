import { useEffect, useRef, useState } from "react";
import InputField from "./InputField";

function AddServiceForm({ service, setService, onAddService, serviceEmpty, servicesData }) {

    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    const filteredService = servicesData.filter(
        service =>
            service.designation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='w-full mt-8'>
            <h1 className="text-normal text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">
                Ajouter un nouveau service
            </h1>
            <div className="flex flex-col mt-2 relative">
                <InputField
                    placeholder="Désignation du service"
                    value={searchQuery}
                    onChange={e => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    style={serviceEmpty ? 'border-red-500' : ''}
                />
                {showSuggestions && searchQuery && (
                    <ul className="absolute top-[50%] left-0 w-full bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 z-10 rounded-lg overflow-hidden">
                        <div className='w-full overflow-y-auto max-h-[98px]'>
                            {filteredService.length > 0 && filteredService.map(item => (
                                <li
                                    key={item.id}
                                    onClick={() => {
                                        setSearchQuery(item.designation);
                                        setShowSuggestions(false);
                                        setService({ ...service, item });
                                    }}
                                    className="w-full px-3 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 whitespace-nowrap overflow-hidden text-ellipsis"
                                >
                                    {item.designation}
                                </li>
                            ))}
                            {!filteredService.length && (
                                <li className="w-full px-3 py-2 text-gray-400">
                                    Aucun service ne correspond à {searchQuery}
                                </li>
                            )}
                        </div>
                    </ul>
                )}
                <div className="flex gap-5 mt-2">
                    <div className='w-full min-w-[100px] relative flex items-center'>
                        <input
                            type="number"
                            placeholder="Durée en jours"
                            value={service.duree}
                            onChange={e => setService({ ...service, duree: e.target.value })}
                            className={`w-full min-w-[100px] mt-2 py-3 px-3 pr-10 rounded-lg dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none ${serviceEmpty ? 'border-red-500' : ''}`}
                        />
                        <p className='absolute right-2 top-5 text-normal'>/ jours</p>
                    </div>
                    <div className='min-w-[100px] relative flex items-center justify-end'>
                        <button
                            type="button"
                            onClick={() => { onAddService(); setSearchQuery(''); }}                            className="md:w-32 bg-indigo-600 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-3 hover:bg-indigo-500 transition ease-in-out duration-300">
                            Ajouter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default AddServiceForm;

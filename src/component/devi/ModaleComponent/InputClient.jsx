import React, { useEffect, useRef, useState } from 'react'

function InputClient({clients, onUpdateCommande, inputError, setInputError, setSelectedClient, selectedClient}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    const filteredClients = clients.filter(
        client =>
            client.email_societe?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.nom_societe?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchQuery.toLowerCase())
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

    useEffect(() => {
        if(!selectedClient){
            setSearchQuery('')
        }
    }, [selectedClient]);

    return (
        <div ref={wrapperRef} className="flex flex-col mt-2 relative">
            <input
                type="text"
                placeholder="Nom ou email client"
                value={searchQuery}
                onChange={e => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                }}
                className={`w-full mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none ${inputError ? 'border-red-500' : ''}`}
            />
            {showSuggestions && searchQuery && (
                <ul className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 z-10 rounded-lg overflow-hidden">
                    <div className='w-full overflow-y-auto max-h-[98px]'>
                        {filteredClients.length > 0 && filteredClients.map(client => (
                            <li
                                key={client.id}
                                onClick={() => {
                                    setSelectedClient(client);
                                    setSearchQuery(`${client.nom} - ${client.email}`);
                                    setShowSuggestions(false);
                                    setInputError(''); // Clear error message when a valid client is selected
                                    onUpdateCommande(prev => ({
                                        ...prev,
                                        client: client,
                                    }));
                                }}
                                className="w-full px-3 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 whitespace-nowrap overflow-hidden text-ellipsis"
                            >
                                {client.type == "societe" ? (`${client.nom_societe} - ${client.email_societe} (${client.type})`) : (`${client.nom} - ${client.email} (${client.type})`)}
                            </li>
                        ))}
                        {!filteredClients.length && (
                            <li className="w-full px-3 py-2 text-gray-400">
                                Aucun client ne correspond à {searchQuery}
                            </li>
                        )}
                    </div>
                </ul>
            )}
            {inputError && <p className="text-red-500 mt-2">{inputError}</p>}
        </div>
    )
}

export default InputClient
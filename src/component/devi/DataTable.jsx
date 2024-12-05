import { useState } from "react";
import NotResultat from "./NotResultat";
import TableRow from "./Table";

const DataTable = ({ data, searchQuery, name }) => {
    const [sortedData, setSortedData] = useState(data);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const sortData = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        const sortedArray = [...sortedData].sort((a, b) => {
            const aValue = key.split('.').reduce((o, i) => o[i], a);
            const bValue = key.split('.').reduce((o, i) => o[i], b);

            if (aValue < bValue) {
                return direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setSortedData(sortedArray);
        setSortConfig({ key, direction });
    };

    const headers = [
        { label: 'Clients', key: 'client.name' },
        { label: 'Date', key: 'date' },
        { label: 'Budget', key: 'budget' },
        { label: 'Statut', key: 'status' },
    ];

    const filteredData = sortedData.filter((item) =>
        item.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.includes(searchQuery) ||
        item.budget.includes(searchQuery) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!data.length) {
        return <NotResultat text={`Il y a aucune ${name}`}/>;
    }

    if (!filteredData.length) {
        return <NotResultat text={`Aucun résultat pour : ${searchQuery}`}/>;
    }

    return (
        <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th
                            key={header.key}
                            className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                            onClick={() => sortData(header.key)}
                        >
                            <p className="antialiased font-sans text-sm text-blue-gray-900 flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                {header.label}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                    ></path>
                                </svg>
                            </p>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {filteredData.map((item) => (
                    <TableRow key={item.id} {...item} />
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;
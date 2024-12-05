import React from 'react';

const TableCell = ({ children }) => (
    <td className="p-4 border-b border-blue-gray-50">{children}</td>
);

const TableRow = ({ client, date, budget, status }) => (
    <tr>
        <TableCell>
            <div className="flex items-center gap-3">
                <img
                    src={client.image}
                    alt={client.name}
                    className="inline-block relative object-cover object-center !rounded-full w-9 h-9 rounded-md"
                />
                <div className="flex flex-col">
                    <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                        {client.name}
                    </p>
                    <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal opacity-70">
                        {client.email}
                    </p>
                </div>
            </div>
        </TableCell>
        <TableCell>
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                {date}
            </p>
        </TableCell>
        <TableCell>
            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                {budget}
            </p>
        </TableCell>
        <TableCell>
            <div className="w-max">
                <div
                    className={`relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none py-1 px-2 text-xs rounded-md ${status === 'Signé'
                        ? 'bg-green-500/20 text-green-600'
                        : status === 'En Attente'
                            ? 'bg-yellow-500/20 text-yellow-600'
                            : 'bg-red-500/20 text-red-700'
                        }`}
                >
                    <span>{status}</span>
                </div>
            </div>
        </TableCell>
    </tr>
);

export default TableRow;
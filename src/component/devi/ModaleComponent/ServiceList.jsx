import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotResultat from "../NotResultat"
import { faSquareMinus } from "@fortawesome/free-regular-svg-icons";


const ServiceList = ({ services, onRemoveService }) => (
    <div className="flex flex-col items-center mt-4 text-gray-600 dark:text-gray-400">
        <h1 className="text-normal text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">
            Les Services
        </h1>
        {services.length ? <div className="w-full min-w-[300px] max-h-[246px] overflow-y-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                        <th className="px-2 py-3 w-full">Service</th>
                        <th className="px-2 py-3 whitespace-nowrap">Jours</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {services.map((service, index) => (
                        <tr className="text-gray-600" key={service.id || index}>
                            <td className="px-2 py-3 border w-full">
                                <p className="font-semibold">{service.item.designation}</p>
                            </td>
                            <td className="px-2 py-3 text-ms font-semibold border text-center">{service.duree}</td>
                            <td
                                onClick={() => onRemoveService(index)}
                                className="px-2 py-3 text-lg text-red-500 font-semibold border text-center cursor-pointer"><FontAwesomeIcon icon={faSquareMinus} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div> : <NotResultat text={"veillez ajouter un service"} />}
    </div>
);

export default ServiceList;
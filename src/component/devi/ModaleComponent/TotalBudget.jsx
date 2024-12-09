import { getSymbolFromAbbreviation } from "../../../utils/deviseTest";
import { formatNumber } from "../../../utils/formatNumber";

const TotalBudget = ({ taux, services, tva, remise, devise }) => {
    const totalDuration = services.reduce((sum, service) => sum + (parseFloat(service.duree) || 0), 0);
    const budgetTotal = (totalDuration * taux)
    const budgetTotalTva = budgetTotal + (budgetTotal * tva / 100);
    const budgetTotalRemise = budgetTotalTva + (budgetTotalTva * tva / 100)

    return (
        <>
            <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
                <div className="text-md tracking-wide font-semibold w-full whitespace-nowrap">
                    Budget total : {formatNumber(budgetTotalRemise.toFixed(2))} {getSymbolFromAbbreviation(devise)}
                </div>
            </div>
            <div className="flex justify-between items-center w-full mt-2 text-gray-600 dark:text-gray-400">

                <div className="text-md tracking-wide font-semibold whitespace-nowrap">
                    {tva ? (`TVA : ${tva} %`) : ""}
                </div>
                <div className="text-md text-red-400 tracking-wide font-semibold whitespace-nowrap">
                    {remise ? (`Remise : ${remise} %`) : ""}
                </div>
            </div>

        </>
    );
};

export default TotalBudget;
import { getSymbolFromAbbreviation } from "../../../utils/deviseTest";
import { formatNumber } from "../../../utils/formatNumber";

const DailyRate = ({ taux, devise }) => (
    <div className="flex items-center mt-4 text-gray-600 dark:text-gray-400">
        <div className="text-md tracking-wide font-semibold w-full whitespace-nowrap">
            Taux journalier moyen : {formatNumber(taux)} {getSymbolFromAbbreviation(devise)}
        </div>
    </div>
);

export default DailyRate;
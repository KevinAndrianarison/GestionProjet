
const DualInputField = ({ label1, value1, onChange1, label2, value2, onChange2 }) => (
    <div className="flex gap-5 mt-2">
        <InputWithLabel label={label1} value={value1} onChange={onChange1} />
        <InputWithLabel label={label2} value={value2} onChange={onChange2} />
    </div>
);


const InputWithLabel = ({ label, value, onChange }) => (
    <div className='w-full min-w-[100px] relative flex items-center'>
        <input
            type="number"
            placeholder={label}
            value={value}
            onChange={onChange}
            className="w-full min-w-[100px] mt-2 py-3 px-3 pr-7 rounded-lg dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
        />
        <p className='absolute right-2 top-4 text-base'>%</p>
    </div>
);

export default DualInputField;
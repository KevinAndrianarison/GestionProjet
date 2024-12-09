const InputField = ({ placeholder, value, onChange, style, type }) => (
    <div className="flex flex-col mt-2">
        <input
            type={type? type :"text"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none ${style}`}
        />
    </div>
);

export default InputField;
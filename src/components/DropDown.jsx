import { HiChevronDown } from 'react-icons/hi';

function DropDown({
    value,
    onChange,
    options,
    defaultOption = "all",
    defaultLabel = "Tất cả",
    selectClassName = ""
}) {
    return (
        <div className="relative w-full">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full outline-none appearance-none px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 font-medium ${selectClassName}`}>
                <option value={defaultOption}>{defaultLabel}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.icon && option.icon} {option.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <HiChevronDown className="h-5 w-5 text-gray-400" />
            </div>
        </div>
    );
}

export default DropDown;
import { format } from 'date-fns';

function InputField({
    label,
    type = "text",
    name,
    value,
    onChange,
    isEditing = true,
    placeholder = "Chưa cập nhật",
    required = false,
    rows = 3,
}) {
    const baseClassName = `mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10`;

    const renderInput = () => {
        if (!isEditing) {
            if (type === 'date' && value) {
                return (
                    <div className="mt-1 text-gray-900 dark:text-white">
                        {format(new Date(value), 'dd/MM/yyyy')}
                    </div>
                );
            }
            return (
                <div className="mt-1 text-gray-900 dark:text-white">
                    {value || placeholder}
                </div>
            );
        }

        if (type === 'textarea') {
            return (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    placeholder={placeholder}
                    required={required}
                    className={baseClassName}
                />
            );
        }

        return (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={baseClassName}
            />
        );
    };

    return (
        <div className={`${type === 'textarea' ? 'md:col-span-2' : ''}`}>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                {label}
            </label>
            {renderInput()}
        </div>
    );
};

export default InputField;
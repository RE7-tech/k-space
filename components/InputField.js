'use client';
import Select from 'react-select';

export default function InputField({ label, id, name, type, placeholder, value, isChecked = false, onChange, error, floatingLabel = true, defaultValue = null, choices = false, isFullWidth = false, inputClassName = '', containerClassName = '' }) {

    if (!id) {
        id = `input-${name ?? (label ?? placeholder ?? '').toLowerCase().replace(' ', '-')}`;
    }

    const handleSelectChange = (selectedOption) => {
        onChange({
            target: {
                name,
                value: selectedOption
            }
        })
    }

    const customStyles = {
        control: (provided) => ({
            ...provided,
            padding: '8px' // Augmente le padding. Ajustez cette valeur selon vos besoins.
        }),
        // Vous pouvez également personnaliser d'autres éléments ici si nécessaire
    };

    return <>
        <div className={`flex flex-col ${floatingLabel ? 'relative' : ''} ${isFullWidth ? 'w-full' : ''} ${containerClassName}`}>
            {type !== "checkbox" ? <label htmlFor={label} className={`text-sm ${floatingLabel ? 'mb-2' : ''}`}>
                {label}
            </label> : null}

            {type == "textarea" ? <textarea
                id={id ?? ''}
                name={name}
                className={`border border-gray-300 rounded-md p-4 ${error ? 'border-red-500' : ''} ${isFullWidth ? 'w-full' : ''} ${inputClassName}`}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                rows={1}
            /> : <>

                {!choices && type != "textarea" ?
                    <>
                        <div className={`flex w-full flex-1 justify-start gap-4 ${type === "checkbox" ? 'items-center' : ''}`}>
                            <input
                                id={id ?? ''}
                                name={name}
                                className={`border border-gray-300 rounded-md p-4 ${type !== "checkbox" ? "flex-1": ""} ${error ? 'border-red-500' : ''} ${isFullWidth ? 'w-full ' : ''} ${inputClassName}`}
                                type={type}
                                placeholder={placeholder}
                                value={value}
                                onChange={onChange}
                                checked={isChecked}
                            />

                            {type === "checkbox" ? <label htmlFor={id}>{label}</label> : null}
                        </div>
                    </> : <>
                        <Select
                            id={id ?? ''}
                            name={name}
                            defaultValue={value ?? defaultValue}
                            onChange={handleSelectChange}
                            options={choices}
                            noOptionsMessage={() => 'Aucun résultat'}
                            placeholder={placeholder}
                            styles={customStyles}
                        />
                    </>}

            </>}



            {error && <span className="text-red-500 text-sm mt-2">{error}</span>}
        </div>
    </>

}
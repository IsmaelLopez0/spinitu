import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export default function Autocomplete({
  list = [],
  selected,
  setSelected,
  label,
  ...props
}) {
  const [query, setQuery] = useState('');

  const filteredList =
    query === ''
      ? list
      : list.filter((person) =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, '')),
        );

  return (
    <Combobox value={selected} onChange={setSelected}>
      <Combobox.Label
        aria-labelledby={props.id ?? 'autocomplete'}
        className="block mb-2 text-sm text-slate-500"
      >
        {label}
      </Combobox.Label>
      <div className="relative mt-1">
        <div className="relative w-full overflow-hidden text-left bg-white border-t-2 border-gray-100 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none focus:ring-0 focus:outline-0"
            displayValue={(person) => person.name}
            onChange={(event) => setQuery(event.target.value)}
            id={props.id ?? 'autocomplete'}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
              aria-labelledby={props.id ?? 'autocomplete'}
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-24 ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredList.length === 0 ? (
              <div className="px-4 py-2 text-gray-700 cursor-default select-none">
                Nothing found.
              </div>
            ) : (
              filteredList.map((person) => (
                <Combobox.Option
                  key={person.id}
                  className={({ active }) =>
                    `flex cursor-default select-none py-2 pl-5 pr-4 ${
                      active ? 'bg-teal-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={person}
                >
                  {({ selected, active }) => (
                    <>
                      {selected ? (
                        <span
                          className={`flex items-center mr-2 ${
                            active ? 'text-white' : 'text-teal-600'
                          }`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : (
                        <div className="w-5 mr-2" />
                      )}
                      <span
                        className={`block ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {person.name}
                        {person.description ? (
                          <p className="text-xs">{person.description}</p>
                        ) : null}
                      </span>
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}

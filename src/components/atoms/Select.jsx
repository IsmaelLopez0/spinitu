'use client';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { CheckIcon } from '@heroicons/react/16/solid';

export default function Select({ options, defaultValue, onChange }) {
  const [selected, setSelected] = useState(defaultValue ?? 0);

  function handleChange(index, v) {
    setSelected(index);
    if (onChange) onChange(v ?? index);
  }

  return (
    <div className="w-fit">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium border rounded-md text-swirl-900 border-swirl-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            {options[selected]?.name}
            <ChevronDownIcon
              className="w-5 h-5 ml-2 -mr-1 text-swirl-900"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-10 w-56 mt-2 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
            {options.map((option, index) => (
              <div className="px-1 py-1 " key={index}>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 ${selected !== index ? 'pl-7' : ''}`}
                      onClick={() => handleChange(index, option.value)}
                    >
                      {selected === index ? (
                        <CheckIcon
                          className="w-5 h-5 mr-2"
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className="text-xs">{option.name}</span>
                    </button>
                  )}
                </Menu.Item>
              </div>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

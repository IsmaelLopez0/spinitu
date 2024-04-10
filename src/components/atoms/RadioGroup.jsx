'use client';
import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';

export default function RadioGrop({
  options,
  groupName,
  setValue,
  defaultValue = null,
  type = 'list',
  className,
}) {
  let [option, setOption] = useState(defaultValue);

  function changeValue(v) {
    if (setValue) setValue(v);
    setOption(v);
  }

  return (
    <RadioGroup value={option} onChange={changeValue} className={className}>
      <RadioGroup.Label className="block mb-2 text-sm text-slate-500">
        {groupName}
      </RadioGroup.Label>
      <div
        className={`flex ${type === 'list' ? 'flex-col' : 'flex-row'} gap-3`}
      >
        {options.map(({ value, name }) => (
          <RadioGroup.Option key={value} value={value}>
            {({ checked }) => (
              <div
                className={`flex px-2 border border-black rounded-full w-fit cursor-pointer ${checked ? 'bg-mindaro-100' : ''}`}
              >
                {checked && <CheckIcon className="w-6 h-6" />}
                <span>{name}</span>
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#000"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

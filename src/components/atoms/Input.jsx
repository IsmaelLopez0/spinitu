'use client';
import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';

const forcePassword = (type, eyeOpen) => {
  if (type !== 'password') return type;
  if (eyeOpen) return 'text';
  return type;
};

export default function Input({
  label,
  name,
  errors,
  className,
  type = 'text',
  ...props
}) {
  const [eyeOpen, setEyeOpen] = useState(false);

  return (
    <div className="w-full">
      <label htmlFor={name} className="block mb-2 text-sm text-slate-500">
        {label}
      </label>
      <div className="flex items-center">
        <input
          name={name}
          className={`p-3 rounded block mb-2 w-full border border-swirl-100 ${className}`}
          type={forcePassword(type, eyeOpen)}
          {...props}
        />
        {type === 'password' ? (
          <div onClick={() => setEyeOpen((prev) => !prev)}>
            {eyeOpen ? (
              <EyeSlashIcon
                className="w-5 h-5 ml-2 -mr-1 cursor-pointer text-swirl-700"
                aria-hidden="true"
              />
            ) : (
              <EyeIcon
                className="w-5 h-5 ml-2 -mr-1 cursor-pointer text-swirl-700"
                aria-hidden="true"
              />
            )}
          </div>
        ) : null}
      </div>
      {errors && errors[name] ? (
        <span className="text-xs text-red-500">{errors[name].message}</span>
      ) : null}
    </div>
  );
}

"use client";

import { useId, useState } from 'react';
import { IPayload } from './OneSample';

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
export default function InputBar({ onPayload, payload
}: {payload: IPayload, onPayload: (e: IPayload) => void }) {

  const id = useId();
  //const [input, setInput] = useState<string>(props?.value ?? '');
 // console.log(input)
  return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
          Price
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="text"
            name="price"
            id={id}
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="0.00"
            value = {payload.v1
            }
            onChange={e => onPayload({ ...payload, v1: e.target.value })}
          />
        </div>
      </div>
    )
  }
  
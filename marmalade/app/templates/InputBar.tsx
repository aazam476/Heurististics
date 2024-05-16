"use client";

import { ChangeEvent, useId, useState } from 'react';
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
export default function InputBar({ modifyPayload, payload
}: {payload: IPayload, modifyPayload: (event: ChangeEvent<HTMLInputElement>, payload: IPayload) => void }) {

  const id = useId();
  const [input, onChange] = useState<string>("");
  return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
          Price
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="price"
            id={id}
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder=""
            value = {input}
            onChange={e => {
              onChange(e.target.value);
              modifyPayload(e, payload);
            }}
          />
        </div>
      </div>
    )
  }
  
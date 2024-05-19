"use client";

import { ChangeEvent, useId, useState } from 'react';
import { IOneSampPayload } from './OneSample';


export function NumberInputBar({ modifyPayload, payload, label, placeholder}
  : {payload: IOneSampPayload, modifyPayload: (event: ChangeEvent<HTMLInputElement>, payload: IOneSampPayload) => void, label:string, placeholder:number }) {

  const id = useId();
  const [input, onChange] = useState<string>("");
  
  return (
      <div className="object-fill p-4 w-1/5">
        <label htmlFor={id} className="bl6ck text-xl leading-6 text-white">
          {label}
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="number"
            name="price"
            id={id}
            className="block w-full rounded-md border-0 md:text-wrap py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={placeholder.toString()}
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

export function TextInputArea({ modifyPayload, payload, label, placeholder}
  : {payload: IOneSampPayload, modifyPayload: (event: ChangeEvent<HTMLTextAreaElement>, payload: IOneSampPayload) => void, label:string, placeholder:string }) {

  const id = useId();
  const [input, onChange] = useState<string>("");
  
  return (
      <div className="object-fill p-4 w-4/12">
        <label htmlFor={id} className="block text-xl leading-6 text-white">
          {label}
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <textarea
            name="price"
            id={id}
            className="block w-full rounded-md border-0 md:text-wrap py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={placeholder.toString()}
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
  
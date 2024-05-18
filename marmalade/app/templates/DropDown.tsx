import { ChangeEvent, useId, useState } from "react";
import { IPayload } from "./OneSample";

export default function DropDown({ modifyPayload, payload, label, options}
    : {payload: IPayload, modifyPayload: (event: ChangeEvent<HTMLSelectElement>, payload: IPayload) => void, label:string, options:string[] })
    {

        const id = useId();
        const [input, onChange] = useState<string>("");

        return (
            <div className="object-fill">
                <label className="block text-xl leading-6 text-white" htmlFor={id}>
                    {label}
                </label>
                <div className="relative">
                    <select className="block appearance-none my-1.5 w-full bg-gray-200 border border-gray-200
                        text-gray-700 p-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id={id}
                        onChange={e =>{
                            onChange(e.target.value)
                            modifyPayload(e, payload)
                        }}>
                    {options.map((option) => (
                        <option>{option}</option>
                    ))}
                    </select>
                </div>
            </div>
        )
}
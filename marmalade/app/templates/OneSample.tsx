import { useState } from "react";
import InputBar from "./InputBar";

export interface IPayload {
    v1: string,
    v2: string
}

export default function OneSample()
{
    const [ payload, setPayload ] = useState<IPayload>({
        v1: "",
        v2: ""
    });

    return (

        <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32 sm:p-100">
            <div
            className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
            aria-hidden="true"
            >
            <div
                className="aspect-[1920/1080] w-[100rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            />
            </div>
            <div
            className="absolute -top-100 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
            aria-hidden="true"
            >
            <div
                className="aspect-[1920/1080] w-[100rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            />
            </div>
            <InputBar onPayload={setPayload} value=""></InputBar>
        </div>
    )
}
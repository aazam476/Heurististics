"use client";

import { ChangeEvent, useState } from "react";
import InputBar from "./InputBar";

export interface IPayload {
    testType: string,
    hypothesisMean: number,
    sampleStdDev: number,
    sampleMean: number,
    sampleSize: number,
    alternativeHypothesis: string,
    alternativeHypothesisType: string
}

export default function OneSample({testType}:{testType:string})
{
    const [ payload, modfiyPayload ] = useState<IPayload>({
        testType: testType,
        hypothesisMean: 0,
        sampleStdDev: 0,
        sampleMean: 0,
        sampleSize: 0,
        alternativeHypothesis: "N/A",
        alternativeHypothesisType: "N/A"
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
            <InputBar payload = {payload} modifyPayload={
                (event: ChangeEvent<HTMLInputElement>, payload: IPayload) => {
                    console.log(event.target.value)
                    payload.sampleMean = event.target.valueAsNumber;
                }
            }></InputBar>
        </div>
    )
}
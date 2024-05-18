"use client";

import { ChangeEvent, useState } from "react";
import {NumberInputBar, TextInputArea } from "./InputAreas";
import DropDown from "./DropDown";

export interface IPayload {
    testType: string,
    hypothesisMean: number,
    stdDev: number,
    sampleMean: number,
    sampleSize: number,
    nullHypothesis: string,
    alternativeHypothesis: string,
    alternativeHypothesisType: string
}

export default function OneSample({testType}:{testType:string})
{
    const [ payload, modfiyPayload ] = useState<IPayload>({
        testType: testType,
        hypothesisMean: 0,
        stdDev: 0,
        sampleMean: 0,
        sampleSize: 0,
        nullHypothesis: "Ho",
        alternativeHypothesis: "Ha",
        alternativeHypothesisType: "≠"
    });

    const modSampleMean = 
        (event: ChangeEvent<HTMLInputElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.sampleMean = parseFloat(event.target.value);
        }

    const modHypothesisMean = 
        (event: ChangeEvent<HTMLInputElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.hypothesisMean = parseFloat(event.target.value);
        }

    const modStdDev = 
        (event: ChangeEvent<HTMLInputElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.stdDev = parseFloat(event.target.value)
        }

    const modSampleSize = 
        (event: ChangeEvent<HTMLInputElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.sampleSize = parseInt(event.target.value);
        }

    const modNullHypothesis = 
        (event: ChangeEvent<HTMLInputElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.nullHypothesis = event.target.value;
        }

    const modAlternativeHypothesis = 
        (event: ChangeEvent<HTMLInputElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.alternativeHypothesis = event.target.value;
            console.log(payload);
        }

    const alternativeHypothesisOptions = [
        "<",
        ">",
        "≠"
    ]

    const modAlternativeHypothesisType = 
        (event: ChangeEvent<HTMLSelectElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.alternativeHypothesisType = event.target.value;
        }

    return (

        <div className="relative isolate overflow-hidden bg-gray-900 py-12 scroll-smooth snap-normal">
            <header className="px-24 font-bold tracking-tight text-white text-6xl text-pretty decoration-zinc-900">Welcome to the One Sample {testType}-Test!</header>
            <div
            className="hidden absolute w-screen h-screen mr-10 sm:flex transform-gpu sm:blur-3xl"
            aria-hidden="true"
            >
                <div
                    className="aspect-[1920/1080] w-screen bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-40"
                />
            </div>
            <div className="flex flex-wrap px-20 pt-20 size-screen w-screen">
                <NumberInputBar payload = {payload} modifyPayload={modHypothesisMean} label="Hypothesis Mean" placeholder={payload.hypothesisMean}></NumberInputBar>
                <NumberInputBar payload = {payload} modifyPayload={modSampleMean} label="Sample Mean" placeholder={payload.sampleMean}></NumberInputBar>
                <NumberInputBar payload = {payload} modifyPayload={modStdDev} label="Standard Deviation" placeholder={payload.stdDev}></NumberInputBar>
                <NumberInputBar payload = {payload} modifyPayload={modSampleSize} label="Sample Size" placeholder={payload.sampleSize}></NumberInputBar>
            </div>
            <div className="flex px-20 pt-14 size-screen w-screen">
                <TextInputArea payload = {payload} modifyPayload={modNullHypothesis} label="Null Hypothesis" placeholder={payload.nullHypothesis}></TextInputArea>
                <TextInputArea payload = {payload} modifyPayload={modAlternativeHypothesis} label="Alternative Hypothesis" placeholder={payload.alternativeHypothesis}></TextInputArea>
            </div>
            <div className="flex px-20 mx-4 pt-14 size-3/12">
                <DropDown payload={payload} modifyPayload={modAlternativeHypothesisType} label="Alternative Hypothesis Type" options={alternativeHypothesisOptions}></DropDown>
            </div>
            <div className="px-24 pt-14 h-max">
                <button className="bg-gradient-to-tr from-[#ff4694] to-[#776fff] text-white font-bold py-2 px-4 rounded-full text-md">
                    Run Test
                </button>
            </div>
        </div>
    )
}
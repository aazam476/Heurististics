"use client";

import {ChangeEvent, useState } from "react";
import {NumberInputBar, TextInputArea } from "./InputAreas";

import DropDown from "./DropDown";
import PdfViewer from "./PdfViewer";
import Link from "next/link";

export interface IPayload {
    testType: string,
    hypothesisMean: number,
    stdDev: number,
    sampleMean: number,
    sampleSize: number,
    nullHypothesis: string,
    alternativeHypothesis: string,
    alternativeHypothesisType: string,
    valid: boolean
}

export default function OneSample({testType}:{testType:string}) {
    
    const [ payload, modfiyPayload ] = useState<IPayload>({
        testType: testType,
        hypothesisMean: 0,
        stdDev: 0,
        sampleMean: 0,
        sampleSize: 0,
        nullHypothesis: "",
        alternativeHypothesis: "",
        alternativeHypothesisType: "<",
        valid: false
    })

    const modSampleMean = (
        event: ChangeEvent<HTMLInputElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.sampleMean = parseFloat(event.target.value);
        }

    const modHypothesisMean = (
        event: ChangeEvent<HTMLInputElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.hypothesisMean = parseFloat(event.target.value);
        }

    const modStdDev = (
        event: ChangeEvent<HTMLInputElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.stdDev = parseFloat(event.target.value)
        }

    const modSampleSize = (
        event: ChangeEvent<HTMLInputElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.sampleSize = parseInt(event.target.value);
        }

    const modNullHypothesis = (
        event: ChangeEvent<HTMLTextAreaElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.nullHypothesis = event.target.value;
        }

    const modAlternativeHypothesis = (
        event: ChangeEvent<HTMLTextAreaElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.alternativeHypothesis = event.target.value;
            console.log(payload);
        }

    const alternativeHypothesisOptions = [
        "<",
        ">",
        "≠"
    ]

    const modAlternativeHypothesisType = (
        event: ChangeEvent<HTMLSelectElement>, payload: IPayload) => {
            console.log(event.target.value)
            payload.alternativeHypothesisType = event.target.value;
        }

    const areNumbers = (...numbers:number[]) => {
        let result:boolean = true
        numbers.forEach((value: number) => result && isNaN(value))
        return result
    }
    

    const handleOutput = (
        event: any) => {
            let isValid: boolean = 
                areNumbers(payload.hypothesisMean, payload.sampleMean, payload.sampleSize, payload.stdDev) 
                && !!payload.alternativeHypothesis 
                && !!payload.nullHypothesis
            modfiyPayload({...payload, valid:isValid})
            console.log(payload)
        }

    return (

        <div className="relative isolate overflow-hidden bg-gray-900 py-12 scroll-smooth snap-normal">
            <header className="px-24 font-bold tracking-tight text-white text-6xl text-pretty decoration-zinc-900">Welcome to the One Sample {testType}-Test!</header>
            <div
            className="-hidden absolute w-screen h-screen mr-10 sm:flex transform-gpu sm:blur-3xl z-0"
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
            <button type="button" className="relative z-20 opacity-90 mx-24 mt-14 bg-gradient-to-tr from-[#ff4694] to-[#776fff] text-white font-bold py-2 px-4 rounded-full text-md" onClick={handleOutput}>
                Run Test    
            </button>
            <div className="relative z-10 p-24 size-full">
                <PdfViewer payload={payload}></PdfViewer>
            </div>
            <Link key="Go Back" href="/" className="relative px-24 z-20 text-lg text-white">Go Back <span aria-hidden="true">&rarr;</span></Link>
        </div>
    )
}
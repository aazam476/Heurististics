"use client";

import {ChangeEvent, useState } from "react";
import {NumberInputBar, TextInputArea } from "./InputAreas";

import DropDown from "./DropDown";
import PdfViewer from "./PdfViewer";
import Link from "next/link";
import ErrorBar from "./ErrorBar";
import OneSampleApiCall from "../scripts/ApiCall";

export interface IOneSampPayload {
    hypothesizedMean: number,
    sampleMean: number,
    sampleStdDev: number,
    sampleSize: number,
    populationSize: number,
    nullHypothesis: string,
    sampleType: string,
    alternativeHypothesis: string,
    alternativeHypothesisType: string
}

export default function OneSample({testType}:{testType:string}) {
    
    const [ payload, modfiyPayload ] = useState<IOneSampPayload>({
        hypothesizedMean: 0,
        sampleStdDev: 0,
        sampleMean: 0,
        sampleSize: 0,
        populationSize: 0,
        nullHypothesis: "",
        sampleType: "",
        alternativeHypothesis: "",
        alternativeHypothesisType: "<",
    })

    const [ pdfInfo, modifyPdfInfo ] = useState<string>("")

    const [ error, modifyError ] = useState<string>("")

    const modSampleMean = (
        event: ChangeEvent<HTMLInputElement>, payload: IOneSampPayload) => {
            payload.sampleMean = parseFloat(event.target.value);
        }

    const modHypothesisMean = (
        event: ChangeEvent<HTMLInputElement>, payload: IOneSampPayload) => {
            payload.hypothesizedMean = parseFloat(event.target.value);
        }

    const modStdDev = (
        event: ChangeEvent<HTMLInputElement>, payload: IOneSampPayload) => {
            payload.sampleStdDev = parseFloat(event.target.value)
        }

    const modSampleSize = (
        event: ChangeEvent<HTMLInputElement>, payload: IOneSampPayload) => {
            payload.sampleSize = parseInt(event.target.value);
        }

    const modPopulationSize = (
            event: ChangeEvent<HTMLInputElement>, payload: IOneSampPayload) => {
                payload.populationSize = parseInt(event.target.value);
            }

    const modNullHypothesis = (
        event: ChangeEvent<HTMLTextAreaElement>, payload: IOneSampPayload) => {
            payload.nullHypothesis = event.target.value;
        }

    const modAlternativeHypothesis = (
        event: ChangeEvent<HTMLTextAreaElement>, payload: IOneSampPayload) => {
            payload.alternativeHypothesis = event.target.value;
        }

    const modSampleType = (
        event: ChangeEvent<HTMLTextAreaElement>, payload: IOneSampPayload) => {
            payload.sampleType = event.target.value;
        }

    const alternativeHypothesisOptions = [
        "<",
        ">",
        "≠"
    ]

    const modAlternativeHypothesisType = (
        event: ChangeEvent<HTMLSelectElement>, payload: IOneSampPayload) => {
            payload.alternativeHypothesisType = event.target.value;
        }

    const validateNumbers = (numbers:number[]) : boolean => {
        let NaNcheck = numbers.every((val) => !isNaN(val))
        let zeroCheck = payload.sampleSize > 0 && payload.populationSize > 0 && payload.sampleStdDev > 0 && payload.sampleMean >= 0 && payload.hypothesizedMean >= 0
        let intCheck = Number.isInteger(payload.sampleSize) && Number.isInteger(payload.populationSize)
        if (testType === 'z')
            return NaNcheck && zeroCheck&& intCheck && payload.sampleMean <= 1 && payload.hypothesizedMean <= 1 && payload.sampleStdDev <= 1
        return NaNcheck && zeroCheck && intCheck

    }
    
    const handleSuccess = (value:Response) => value.json().then((data:{pdf:string}) => modifyPdfInfo(data.pdf))

    const handleFaliure = (value:Response) => { console.log('failed'); modifyError(`An Error Occured\t${JSON.stringify(value)}`) }

    const handleOutput = async (
        event: any) => {
            let arr = Object.values(payload)
            let numbers = (arr.filter((obj) => typeof obj === "number") as number[])

            // Every number is not NaN, certain numbers cannot be <= 0, certian numbers must be ints, certain numbers have to be [0,1] for prop z test
            let validNums:boolean = validateNumbers(numbers)
            
            // Every string is not empty
            let validText:boolean = arr.filter((obj) => typeof obj === "string").every((val) => !!val)

            if (validNums && validText) {
                let response = await OneSampleApiCall(payload, testType)
                
                if (response.ok)
                    handleSuccess(response)
                else
                    handleFaliure(response)
            }
            else
                modifyError("Invalid Inputs. "+(validText ? "Text is valid, " : "Text is invalid, ")+(validNums ? "Numbers are valid." : "Numbers are invalid."))
        }

    return (
        
        <div className="relative isolate overflow-hidden bg-gray-900 py-12 scroll-smooth snap-normal">
            <header className="px-24 font-bold tracking-tight text-white text-6xl text-pretty decoration-zinc-900">
                Welcome to the One {testType === 'z' ? 'Prop' : 'Sample'} {testType}-Test!</header>
            <div
            className="-hidden absolute w-screen h-screen mr-10 sm:flex transform-gpu sm:blur-3xl z-0"
            aria-hidden="true"
            >
                <div
                    className="aspect-[1920/1080] w-screen bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-40"
                />
            </div>
            <div className="flex flex-wrap px-20 pt-20 size-screen w-screen">
                <NumberInputBar payload = {payload} modifyPayload={modHypothesisMean} label={`Hypothesis ${testType === 'z' ? "Proportion" : "Mean"}`} placeholder={payload.hypothesizedMean}></NumberInputBar>
                <NumberInputBar payload = {payload} modifyPayload={modSampleMean} label={`Sample ${testType === 'z' ? "Proportion" : "Mean"}`} placeholder={payload.sampleMean}></NumberInputBar>
                <NumberInputBar payload = {payload} modifyPayload={modStdDev} label={`${testType === 'z' ? "Population" : "Sample"} Standard Deviation`} placeholder={payload.sampleStdDev}></NumberInputBar>
                <NumberInputBar payload = {payload} modifyPayload={modSampleSize} label="Sample Size" placeholder={payload.sampleSize}></NumberInputBar>
                <NumberInputBar payload = {payload} modifyPayload={modPopulationSize} label="Population Size" placeholder={payload.populationSize}></NumberInputBar>
            </div>
            <div className="flex px-20 pt-14 size-screen w-screen">
                <TextInputArea payload = {payload} modifyPayload={modNullHypothesis} label="Null Hypothesis" placeholder={payload.nullHypothesis}></TextInputArea>
                <TextInputArea payload = {payload} modifyPayload={modAlternativeHypothesis} label="Alternative Hypothesis" placeholder={payload.alternativeHypothesis}></TextInputArea>
                <TextInputArea payload = {payload} modifyPayload={modSampleType} label="What's Being Sampled?" placeholder={payload.sampleType}></TextInputArea>
            </div>
            <div className="flex px-20 mx-4 pt-14 size-3/12">
                <DropDown payload={payload} modifyPayload={modAlternativeHypothesisType} label="Alternative Hypothesis Type" options={alternativeHypothesisOptions}></DropDown>
            </div>
            <div className="flex justify-start mx-24 mt-14 w-screen">
                <button type="button" className="relative z-20 mr-10 opacity-90 bg-gradient-to-tr from-[#ff4694] to-[#776fff] text-white font-bold py-2 px-4 rounded-full text-md" onClick={handleOutput}>
                    Run Test    
                </button>
                <ErrorBar errorMsg={error}></ErrorBar>
            </div>
            <div className="relative z-10 p-24 size-full">
                <PdfViewer data={pdfInfo} ></PdfViewer>
            </div>
            <Link key="Go Back" href="/" className="relative px-24 z-20 text-lg text-white">Go Back <span aria-hidden="true">&rarr;</span></Link>
        </div>
    )
}
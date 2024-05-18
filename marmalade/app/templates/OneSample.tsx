"use client";

import {ChangeEvent, useState } from "react";
import {NumberInputBar, TextInputArea } from "./InputAreas";

import DropDown from "./DropDown";
import PdfViewer from "./PdfViewer";
import Link from "next/link";
import ErrorBar from "./ErrorBar";
import ApiCall from "../scripts/ApiCall";

export interface IOneSampPayload {
    hypothesisMean: number,
    sampleMean: number,
    sampleStdDev: number,
    sampleSize: number,
    populationSize: number,
    nullHypothesis: string,
    alternativeHypothesis: string,
    alternativeHypothesisType: string
}

export default function OneSample({testType}:{testType:string}) {
    
    const [ payload, modfiyPayload ] = useState<IOneSampPayload>({
        hypothesisMean: 0,
        sampleStdDev: 0,
        sampleMean: 0,
        sampleSize: 0,
        populationSize: 0,
        nullHypothesis: "",
        alternativeHypothesis: "",
        alternativeHypothesisType: "<",
    })

    const [ pdfInfo, modifyPdfInfo ] = useState<string>("")

    const [ error, modifyError ] = useState<string>("")

    const modSampleMean = (
        event: ChangeEvent<HTMLInputElement>, payload: IOneSampPayload) => {
            console.log(event.target.value)
            payload.sampleMean = parseFloat(event.target.value);
        }

    const modHypothesisMean = (
        event: ChangeEvent<HTMLInputElement>, payload: IOneSampPayload) => {
            console.log(event.target.value)
            payload.hypothesisMean = parseFloat(event.target.value);
        }

    const modStdDev = (
        event: ChangeEvent<HTMLInputElement>, payload: IOneSampPayload) => {
            console.log(event.target.value)
            payload.sampleStdDev = parseFloat(event.target.value)
        }

    const modSampleSize = (
        event: ChangeEvent<HTMLInputElement>, payload: IOneSampPayload) => {
            console.log(event.target.value)
            payload.sampleSize = parseInt(event.target.value);
        }

    const modPopulationSize = (
            event: ChangeEvent<HTMLInputElement>, payload: IOneSampPayload) => {
                console.log(event.target.value)
                payload.populationSize = parseInt(event.target.value);
            }

    const modNullHypothesis = (
        event: ChangeEvent<HTMLTextAreaElement>, payload: IOneSampPayload) => {
            console.log(event.target.value)
            payload.nullHypothesis = event.target.value;
        }

    const modAlternativeHypothesis = (
        event: ChangeEvent<HTMLTextAreaElement>, payload: IOneSampPayload) => {
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
        event: ChangeEvent<HTMLSelectElement>, payload: IOneSampPayload) => {
            console.log(event.target.value)
            payload.alternativeHypothesisType = event.target.value;
        }
    
    const base64STR="JVBERi0xLjMKJf////8KNyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDYgMCBSCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXQovRm9udCA8PAovRjIgOCAwIFIKPj4KPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCA3MTUKL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCnicrVa7jhsxDOz9FfqBKBRJDSXA2CJAUqQL4C5I4eyjuyL/3wTU7vpsK8jdBoGbtSBSM6MhqRQoUPiQAgWrHMaX069T6tY+XbbFFIyDpRQLabi8nD5+4ZA4XJbT97MWIbky6WwZI8Yh0I9w+Xr6fDl9e0dW1BTVcz1n1eRZh5BzOGvCaHo0c6YILs+Zsw2hUDgjM5mhOmYmyya+gsSEBTMyTyZImIwwtr1XnkyRTUyZUAEmU5QWBSyeB8sQOIdzyzvDmCAtm6Kaovq3iZ9i3OImZFO5HmUmFFnQMWOkdtaCybXLD/hR/WRHj+Q8oA3/woSGxdfxcwipaYOZye7yYbR6FCXVWLTziyQhzkzaKbNhduXaXQhLFuLSIiqTTPuaEJOMt3+Jx9e72PP3yr9q0BSoJsAQ2PlW1+Mgv1xq1Nw7d8ZijAkJo59t9ZkXZqN7NlyEeJZ0z5FJ5vbtbIjRotIfoupd1HPc2BjrjTcjI9mqSwJvvm4eOModNVJnQE9uYtlt7YCfhTh6CJfI1tv8ylMWv14n5OJyeSxVP9+ty8QTE8oQvCarEZbVJSarIreNlYmXPtFaLc1FXrGupCJvNQ7U1UertzzexJKx6WMev3u7InPlwxKQxVK6GmJ66+ce4LI5pckgLCr5lenmrAfU2/7jOLVY1NrVwvtwirmPhcRvtYpKalWtwkLtfzmKRhGN+s5PPBnW23NTWt7tI2mzyr1lBQpwebSb19RaWa1eNzWFjyJkREmdtd9xo39B+raO/ws95Vj5kCvXDsWzC+k+FJHc3Fbdh0IiYpLFfO467oOIBDmmDtB907V/ALEOGext19stSbOAGdYRk7ZBmXFFRnsa3B4F24OIZ2+vqYRzXpuP78arney2ujfqo+RVo2ln93UADkFpa1auxP4suW9i/hjYVWrDoPVwg+2PnYYwtUHSHmI8PyD8DQKtLkEKZW5kc3RyZWFtCmVuZG9iagoxMCAwIG9iagooUERGS2l0KQplbmRvYmoKMTEgMCBvYmoKKFBERktpdCkKZW5kb2JqCjEyIDAgb2JqCihEOjIwMjQwNTE4MDAxMTQzWikKZW5kb2JqCjkgMCBvYmoKPDwKL1Byb2R1Y2VyIDEwIDAgUgovQ3JlYXRvciAxMSAwIFIKL0NyZWF0aW9uRGF0ZSAxMiAwIFIKPj4KZW5kb2JqCjggMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9UaW1lcy1Sb21hbgovU3VidHlwZSAvVHlwZTEKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKPj4KZW5kb2JqCjQgMCBvYmoKPDwKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCi9OYW1lcyAyIDAgUgo+PgplbmRvYmoKMSAwIG9iago8PAovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzcgMCBSXQo+PgplbmRvYmoKMiAwIG9iago8PAovRGVzdHMgPDwKICAvTmFtZXMgWwpdCj4+Cj4+CmVuZG9iagp4cmVmCjAgMTMKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAxMzM4IDAwMDAwIG4gCjAwMDAwMDEzOTUgMDAwMDAgbiAKMDAwMDAwMTI3NiAwMDAwMCBuIAowMDAwMDAxMjU1IDAwMDAwIG4gCjAwMDAwMDAyMDggMDAwMDAgbiAKMDAwMDAwMDExOSAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDExNTYgMDAwMDAgbiAKMDAwMDAwMTA4MSAwMDAwMCBuIAowMDAwMDAwOTk1IDAwMDAwIG4gCjAwMDAwMDEwMjAgMDAwMDAgbiAKMDAwMDAwMTA0NSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDEzCi9Sb290IDMgMCBSCi9JbmZvIDkgMCBSCi9JRCBbPDY2Y2EwZDQ1YTc5MmJiMTFjNWE5NjM1OTI3NzY2ODQ0PiA8NjZjYTBkNDVhNzkyYmIxMWM1YTk2MzU5Mjc3NjY4NDQ+XQo+PgpzdGFydHhyZWYKMTQ0MgolJUVPRgo="


    const handleOutput = (
        event: any) => {

            let arr = Object.values(payload)
            let numbers = (arr.filter((obj) => typeof obj === "number") as number[])
            let validNums:boolean = numbers.every((val) => !isNaN(val)) && payload.sampleSize != 0 && payload.populationSize != 0 && payload.sampleStdDev != 0
            let validText:boolean = arr.filter((obj) => typeof obj === "string").every((val) => !!val)

            if (validNums && validText) {
                ApiCall(payload)
                modifyPdfInfo(base64STR)
            }
            else
                modifyError("Invalid Inputs. "+(validText ? "Text is valid, " : "Text is invalid, ")+(validNums ? "Numbers are valid." : "Numbers are invalid."))
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
                <NumberInputBar payload = {payload} modifyPayload={modStdDev} label="Standard Deviation" placeholder={payload.sampleStdDev}></NumberInputBar>
                <NumberInputBar payload = {payload} modifyPayload={modSampleSize} label="Sample Size" placeholder={payload.sampleSize}></NumberInputBar>
                <NumberInputBar payload = {payload} modifyPayload={modPopulationSize} label="Population Size" placeholder={payload.populationSize}></NumberInputBar>
            </div>
            <div className="flex px-20 pt-14 size-screen w-screen">
                <TextInputArea payload = {payload} modifyPayload={modNullHypothesis} label="Null Hypothesis" placeholder={payload.nullHypothesis}></TextInputArea>
                <TextInputArea payload = {payload} modifyPayload={modAlternativeHypothesis} label="Alternative Hypothesis" placeholder={payload.alternativeHypothesis}></TextInputArea>
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
import { Source } from "postcss";
import { IOneSampPayload } from "../templates/OneSample";
import fetch from 'node-fetch';

export default async function OneSampleApiCall(payload:IOneSampPayload, testType:string) {

    const options = {
        method: 'GET',
        body: JSON.stringify(payload)
    }

    let path = `https://heurististics.azamserver.com/api/oneSampleTest/${testType}Test/`

    const response = await fetch(path, options)
    console.log(response)
}
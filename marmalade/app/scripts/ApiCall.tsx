import { Source } from "postcss";import { IOneSampPayload } from "../templates/OneSample";
export default async function OneSampleApiCall(payload:IOneSampPayload, testType:string) {

    let url = `https://heurististics.azamserver.com/api/oneSampleTest/${testType}Test/`

    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Accept', 'application/json')

    let data

    if (testType === 'z') {
        const { sampleStdDev, ...rest } = payload;
        data = { populationStdDev: sampleStdDev, ...rest };
    }
    else
        data = payload

    let body = JSON.stringify(data)

    console.log(`Request Body: ${body}`)

    return await fetch(url, {
        mode: 'cors',
        method: 'POST',
        headers: headers,
        body:  body
    })
}
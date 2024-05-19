import { Source } from "postcss";
import { IOneSampPayload } from "../templates/OneSample";

export default async function OneSampleApiCall(payload:IOneSampPayload, testType:string) {

    let url = `https://heurististics.azamserver.com/api/oneSampleTest/${testType}Test/`

    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Accept', 'application/json')

    let body = JSON.stringify(payload)

    if (testType === 'z')
    {
        body = body.replace('sampleStdDev', 'populationStdDev')
    }

    let newPayload = JSON.parse(body) 

    newPayload = {
        "hypothesizedMean": 0.47,
        "sampleMean": 0.44,
        "sampleSize": 200,
        "populationStdDev": 0.1,
        "populationSize": 2001,
        "nullHypothesis": "null",
        "alternativeHypothesis": "alt",
        "alternativeHypothesisType": ">"
    }

    let data = new FormData()
    data.append("json",JSON.stringify(newPayload))

    console.log(`Request Body: ${body}`)

    const raw = await fetch(url, {
        mode: 'no-cors',
        method: 'POST',
        headers: headers,
        body: data
    })
    const response = await raw.json()
    console.log(response)
}
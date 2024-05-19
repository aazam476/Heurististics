import express from 'express';
import logger from './logger';
import {v1 as uuidv1} from 'uuid';
import jStat from 'jstat';
import PDFDocument from 'pdfkit';
import {Base64Encode} from 'base64-stream';
import {Request, Response} from 'express-serve-static-core';

const router = express.Router();

const Z_TEST_PARAMS = ["hypothesizedMean", "sampleMean", "sampleSize", "populationStdDev", "nullHypothesis", "alternativeHypothesis", "alternativeHypothesisType"];
const T_TEST_PARAMS = ["hypothesizedMean", "sampleMean", "sampleStdDev", "sampleSize", "nullHypothesis", "alternativeHypothesis", "alternativeHypothesisType"];

router.post('/zTest', async (req, res) => {
    await handleRequest('z', req, res, Z_TEST_PARAMS);
});

router.post('/tTest', async (req, res) => {
    await handleRequest('t', req, res, T_TEST_PARAMS);
});

async function handleRequest(testType: 'z' | 't', req: Request, res: Response, requiredParams: string[]) {
    logRequest(testType, req);

    if (!paramsExist(req, requiredParams) || !paramsExist(req, [ "populationSize" ]) && !paramsExist(req, [ "sampleType" ])) {
        return logResponse(res, req.body.UUID, req.body.IP, 400, {reason: "missing required parameters"});
    }

    const {
        hypothesizedMean, sampleMean, sampleSize, sampleType,
        populationStdDev, sampleStdDev, populationSize, alphaValue,
        nullHypothesis, alternativeHypothesis, alternativeHypothesisType
    } = req.body;

    const stdDev = testType === 'z' ? populationStdDev : sampleStdDev;

    const doc = await performTest(
        testType, hypothesizedMean, sampleMean, stdDev, sampleSize,
        sampleType, populationSize, alphaValue, nullHypothesis,
        alternativeHypothesis, alternativeHypothesisType
    );

    if (!doc) {
        return logResponse(res, req.body.UUID, req.body.IP, 500, {reason: "internal server error"});
    }

    logResponse(res, req.body.UUID, req.body.IP, 200, {pdf: doc});
}

async function performTest(
    testType: 'z' | 't', hypothesizedMean: number, mean: number, stdDev: number, sampleSize: number,
    sampleType: string, populationSize: number, alphaValue: number, nullHypothesis: string,
    alternativeHypothesis: string, alternativeHypothesisType: '<' | '>' | '≠'
): Promise<string> {
    try {
        const formattedNullHypothesis = `H0: ${nullHypothesis}`;
        const formattedAlternativeHypothesis = `HA: ${alternativeHypothesis}`;
        const conditions = formatConditions(testType, hypothesizedMean, populationSize, sampleSize, sampleType);
        const score = calculateScore(hypothesizedMean, mean, stdDev, sampleSize);
        const formattedScore = formatScore(testType, hypothesizedMean, mean, stdDev, sampleSize, score);
        const pValue = calculatePValue(testType, sampleSize, score, alternativeHypothesisType);
        const formattedPValue = formatPValue(testType, alternativeHypothesisType, score, sampleSize, pValue);
        const formattedConclusion = formatConclusion(pValue, alphaValue, alternativeHypothesis);
        const doc = createPDF(testType, formattedNullHypothesis, formattedAlternativeHypothesis, conditions, formattedScore, formattedPValue, formattedConclusion);

        return await pdfToBase64(doc);
    } catch (err) {
        return null;
    }
}

function formatConditions(testType: 'z' | 't', hypothesizedMean: number, populationSize: number, sampleSize: number, sampleType: string) {
    const conditions: string[] = [];

    conditions.push(`Random: Sample is stated to be taken randomly.`);
    conditions.push(populationSize ?
        sampleSize * 10 < populationSize ? `10% Condition: Since ${sampleSize}(10) = ${(sampleSize * 10)} < ${populationSize}, the 10% condition is satisfied.` :
            `10% Condition: Since ${sampleSize}(10) = ${(sampleSize * 10)} >= ${populationSize}, the 10% condition is not satisfied. However, we will proceed with caution.` :
        `10% Condition: It is reasonable to assume there are more than ${sampleSize}(10) = ${(sampleSize * 10)} ${sampleType}s.`
    );
    conditions.push(
        testType === 'z' ?
            hypothesizedMean * sampleSize < 10 && (1 - hypothesizedMean) * sampleSize < 10 ? `Normality: Since np = ${sampleSize}(${hypothesizedMean}) = ${(sampleSize * hypothesizedMean)} < 10 & nq = ${sampleSize}(${(1 - hypothesizedMean)}) = ${(sampleSize * (1 - hypothesizedMean))} < 10, it is not reasonable to assume normality. However, we will proceed with caution.` :
                hypothesizedMean * sampleSize < 10 ? `Normality: Since nq = ${sampleSize}(${(1 - hypothesizedMean)}) = ${(sampleSize * (1 - hypothesizedMean))} >= 10, but np = ${sampleSize}(${hypothesizedMean}) = ${(sampleSize * hypothesizedMean)} < 10, it is not reasonable to assume normality. However, we will proceed with caution.` :
                    (1 - hypothesizedMean) * sampleSize < 10 ? `Normality: Since np = ${sampleSize}(${hypothesizedMean}) = ${(sampleSize * hypothesizedMean)} >= 10, but nq = ${sampleSize}(${(1 - hypothesizedMean)}) = ${(sampleSize * (1 - hypothesizedMean))} < 10, it is not reasonable to assume normality. However, we will proceed with caution.` :
                        `Normality: Since np = ${sampleSize}(${hypothesizedMean}) = ${(sampleSize * hypothesizedMean)} >= 10 & nq = ${sampleSize}(${(1 - hypothesizedMean)}) = ${(sampleSize * (1 - hypothesizedMean))} >= 10, it is reasonable to assume normality.` :
            sampleSize >= 30 ? `Normality: Due to the central limit theorem, since the sample size = ${sampleSize} >= 30, it is reasonable to assume normality.` :
                `Normality: Due to the central limit theorem, since the sample size = ${sampleSize} <= 30, it is not reasonable to assume normality. However, we will proceed with caution.`
    );

    return conditions;
}

function calculateScore(hypothesizedMean: number, mean: number, stdDev: number, sampleSize: number) {
    return (mean - hypothesizedMean) / (stdDev / Math.sqrt(sampleSize));
}

function formatScore(testType: 'z' | 't', hypothesizedMean: number, mean: number, stdDev: number, sampleSize: number, score: number) {
    return `${testType.toUpperCase()}-Score: (sample mean - hypothesis mean) / (${testType === 'z' ? "population" : "sample"} standard deviation / sqrt(sample size))
                 = (${mean} - ${hypothesizedMean}) / (${stdDev} / sqrt(${sampleSize}))
                 = ${score}`;
}

function calculatePValue(testType: 'z' | 't', sampleSize: number, score: number, alternativeHypothesisType: '<' | '>' | '≠') {
    if (testType === 'z') {
        return (alternativeHypothesisType === "<") ? jStat.ztest(score, 0, 1, 1) :
            (alternativeHypothesisType === ">") ? 1 - jStat.ztest(score, 0, 1, 1) :
                jStat.ztest(score, 0, 1, 2)
    } else if (testType === 't') {
        return (alternativeHypothesisType === "<") ? 1 - jStat.ttest(score, sampleSize, 1) :
            (alternativeHypothesisType === ">") ? jStat.ttest(score, sampleSize, 1) :
                jStat.ttest(score, sampleSize, 2);
    }
}

function formatPValue(testType: 'z' | 't', alternativeHypothesisType: '<' | '>' | '≠', score: number, sampleSize: number, pValue: number) {
    let formattedPValue = "P-value: ";

    if (testType === 'z') {
        if (alternativeHypothesisType === "<") {
            formattedPValue += `normalcdf(Z-Score, 0, 1)
              = normalcdf(${score}, 0, 1)
              = ${pValue}`;
        } else if (alternativeHypothesisType === ">") {
            formattedPValue += `1 - normalcdf(Z-Score, 0, 1)
              = 1 - normalcdf(${score}, 0, 1)
              = ${pValue}`;
        } else if (alternativeHypothesisType === "≠") {
            formattedPValue += `(1 - normalcdf(Z-Score, 0, 1)) / 2
              = (1 - normalcdf(${score}, 0, 1)) / 2
              = ${pValue}`;
        }
    } else if (testType === 't') {
        const degreesOfFreedom = sampleSize - 1;

        if (alternativeHypothesisType === "<") {
            formattedPValue += `tcdf(T-Score, degrees of freedom)
              = tcdf(${score}, ${degreesOfFreedom})
              = ${pValue}`;
        } else if (alternativeHypothesisType === ">") {
            formattedPValue += `1 - tcdf(T-Score, degrees of freedom)
              = 1 - tcdf(${score}, ${degreesOfFreedom})
              = ${pValue}`;
        } else if (alternativeHypothesisType === "≠") {
            formattedPValue += `(1 - tcdf(T-Score, degrees of freedom)) / 2
              = (1 - tcdf(${score}, ${degreesOfFreedom})) / 2
              = ${pValue}`;
        }
    }

    return formattedPValue;
}

function formatConclusion(pValue: number, alphaValue: number, alternativeHypothesis: string) {
    alphaValue = alphaValue || 0.05;

    return pValue < alphaValue ?
        `Since p = ${pValue} < a = ${alphaValue}, we can reject the null. Therefore, there is convincing evidence to suggest that ${alternativeHypothesis.toLowerCase()}.` :
        `Since p = ${pValue} >= a = ${alphaValue}, we fail to reject the null. Therefore, there is not convincing evidence to suggest that ${alternativeHypothesis.toLowerCase()}.`;
}

function createPDF(testType: 'z' | 't', nullHypothesis: string, alternativeHypothesis: string, conditions: string[], score: string, pValue: string, conclusion: string) {
    const doc = new PDFDocument();

    doc.font("Times-Roman").fontSize(12).lineGap(7);

    doc
        .text(nullHypothesis)
        .text(alternativeHypothesis)
        .moveDown()
        .text(`We will use a one-sample ${testType}-test if the following conditions are met:`)
        .text(conditions.join('\n'))
        .moveDown()
        .text(score)
        .moveDown()
        .text(pValue)
        .moveDown()
        .text(conclusion)

    doc.end();

    return doc;
}

function paramsExist(req: Request<{}>, params: string[]) {
    return params.every(param => req.body[param] !== undefined);
}

function logRequest(testType: 'z' | 't', req: Request<any>) {
    const uuid = uuidv1();
    const ip = Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    req.body.UUID = uuid;
    req.body.IP = ip;
    req.body.testType = testType;

    logger.debug(JSON.stringify(req.body));
}

function logResponse(res: Response, UUID: string, IP: string, statusCode: number, body: {
    pdf?: string,
    reason?: string
}) {
    const log = {UUID, IP, statusCode, ...body};
    logger.debug(JSON.stringify(log));
    res.status(statusCode).json(body);
}

async function pdfToBase64(doc: PDFKit.PDFDocument): Promise<string> {
    return new Promise((resolve, reject) => {
        const stream = doc.pipe(new Base64Encode());
        let base64Value = '';

        stream.on('data', (chunk: string) => {
            base64Value += chunk;
        });

        stream.on('end', () => {
            resolve(base64Value);
        });

        stream.on('error', (err: any) => {
            reject(err);
        });
    });
}

export default router;
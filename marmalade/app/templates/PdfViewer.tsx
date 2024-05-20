import { useId, useState } from "react";
import { IOneSampPayload } from "./OneSample";



export default function PdfViewer({data} : {data: string})
{   
    return !!data && <embed className="size-full h-dvh object-fill" src={`data:application/pdf;base64,${data}`} />
}
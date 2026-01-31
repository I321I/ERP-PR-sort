import { useEffect, useState } from "react"
import { read, readFile, utils, writeFileXLSX, type Sheet } from 'xlsx';

export const InputField: React.FC = () => {
    const [json1, setJson1] = useState<object[] | null>(null)
    const [json2, setJson2] = useState<object[] | null>(null)

    const handleFile1Change = async (event: any) => {
        if (event.target.files[0]) {
            const toArrayBuffer = await event.target.files[0]?.arrayBuffer()
            const temJson1: object[] = utils.sheet_to_json(read(toArrayBuffer).Sheets[read(toArrayBuffer).SheetNames[0]])
            temJson1.shift()
            setJson1(temJson1)
        }
    }
    const handleFile2Change = async (event: any) => {
        if (event.target.files[0]) {
            const toArrayBuffer = await event.target.files[0]?.arrayBuffer()
            const temJson2: object[] = utils.sheet_to_json(read(toArrayBuffer).Sheets[read(toArrayBuffer).SheetNames[0]])
            temJson2.shift()
            setJson2(temJson2)
        }
    }
    //coding
    //1. 第二List的array：排除掉第一List有的項目，且項目不重複。資訊包含請購單號、採購單號，採購單號不需要第二"-"後的資訊。
    //2. 第二List的次array：
    //      資訊包含：採購單號、品號、品名、規格、請購數量、請購單位。不包含：品號是H23010001, H23020001的項目。
    //樣式

    const poRegex = /(.+)(-.+)/

    const mainList1Map = new Map()
    for (let i of json1 ? json1 : []) {
        mainList1Map.set(i, { "請購單號": json1?.["請購單號" as any], "採購單號": json1?.["採購單號" as any] })
    }
    console.log(mainList1Map)
    const mainList2 = json2?.map((item, i) => {

    })

    return (
        <>
            <input type="file" id="ERP請購狀態表excel1" accept=".xlsx, .xls" onChange={handleFile1Change}></input>
            {/* {json1 && (
                <div>
                    {JSON.stringify(json1)}
                </div>
            )} */}
            <input type="file" id="ERP請購狀態表excel2" accept=".xlsx, .xls" onChange={handleFile2Change}></input>
            {/* {json2 && (
                <div>
                    {JSON.stringify(json2)}
                </div>
            )} */}
        </>
    )
}
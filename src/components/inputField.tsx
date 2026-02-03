import { useEffect, useState } from "react";
import { read, readFile, utils, writeFileXLSX, type Sheet } from 'xlsx';
import { useAppDispatch, useAppSelector } from "../main";
import { setMainList1, setMainList2 } from "../store/listContent";
import { DateSelector } from "./Date";
import styles from './InputField.module.scss'

type file = objNestedJson[]
interface objNestedJson {
    "請購單號": string;
    "採購單號": string;
}

export const InputField: React.FC = () => {
    const List1 = useAppSelector(state => state.listContentReducer.list1ContentState)
    const List2 = useAppSelector(state => state.listContentReducer.list2ContentState)
    const dispatch = useAppDispatch()
    const [json1, setJson1] = useState<file | null>(null)
    const [json2, setJson2] = useState<file | null>(null)
    const handleFile1Change = async (event: any) => {
        if (event.target.files[0]) {
            const toArrayBuffer = await event.target.files[0]?.arrayBuffer()
            const temJson1: file = utils.sheet_to_json(read(toArrayBuffer).Sheets[read(toArrayBuffer).SheetNames[0]])
            temJson1.shift()
            setJson1(temJson1)
        }
    }
    const handleFile2Change = async (event: any) => {
        if (event.target.files[0]) {
            const toArrayBuffer = await event.target.files[0]?.arrayBuffer()
            const temJson2: file = utils.sheet_to_json(read(toArrayBuffer).Sheets[read(toArrayBuffer).SheetNames[0]])
            temJson2.shift()
            setJson2(temJson2)
        }
    }
    //coding
    //1. 第二List的array：排除掉第一List有的項目，且項目不重複。資訊包含請購單號、採購單號，採購單號不需要第二"-"後的資訊。
    //2. 第二List的次array：
    //      資訊包含：採購單號、廠商名稱、品號、品名、規格、請購數量、請購單位。不包含：品號是H23010001, H23020001的項目。
    //          {採購單號, the others}。品號是排除項目；採購單號=1；採購單號>1
    //              判斷品號，map下for迴圈跑採購單號
    //樣式
    const poRegex = /(.+)(-.+)/
    const jsonToMap = (json: file) => {
        const map = new Map()
        for (let i = 0; i < json.length; i++) {
            map.set(
                poRegex.exec((json[i])["採購單號"])?.[1],
                {
                    "請購單號": (json[i])["請購單號"],
                    "採購單號": poRegex.exec((json[i])["採購單號"])?.[1]
                })
        }
        const mapSort = new Map([...map].sort((a, b) => {
            return a[0].localeCompare(b[0])
        }))
        return mapSort
    }
    const secMapDifference = (map1: Map<any, any>, map2: Map<any, any>) => {
        const result = new Map(map2)
        for (let [key] of map1) {
            if (result.has(key)) { result.delete(key) }
        }
        return result
    }
    useEffect(() => {
        const mainList1Map = json1 ? jsonToMap(json1) : new Map()
        const mainList2Map = json2 ? jsonToMap(json2) : new Map()
        const mainList2Difference = (mainList1Map.size !== 0 && mainList2Map.size !== 0) ? secMapDifference(mainList1Map, mainList2Map) : new Map()
        // dispatch(setMainList1(mainList1Map))
        // dispatch(setMainList2(mainList2Map))
    }, [json1, json2])


    return (
        <div className={`${styles.input}`}>
            <div>
                <div>
                    <DateSelector />
                    <select>
                        <option>001</option>
                        <option>新增檔案</option>
                    </select>
                </div>
                <label className={`${styles.replaceInput}`} htmlFor="uploadExcel1">選擇檔案</label>
                <input className={`${styles.file}`} type="file" id="uploadExcel1" accept=".xlsx" onChange={handleFile1Change}></input>
            </div>
            <div>
                <div>
                    <DateSelector />
                    <select>
                        <option>001</option>
                        <option>新增檔案</option>
                    </select>
                </div>
                <label className={`${styles.replaceInput}`} htmlFor="uploadExcel2">選擇檔案</label>
                <input className={`${styles.file}`} type="file" id="uploadExcel2" accept=".xlsx" onChange={handleFile2Change}></input>
            </div>
        </div>
    )
}
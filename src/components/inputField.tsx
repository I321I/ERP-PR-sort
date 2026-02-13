import React, { useEffect, useState, type ChangeEvent } from "react";
import { read, utils } from 'xlsx';
import { DateSelector } from "./Date";
import styles from './InputField.module.scss'
import { useAppDispatch, useAppSelector } from "../main";
import { setDate1, setDate2 } from "../store/DateState";
import { Table } from "react-bootstrap";

type file = objNestedJson[]
interface objNestedJson {
    "請購單號": string;
    "採購單號": string;
    "廠商代號": string;
    "廠商名稱": string;
    "品    號": string;
    "品       名": string;
    "規       格": string;
    "採購數量": number;
    "請購單位": string;
}

export const InputField: React.FC = () => {
    const [json1, setJson1] = useState<file | null>(null)
    const [json2, setJson2] = useState<file | null>(null)
    const [select1, setSelect1] = useState<string>()
    const [select2, setSelect2] = useState<string>()
    const dateState1 = useAppSelector((store) => store.DateReducer.date1)
    const dateState2 = useAppSelector((store) => store.DateReducer.date2)
    const dispatch = useAppDispatch()
    const checkSavedKey = (dateState: string | null) => {
        let boolean: boolean = false
        const regex = /(.+)-(.+)-(.+)/
        const keyArray: string[] = []
        const mainIndexArray: number[] = []
        let lastKeyNumber = undefined
        if (dateState == null) return { dateState, boolean, mainIndArr: mainIndexArray, keyArray, lastKeyNumber }
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i)?.includes(`${dateState}-`) === false) continue
            const key = localStorage.key(i)
            if (key && regex.exec(key)?.[3] === "main") { mainIndexArray.push(i); keyArray.push((regex.exec(key)?.[2]) as string) }
            boolean = true

        }
        keyArray.sort()
        lastKeyNumber = keyArray.at(-1)
        return { dateState, boolean, mainIndArr: mainIndexArray, keyArray, lastKeyNumber }
    }
    const handleFile1Change = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event?.target?.files?.[0]) {
            const toArrayBuffer = await event.target.files[0]?.arrayBuffer()
            const tempJson1: file = utils.sheet_to_json(read(toArrayBuffer).Sheets[read(toArrayBuffer).SheetNames[0]])
            tempJson1.shift()
            setJson1(tempJson1)
        }
    }
    const handleFile2Change = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event?.target?.files?.[0]) {
            const toArrayBuffer = await event.target.files[0]?.arrayBuffer()
            const tempJson2: file = utils.sheet_to_json(read(toArrayBuffer).Sheets[read(toArrayBuffer).SheetNames[0]])
            tempJson2.shift()
            setJson2(tempJson2)
        }
    }
    const handleSelect1Change = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelect1(event.target.value)
    }
    const handleSelect2Change = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelect2(event.target.value)
    }
    const handdleDateChange = (date: string | null, setSelect: React.Dispatch<React.SetStateAction<string | undefined>>) => {
        if (checkSavedKey(date).boolean) setSelect(checkSavedKey(date).lastKeyNumber)
        else if (date == null) setSelect(undefined)
        else if (typeof date === "string") setSelect("新增檔案")
    }
    const poRegex = /(.+)(-.+)/
    const jsonToMap = (json: file) => {
        const map = new Map()
        for (let i = 0; i < json.length; i++) {
            map.set(
                (json[i])["請購單號"],
                {
                    "請購單號": (json[i])["請購單號"],
                    "採購單號": poRegex.exec((json[i])["採購單號"])?.[1]
                })
        }
        const mapSort = new Map([...map].sort((current, next) => {
            return current[0].localeCompare(next[0])
        }))
        return mapSort
    }
    const secMapDifference = (map1: Map<string, objNestedJson>, map2: Map<string, objNestedJson>) => {
        const result = new Map(map2)
        for (const [key] of map1) {
            if (result.has(key)) { result.delete(key) }
        }
        return result
    }
    const selectDom = (selectUseState: string | undefined, optionsArray: string[], haddleChange: (event: ChangeEvent<HTMLSelectElement>) => void, dateState: string | null) => {
        const options = optionsArray
        optionsArray.push("新增檔案")
        const optDom = options.map((item: string) => {
            return <option>{item}</option>
        })
        if (!dateState) {
            return (
                <select className={`${styles.selectDom}`} value={selectUseState} onChange={haddleChange} disabled >
                    {optDom}
                </select >
            )
        }
        return (
            <select className={`${styles.selectDom}`} value={selectUseState} onChange={haddleChange}  >
                {optDom}
            </select>
        )
    }
    //coding
    //1. 第二List的array：排除掉第一List有的項目，且項目不重複。資訊包含請購單號、採購單號，採購單號不需要第二"-"後的資訊。
    //2. 第二List的次array：
    //      資訊包含：請購單號、採購單號、廠商名稱、品號、品名、規格、請購數量、請購單位。不包含：品號是H23010001, H23020001的項目。
    //          {採購單號, the others}。品號是排除項目；採購單號=1；採購單號>1
    //              判斷品號，map下for迴圈跑採購單號
    //樣式
    const toMajorListMap = (json: file) => {
        const map = new Map()
        for (let i = 0; i < json.length; i++) {
            if ((json[i])["品    號"] === "H23010001") continue
            if ((json[i])["品    號"] === "H23020001") continue
            map.set(
                (json[i])["採購單號"],
                {
                    "請購單號": (json[i])["請購單號"],
                    "廠商": (json[i])["廠商名稱"] + (json[i])["廠商代號"],
                    "品號": (json[i])["品    號"],
                    "品名": (json[i])["品       名"],
                    "規格": (json[i])["規       格"],
                    "採購數量": (json[i])["採購數量"],
                    "請購單位": (json[i])["請購單位"],
                })
        }
        return map
    }
    const mapToItem = (map: Map<string, object>) => JSON.stringify(Object.fromEntries(map))
    const map1 = json1 ? jsonToMap(json1) : new Map()
    const map2 = json2 ? jsonToMap(json2) : new Map()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const map2Difference = (map1.size !== 0 && map2.size !== 0) ? secMapDifference(map1, map2) : new Map()
    const majorMap1 = json1 ? toMajorListMap(json1) : new Map()
    const majorMap2 = json2 ? toMajorListMap(json2) : new Map()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const beingSavedData1 = map1.size !== 0 ? mapToItem(map1) : null
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const beingSavedData2 = map2.size ? mapToItem(map2) : null
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const beingSavedMajor1 = majorMap1.size ? mapToItem(majorMap1) : null
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const beingSavedMajor2 = majorMap2.size ? mapToItem(majorMap2) : null
    const saveDataWhetherExists = (dateState: string | null, beingSavedData: string | null, beingSavedMajor: string | null) => {
        if (checkSavedKey(dateState).boolean === false) {
            localStorage.setItem(`${dateState}-001-main`, beingSavedData as string)
            localStorage.setItem(`${dateState}-001-major`, beingSavedMajor as string)
            handdleDateChange(dateState, setSelect1)
        }
        else {
            const idx = (checkSavedKey(dateState).mainIndArr)?.length + 1
            if (idx.toString().length === 1) {
                localStorage.setItem(`${dateState}-00${idx}-main`, beingSavedData as string)
                localStorage.setItem(`${dateState}-00${idx}-major`, beingSavedMajor as string)
            }
            if (idx.toString().length === 2) {
                localStorage.setItem(`${dateState}-0${idx}-main`, beingSavedData as string)
                localStorage.setItem(`${dateState}-0${idx}-major`, beingSavedMajor as string)
            }
            if (idx.toString().length === 3) {
                localStorage.setItem(`${dateState}-${idx}-main`, beingSavedData as string)
                localStorage.setItem(`${dateState}-${idx}-major`, beingSavedMajor as string)
            }
            handdleDateChange(dateState, setSelect1)
        }
    }
    useEffect(() => {
        if (dateState1) saveDataWhetherExists(dateState1, beingSavedData1, beingSavedMajor1)
        if (dateState2) saveDataWhetherExists(dateState2, beingSavedData2, beingSavedMajor2)
    }, [json1, json2])
    const list = (dateState: string | null, select: string | undefined) => {
        if (dateState == null || select == null) return
        const toMap = (json: string): Map<string, object> => new Map(Object.entries(JSON.parse(json)))
        const mainMap: Map<string, object> = toMap(localStorage.getItem(`${dateState}-${select}-main`) as string)
        const majorMap: Map<string, object> = toMap(localStorage.getItem(`${dateState}-${select}-major`) as string)
        const List = ({ map, major = false }: { map: Map<string, object>, major?: boolean }) => {
            const columnsName = Object.keys([...map][0][1]).map((namesObject) => namesObject)
            const listHead = <thead><tr>{columnsName.map((name) => <th>{name}</th>)}</tr></thead>
            const listBody =
                major === false
                    ? <tbody>{[...map].map((item) => {
                        return (
                            <tr role="button" data-toggle="collapse" data-target={`#${(item[1] as Record<string, unknown>)["請購單號"]}`}>{columnsName.map((columnName: string) => {
                                return (
                                    <td>
                                        {`${(item[1] as Record<string, unknown>)[columnName]}`}
                                    </td>)
                            })
                            }</tr>)
                    })}
                    </tbody>
                    : <></>
            return { columnsName, listHead, listBody }
        }
        return (
            <Table striped bordered hover>
                {List({ map: mainMap }).listHead}
                {List({ map: mainMap }).listBody}
                <div className="collapse" id="H311-20251212003">123</div>
            </Table >
        )
    }
    //日期: {key:{資料}}
    //  key組成:(日期)-(數字)-(1.main 2. major)
    //讀取 選日期->是否有key->無->建立->重新確認是否有key
    //                     ->有->最大的key->讀其main和major
    //存檔時機，換檔案時
    //何時讀檔，換檔案後、換時間，每次重新渲染，前提：有時間
    return (
        <div className={`${styles.input}`}>
            <div className={`${styles.singleInput}`} >
                <div className={`${styles.inputTitle}`}>
                    <div className={`${styles.title}`}>檔案</div>
                    <span style={{ height: "auto", width: "4px" }}></span>
                    <DateSelector onChange={(date) => { dispatch(setDate1(date)); handdleDateChange(date, setSelect1) }} />
                    {selectDom(select1, checkSavedKey(dateState1).keyArray, handleSelect1Change, dateState1)}
                </div>
                {(select1 === "新增檔案" || select1 == null && dateState1) && (
                    <label className={`${styles.replaceInput}`} htmlFor="uploadExcel1">
                        <img className={`${styles.img}`} src="/src/assets/fileImage.png" alt="Excel Image" />
                        <div className={`${styles.select}`}>...選擇檔案</div>
                    </label>
                )}
                <input className={`${styles.file}`} type="file" id="uploadExcel1" accept=".xlsx" onChange={handleFile1Change}></input>
                {(select1 !== "新增檔案" && select1 != null) &&
                    list(dateState1, select1)}
                <div className="collapse" id="collapseExample">
                    <div className="card card-body">
                        Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
                    </div>
                </div>
            </div>
            <div className={`${styles.singleInput}`}>
                <div className={`${styles.inputTitle}`}>
                    <div className={`${styles.title}`}>對照檔案</div>
                    <span style={{ height: "auto", width: "4px" }}></span>
                    <DateSelector onChange={(date) => { dispatch(setDate2(date)); handdleDateChange(date, setSelect2) }} />
                    {selectDom(select2, checkSavedKey(dateState2).keyArray, handleSelect2Change, dateState2)}
                </div>
                {(select2 === "新增檔案" || select2 == null && dateState2) &&
                    (<label className={`${styles.replaceInput}`} htmlFor="uploadExcel2">
                        <img className={`${styles.img}`} src="/src/assets/fileImage.png" alt="Excel Image" />
                        <div className={`${styles.select}`}>...選擇檔案</div>
                    </label>
                    )}
                <input className={`${styles.file}`} type="file" id="uploadExcel2" accept=".xlsx" onChange={handleFile2Change}></input>
            </div>
        </div >
    )
}
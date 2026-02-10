import { useState, type ChangeEvent } from "react";
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
        let lastKeyNumber = undefined
        if (dateState == null) return { dateState1, boolean, keyArray, lastKeyNumber }
        for (let i = 0; i < localStorage.length; i++) {
            if (!localStorage.key(i)?.includes(dateState)) continue
            const key = localStorage.key(i)
            if (key && regex.exec(key)?.[3] === "main") keyArray.push((regex.exec(key)?.[2]) as string)
            boolean = true
        }
        keyArray.sort()
        lastKeyNumber = keyArray.at(-1)
        const result = { dateState1, boolean, keyArray, lastKeyNumber }
        return result
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
        const mapSort = new Map([...map].sort((a, b) => {
            return a[0].localeCompare(b[0])
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

    // console.log(beingSavedData1 === null, beingSavedMajor1 === null)

    //日期: {key:{資料}}
    //  key組成:(日期)-(數字)-(1.main 2. major)
    //讀取 選日期->是否有key->無->建立->重新確認是否有key
    //                     ->有->最大的key->讀其main和major

    localStorage.setItem("2026/2/1", "123")
    localStorage.setItem("2026/2/1-001-main", "456")
    // console.log(localStorage.getItem("2026/2/1"))
    // localStorage.clear()

    // const selectOptions = (array) => {
    //     return ()
    // }

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
                {(select1 !== "新增檔案" && select1 != null) && (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td colSpan={2}>Larry the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                    </Table>)}
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
import { use, useEffect, useState, type ChangeEvent, type JSX } from "react";
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
}

export const InputField: React.FC = () => {
    const [json1, setJson1] = useState<file | null>(null)
    const [json2, setJson2] = useState<file | null>(null)
    const [select1, setSelect1] = useState<string>()
    const [select2, setSelect2] = useState<string>()
    const dateState1 = useAppSelector((store) => store.DateReducer.date1)
    const dateState2 = useAppSelector((store) => store.DateReducer.date2)
    const dispatch = useAppDispatch()
    const handleFile1Change = async (event: any) => {
        if (event.target.files[0]) {
            const toArrayBuffer = await event.target.files[0]?.arrayBuffer()
            const tempJson1: file = utils.sheet_to_json(read(toArrayBuffer).Sheets[read(toArrayBuffer).SheetNames[0]])
            tempJson1.shift()
            setJson1(tempJson1)
        }
    }
    const handleFile2Change = async (event: any) => {
        if (event.target.files[0]) {
            const toArrayBuffer = await event.target.files[0]?.arrayBuffer()
            const tempJson2: file = utils.sheet_to_json(read(toArrayBuffer).Sheets[read(toArrayBuffer).SheetNames[0]])
            tempJson2.shift()
            setJson2(tempJson2)
        }
    }
    const haddleSelect1Change = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelect1(event.target.value)
    }
    const haddleSelect2Change = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelect2(event.target.value)
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
    const secMapDifference = (map1: Map<any, any>, map2: Map<any, any>) => {
        const result = new Map(map2)
        for (let [key] of map1) {
            if (result.has(key)) { result.delete(key) }
        }
        return result
    }
    const selectDom = (idNumber: number, selectUseState: string | undefined, haddleChange: (event: ChangeEvent<HTMLSelectElement>) => void, dateState: string) => {
        const options = [
            "新增檔案",
            "001"
        ]
        const optDom = options.map((item) => {
            return <option>{item}</option>
        })
        if (!dateState) {
            return (
                <select id={"select" + idNumber.toString()} value={selectUseState} onChange={haddleChange} disabled >
                    {optDom}
                </select >
            )
        }

        return (
            <select id={idNumber.toString()} value={selectUseState} onChange={haddleChange}  >
                {optDom}
            </select>
        )
    }
    const map1 = json1 ? jsonToMap(json1) : new Map()
    const map2 = json2 ? jsonToMap(json2) : new Map()
    const map2Difference = (map1.size !== 0 && map2.size !== 0) ? secMapDifference(map1, map2) : new Map()
    const obj1: objNestedJson = Object.fromEntries(map1)
    const obj2: objNestedJson = Object.fromEntries(map2)
    // console.log(obj1, Object.values(obj1).length, Object.values(obj1))
    // console.log(map2Difference)
    const mainList1 = Object.values(obj1).map((item, i) => {
        return (
            <></>
        )
    })
    return (
        <div className={`${styles.input}`}>
            <div className={`${styles.singleInput}`} >
                <div className={`${styles.inputTitle}`}>
                    <div className={`${styles.title}`}>檔案</div>
                    <span style={{ height: "auto", width: "4px" }}></span>
                    <DateSelector onChange={(date) => { dispatch(setDate1(date)) }} />
                    {selectDom(1, select1, haddleSelect1Change, dateState1)}
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
                    <DateSelector onChange={(date) => dispatch(setDate2(date))} />
                    {selectDom(2, select2, haddleSelect2Change, dateState2)}
                </div>
                <label className={`${styles.replaceInput}`} htmlFor="uploadExcel2">
                    <img className={`${styles.img}`} src="/src/assets/fileImage.png" alt="Excel Image" />
                    <div className={`${styles.select}`}>...選擇檔案</div>
                </label>
                <input className={`${styles.file}`} type="file" id="uploadExcel2" accept=".xlsx" onChange={handleFile2Change}></input>
            </div>

        </div >
    )
}
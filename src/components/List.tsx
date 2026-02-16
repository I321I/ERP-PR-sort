import { Table } from "react-bootstrap"
import { ListCollapse } from "./ListCollapse"
import styles from './List.module.scss'

interface List {
    dateState: string | null,
    select: string | undefined
    bNotA?: true | false
    dateStateA?: string | null,
    selectA?: string | undefined
}

export const List: React.FC<List> = ({ dateState, select, bNotA = false, dateStateA = null, selectA = undefined }) => {
    if (!((bNotA === true && typeof dateStateA === "string" && typeof selectA === "string")
        || (bNotA === false && dateStateA == null && selectA == null))) return
    if (dateState == null || select == null) return
    const toMap = (json: string): Map<string, Record<string, string>> => new Map(Object.entries(JSON.parse(json)))
    const mainMap: Map<string, Record<string, string>> = toMap(localStorage.getItem(`${dateState}-${select}-main`) as string)
    const majorMap: Map<string, Record<string, string>> = toMap(localStorage.getItem(`${dateState}-${select}-major`) as string)
    const list = ({ mainMap, majorMap }: { mainMap: Map<string, Record<string, string>>, majorMap: Map<string, Record<string, string>> }) => {
        const MainColumnsName = Object.keys([...mainMap][0][1]).map((namesObject) => namesObject)
        const listHead = <thead><tr>{MainColumnsName.map((name) => <th>{name}</th>)}</tr></thead>
        const listBody =
            <tbody >{[...mainMap].map(([, item]) => {
                return (
                    <ListCollapse mainListObject={item} majorMap={majorMap} MainColumnsName={MainColumnsName}></ListCollapse>)
            })}
            </tbody >
        return { columnsName: MainColumnsName, listHead, listBody }
    }
    if (bNotA === false) {
        return (
            <div className={`${styles.table}`}>
                <Table bordered hover >
                    {list({ mainMap: mainMap, majorMap: majorMap }).listHead}
                    {list({ mainMap: mainMap, majorMap: majorMap }).listBody}
                </Table >
            </div>
        )
    }
    else {
        const mainMapA: Map<string, Record<string, string>> = toMap(localStorage.getItem(`${dateStateA}-${selectA}-main`) as string)
        const bNotAMap = (mapA: Map<string, Record<string, string>>, mapB: Map<string, Record<string, string>>) => {
            const result = new Map(mapB)
            console.log("first", result)
            for (const [key] of mapA) {
                console.log(key)
                if (result.has(key)) { result.delete(key) }
            }
            console.log("last result", result)
            return result
        }
        const differenceMap = bNotAMap(mainMapA, mainMap)
        if (differenceMap.size < 1) return <div>無</div>
        return (
            <div className={`${styles.table}`}>
                <Table bordered hover >
                    {list({ mainMap: differenceMap, majorMap: majorMap }).listHead}
                    {list({ mainMap: differenceMap, majorMap: majorMap }).listBody}
                </Table >
            </div>
        )
    }
}
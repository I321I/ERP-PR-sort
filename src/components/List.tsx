import { Table } from "react-bootstrap"
import { ListCollapse } from "./ListCollapse"

interface List {
    dateState: string | null,
    select: string | undefined
}

export const List: React.FC<List> = ({ dateState, select }) => {
    if (dateState == null || select == null) return
    const toMap = (json: string): Map<string, Record<string, string>> => new Map(Object.entries(JSON.parse(json)))
    const mainMap: Map<string, Record<string, string>> = toMap(localStorage.getItem(`${dateState}-${select}-main`) as string)
    const majorMap: Map<string, Record<string, string>> = toMap(localStorage.getItem(`${dateState}-${select}-major`) as string)
    const list = ({ mainMap, majorMap }: { mainMap: Map<string, Record<string, string>>, majorMap: Map<string, Record<string, string>> }) => {
        const MainColumnsName = Object.keys([...mainMap][0][1]).map((namesObject) => namesObject)
        const listHead = <thead><tr >{MainColumnsName.map((name) => <th>{name}</th>)}</tr></thead >
        const listBody =
            <tbody >{[...mainMap].map(([, item]) => {
                return (
                    <ListCollapse mainListObject={item} majorMap={majorMap} MainColumnsName={MainColumnsName}></ListCollapse>
                )
            })}
            </tbody >


        return { columnsName: MainColumnsName, listHead, listBody }
    }
    return (
        <Table striped bordered hover >
            {list({ mainMap: mainMap, majorMap: majorMap }).listHead}
            {list({ mainMap: mainMap, majorMap: majorMap }).listBody}
        </Table >
    )
}
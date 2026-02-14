import { useState } from "react"
import { Collapse, Table } from "react-bootstrap"
import styles from "./List.module.scss"

interface List {
    dateState: string | null,
    select: string | undefined
}

export const List: React.FC<List> = ({ dateState, select }) => {
    const [open, setOpen] = useState<boolean>(false)
    if (dateState == null || select == null) return
    const toMap = (json: string): Map<string, object> => new Map(Object.entries(JSON.parse(json)))
    const mainMap: Map<string, object> = toMap(localStorage.getItem(`${dateState}-${select}-main`) as string)
    const majorMap: Map<string, object> = toMap(localStorage.getItem(`${dateState}-${select}-major`) as string)
    const list = ({ mainMap, majorMap, major = false }: { mainMap: Map<string, object>, majorMap: Map<string, object>, major?: boolean }) => {
        const columnsName =
            major === false
                ? Object.keys([...mainMap][0][1]).map((namesObject) => namesObject)
                : Object.keys([...mainMap][0][1]).filter((namesObject) => namesObject !== "請購單號")
        const listHead =
            major === false
                ? <thead><tr >{columnsName.map((name) => <th>{name}</th>)}</tr></thead >
                : <Collapse in={open}><thead><tr >{columnsName.map((name) => <th>{name}</th>)}</tr></thead></Collapse>
        const listBody =
            major === false
                ? <tbody >{[...mainMap].map((item) => {
                    return (
                        <>
                            <tr role="button" onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open}>{columnsName.map((columnName: string) => {
                                return (
                                    <td>
                                        {`${(item[1] as Record<string, unknown>)[columnName]}`}
                                    </td>)
                            })}
                            </tr>
                            <tr>
                                <td colSpan={columnsName.length} style={{ padding: 0, border: 0 }}>
                                    <Table className={`${styles.fixed_table_container}`}>
                                        {list({ mainMap: majorMap, majorMap: majorMap, major: true }).listHead}
                                        {list({ mainMap: majorMap, majorMap: majorMap, major: true }).listBody}
                                    </Table>
                                </td>
                            </tr>
                        </ >
                    )
                })}
                </tbody >
                :
                <tbody>{[...mainMap].map((item) => {
                    return (
                        <tr >{columnsName.map((columnName: string) => {
                            return (
                                <Collapse in={open}>
                                    <td>
                                        {`${(item[1] as Record<string, unknown>)[columnName]}`}
                                    </td>
                                </Collapse>
                            )
                        })}
                        </tr>
                    )
                })}
                </tbody >

        return { columnsName, listHead, listBody }
    }
    return (
        <Table striped bordered hover >
            {list({ mainMap: mainMap, majorMap: majorMap }).listHead}
            {list({ mainMap: mainMap, majorMap: majorMap }).listBody}
        </Table >
    )
}
import React, { useState } from 'react'
import { Collapse, Table } from 'react-bootstrap'
import styles from './List.module.scss'
import "bootstrap-icons/font/bootstrap-icons.css"
import { v4 as uuidv4 } from 'uuid'

interface ListCollapseProps {
    mainListObject: Record<string, string>
    majorMap: Map<string, Record<string, string>>
    MainColumnsName: string[]
}

export const ListCollapse: React.FC<ListCollapseProps> = ({ mainListObject, majorMap, MainColumnsName: columnsName }) => {
    const [open, setOpen] = useState(false)
    const main = (mainListItem: Record<string, string>, majorMap: Map<string, Record<string, string>>, columnsNameArray: string[]) => {
        return (
            <tr role="button" onClick={() => { setOpen(!open) }}>{columnsNameArray.map((columnName: string) => {
                if (columnName === columnsNameArray.at(-1) && [...majorMap].map(([, object]) => object["請購單號"] === mainListItem["請購單號"]).includes(true)) {
                    return (
                        <td key={mainListItem[columnName]} className={`${styles.lastMainTd}`}>
                            {`${mainListItem[columnName]}`}
                            <i className={`${styles.chevronDown} bi bi-chevron-down`}></i>
                        </td>
                    )
                }
                return (
                    <td key={mainListItem[columnName]}>
                        {`${mainListItem[columnName]}`}
                    </td>)
            })
            }
            </tr >
        )
    }
    const major = (majorListMap: Map<string, Record<string, string>>, mainObject: Record<string, string>) => {
        const majorColumnsNames = Object.keys([...majorListMap][0][1]).filter((namesObject) => namesObject !== "請購單號")
        const majorHead = <thead><tr >{majorColumnsNames.map((name) => <th key={name}>{name}</th>)}</tr></thead >
        if ([...majorListMap].filter(([, item]) => item["請購單號"] === mainObject["請購單號"]).length === 0) return <div />
        return (
            <Table striped className={`${styles.transitionDuration}`} >
                {majorHead}
                < tbody >
                    {[...majorListMap].filter(([, item]) => item["請購單號"] === mainObject["請購單號"]).map(([, item]) => {
                        return (
                            <tr key={uuidv4()} >{majorColumnsNames.map((columnName: string) => {
                                return (
                                    <td key={uuidv4()}>
                                        {`${item[columnName]}`}
                                    </td>
                                )
                            })}
                            </tr>
                        )
                    })}
                </tbody >
            </Table>
        )
    }
    return (
        <>
            {main(mainListObject, majorMap, columnsName)}
            <tr>
                <td colSpan={columnsName.length} style={{ padding: 0, border: 0 }}>
                    <Collapse in={open}>
                        {major(majorMap, mainListObject)}
                    </Collapse>
                </td>
            </tr>
        </>
    )
}
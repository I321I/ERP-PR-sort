import React, { useState } from 'react'
import { Collapse, Table } from 'react-bootstrap'

interface ListCollapseProps {
    mainListObject: Record<string, string>
    majorMap: Map<string, Record<string, string>>
    MainColumnsName: string[]
}

export const ListCollapse: React.FC<ListCollapseProps> = ({ mainListObject, majorMap, MainColumnsName: columnsName }) => {
    const [open, setOpen] = useState(false)
    console.log(open)
    const main = (mainListItem: Record<string, string>, columnsNameArray: string[]) => {
        return (
            <tr role="button" onClick={() => { setOpen(!open); console.log(123) }}>{columnsNameArray.map((columnName: string) => {
                return (
                    <td>
                        {`${mainListItem[columnName]}`}
                    </td>)
            })}
            </tr>
        )
    }
    const major = (majorListMap: Map<string, Record<string, string>>, mainObject: Record<string, string>) => {
        const majorColumnsNames = Object.keys([...majorListMap][0][1]).filter((namesObject) => namesObject !== "請購單號")
        const majorHead = <thead><tr >{majorColumnsNames.map((name) => <th>{name}</th>)}</tr></thead >
        if ([...majorListMap].filter(([, item]) => item["請購單號"] === mainObject["請購單號"]).length === 0) return <></>
        return (
            <Table>
                {majorHead}
                < tbody >
                    {[...majorListMap].filter(([, item]) => item["請購單號"] === mainObject["請購單號"]).map(([, item]) => {
                        return (
                            <tr >{majorColumnsNames.map((columnName: string) => {
                                return (
                                    <td>
                                        {`${(item as Record<string, unknown>)[columnName]}`}
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
            {main(mainListObject, columnsName)}
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
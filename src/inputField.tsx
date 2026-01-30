import { useEffect, useState } from "react"
import { read, readFile, utils, writeFileXLSX, type Sheet } from 'xlsx';

export const InputField: React.FC = () => {

    const [file1, setFile1] = useState<Sheet | null>(null)
    const handleFileChange = (event: any) => {
        if (event.target.files[0]) {
            setFile1(event.target.files[0])
            console.log(event.target.files[0])
        }
    }
    async function loadWb1() {
        const data = await file1?.arrayBuffer()
        const wb1 = read(data)
        console.log(wb1)
    }

    useEffect(() => {
        if (file1) {
            loadWb1()
        }
    }, [file1])

    return (
        <>
            <input type="file" id="ERP請購狀態表excel" accept=".xlsx, .xls" onChange={handleFileChange}></input>
            {file1 && (
                <div>
                    <p>名稱：{file1.name}</p>
                    <p>尺寸：{(file1.size / 1024).toFixed(2)} KB</p>
                    <p>種類：{file1.type}</p>
                </div>
            )}
        </>
    )
}
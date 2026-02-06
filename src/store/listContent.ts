import { createSlice } from '@reduxjs/toolkit'

const listContent = createSlice({
    name: "listContentState",
    initialState: { date1: new Map(), date2: new Map() },
    reducers: {
        setDate1: (state, action) => { state.date1 = action.payload },
        setDate2: (state, action) => { state.date2 = action.payload }
    }
})

export const { setDate1, setDate2} = listContent.actions;
export default listContent.reducer

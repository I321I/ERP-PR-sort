import { createSlice } from '@reduxjs/toolkit'

const dateState = createSlice({
    name: "DateState",
    initialState: { date1: new Map(), date2: new Map() },
    reducers: {
        setDate1: (state, action) => { state.date1 = action.payload },
        setDate2: (state, action) => { state.date2 = action.payload }
    }
})

export const { setDate1, setDate2} = dateState.actions;
export default dateState.reducer

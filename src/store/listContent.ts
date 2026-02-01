import { createSlice } from '@reduxjs/toolkit'

const listContent = createSlice({
    name: "listContentState",
    initialState: { list1ContentState: new Map(), list2ContentState: new Map() },
    reducers: {
        setMainList1: (state, action) => { state.list1ContentState = action.payload },
        setMainList2: (state, action) => { state.list2ContentState = action.payload }
    }
})

export const { setMainList1, setMainList2 } = listContent.actions;
export default listContent.reducer

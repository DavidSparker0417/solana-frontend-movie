import { createSlice } from "@reduxjs/toolkit"
import { AppStore } from "./store"

export interface TransactionState {
  count: number
}

const initialState: TransactionState = {
  count: 0,
}

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setCount(state, action) {
      state.count = action.payload
    }
  }
})

export const {setCount} = transactionSlice.actions;
export const getCount = (state: any) => state.transaction.count
export default transactionSlice.reducer;
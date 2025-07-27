import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice'
import socketSlice from './socketSlice'
const store = configureStore({
  reducer:{
    user:userSlice,
    socket:socketSlice
  }
})

export default store;
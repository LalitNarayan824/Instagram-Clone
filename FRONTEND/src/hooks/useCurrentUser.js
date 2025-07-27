import React, { useEffect } from 'react'
import api from '../utils/api'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice';

const useCurrentUser = () => {
  const dispatch = useDispatch();


  useEffect(()=>{
    const fetchUser = async ()=>{
      try {
        const result = await api.get('/api/user/current');
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(`error in get current user : ${error}`);
      }
    }

    fetchUser();
  }, [dispatch])
}

export default useCurrentUser;

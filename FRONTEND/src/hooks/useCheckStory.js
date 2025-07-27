import api from "../utils/api"


export const useCheckStory = async ()=>{
  try {
    const res = await api.get('/api/story/check-story')
  } catch (error) {
    console.log(error)
  }
}
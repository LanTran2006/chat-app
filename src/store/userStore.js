import { create } from 'zustand'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase/config';
export const userStore = create((set) => ({
  active: false,
  currentUser: null,
  ischecking: true,
  fetchUserInfo: async(id)=>{
    if (!id) {
      return set({currentUser: null,ischecking: false});
    }
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      set({currentUser: docSnap.data(),ischecking: false})
    } 
  },
  setActive: ()=>set((state)=>({active: !state.active}))
}))
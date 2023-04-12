import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { doc } from "firebase/firestore";
export const Authcontext = createContext();

function AuthContext({ children }) {
  const [currentuser, setCurrentuser] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    //currentuser
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentuser(user);
    });
    //update userchats
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
     
        for (let user of users) {
          for (let client of users) {
            if (client.uid !== user.uid) setuserchats(user, client);
          }
        }
      
  
    });

    const setuserchats = async (user, client) => {
      let combineid =
        client.uid > user.uid ? client.uid + user.uid : user.uid + client.uid;
        const docchats= await getDoc(doc(db, "userchats", user.uid))
       console.log(docchats);
       const checkmessage=docchats.data()
       console.log(checkmessage);
       if (checkmessage) {
        await setDoc(doc(db, "userchats", user.uid), {
          [combineid]: {
            info: null,
            date: null,
            lastmessage: {...checkmessage[combineid]?.lastmessage}
          },
        });
       } else {
        await setDoc(doc(db, "userchats", user.uid), {
          [combineid]: {
            info: null,
            date: null,
            lastmessage: {},
          },
        });
       }
      await updateDoc(doc(db, "userchats", user.uid), {
        [combineid + ".info"]: {
          id: client.uid,
          displayname: client.displayname,
          photoURL: client.photoURL,
        },
        [combineid + ".date"]: serverTimestamp()
      });

      const docSnap = await getDoc(doc(db, "chats", combineid));
      const check=docSnap.data()
 
      !check && await setDoc(doc(db, "chats", combineid), {
        message: [],
      });
    };
    return () => {
      unsub();
      unsubscribe();
    };
  }, []);

  return (
    <Authcontext.Provider value={{ currentuser,loading,setLoading}}>
      {children}
    </Authcontext.Provider>
  );
}

export default AuthContext;

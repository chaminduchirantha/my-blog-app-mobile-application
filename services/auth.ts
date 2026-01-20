import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { auth } from "./firbase";
import { doc, setDoc } from "firebase/firestore"
import { db } from "./firbase";

export const registerUser = async (fullname: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    await updateProfile(userCredential.user, {
      displayName: fullname
    })

    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      name: fullname,
      role: "",
      createAt : new Date()
    })

    return userCredential.user
    
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}
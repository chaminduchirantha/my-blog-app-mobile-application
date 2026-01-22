import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { auth } from "./firbase";
import { doc, setDoc } from "firebase/firestore"
import { db } from "./firbase";

export const registerUser = async (fullname: string, email: string, password: string, profileImageBase64?: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;


    const photoURL = profileImageBase64
      ? `data:image/jpeg;base64,${profileImageBase64}`
      : "";

    await updateProfile(user, {
      displayName: fullname,
    });

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: fullname,
      role: "user",
      photoURL: photoURL,
      createdAt: new Date(), 
    });

    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export const loginUser = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
    
    
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}
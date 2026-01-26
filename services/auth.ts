import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile ,updateEmail
} from "firebase/auth";
import { doc, setDoc, updateDoc} from "firebase/firestore";
import { auth, db} from "./firbase";

WebBrowser.maybeCompleteAuthSession();

export const registerUser = async (
  fullname: string,
  email: string,
  password: string,
  profileImageBase64?: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
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
};

export const loginUser = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const firebaseGoogleLogin = async (idToken: string) => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: user.displayName || "User",
        email: user.email,
        role: "user",
        photoURL: user.photoURL || "",
        createdAt: new Date(),
      },
      { merge: true }
    );

    return userCredential;
  } catch (error) {
    console.error("Firebase Google login error:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};


export const updateUserProfile = async (
  newName: string,
  newEmail?: string,
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  try {
    await updateProfile(user, {
      displayName: newName,
    });

    if (newEmail && newEmail !== user.email) {
      await updateEmail(user, newEmail);
    }

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      name: newName,
      email: newEmail || user.email,
    });

    return user;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

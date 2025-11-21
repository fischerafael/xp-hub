import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./config";

export type GoogleProfile = {
  uid: string;
  email: string;
  name: string;
  avatarUrl: string | null;
};

export async function signInWithGooglePopup(): Promise<GoogleProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const { user } = result;

  return {
    uid: user.uid,
    email: user.email ?? "",
    name: user.displayName ?? "",
    avatarUrl: user.photoURL,
  };
}

export function signOutFromFirebase() {
  return signOut(auth);
}

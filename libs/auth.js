/* 로그인, 회원가입, 정보 갱신, 로그 아웃 */
import auth from '@react-native-firebase/auth';

export function signIn(email, password) {
  console.log(email, password);
  return auth().signInWithEmailAndPassword(email, password);
}

export function join(email, password) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export function subscribeAuth(callback) {
  return auth().onAuthStateChanged(callback);
}

export function signOut() {
  return auth().signOut();
}

/* 사용자 정보 유지를 위한 Context */
import firestore from '@react-native-firebase/firestore';

export const usersCollection = firestore().collection('users');

export function createUser({id, displayName, photoURL}) {
  return usersCollection.doc(id).set({
    id,
    displayName,
    photoURL,
  });
}

export async function getUserInfo(id) {
  const doc = await usersCollection.doc(id).get();

  return doc.data();
}

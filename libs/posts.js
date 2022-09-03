import firestore from '@react-native-firebase/firestore';

const postsCollection = firestore().collection('posts');

export function createPost({user, photoURL, description}) {
  return postsCollection.add({
    user,
    photoURL,
    description,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
}

export const PAGE_SIZE = 12;
export async function getPosts({userId, mode, id} = {}) {
  console.log('getPosts :: ', userId, mode, id);
  let query = postsCollection.orderBy('createdAt', 'desc').limit(PAGE_SIZE);
  if (userId) {
    query = query.where('user.id', '==', userId);
  }
  if (id) {
    const cursorDoc = await postsCollection.doc(id).get();
    query =
      mode === 'older'
        ? query.startAfter(cursorDoc)
        : query.endBefore(cursorDoc);
  }

  const snapshot = await query.get();

  const posts = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return posts;
}

export async function getOlderPosts(id, userId) {
  return getPosts({
    userId,
    mode: 'older',
    id,
  });
}

export async function getNewerPosts(id, userId) {
  return getPosts({
    userId,
    mode: 'newer',
    id,
  });
}

export function removePost(postId) {
  return postsCollection.doc(postId).delete();
}

export function updatePost({postId, description}) {
  return postsCollection.doc(postId).update({
    description,
  });
}

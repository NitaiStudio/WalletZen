import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  query, 
  serverTimestamp,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db as dexieDb } from '@/database/db';
import { db as firestoreDb, auth, OperationType, handleFirestoreError } from '@/lib/firebase';

export async function syncUserProfile() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userRef = doc(firestoreDb, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        initialBalance: 0,
        monthlySalary: 0,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
}

export async function syncTransactions() {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  try {
    // 1. Push local unsynced changes to Firestore
    const unsynced = await dexieDb.transactions.where('synced').equals(false as any).toArray();
    
    for (const tx of unsynced) {
      const txRef = doc(firestoreDb, `users/${userId}/transactions`, tx.id?.toString() || '');
      await setDoc(txRef, {
        ...tx,
        userId,
        createdAt: serverTimestamp(),
      });
      await dexieDb.transactions.update(tx.id!, { synced: true });
    }

    // 2. Pull from Firestore to Local (Simple overwrite for MVP)
    const q = query(collection(firestoreDb, `users/${userId}/transactions`));
    const snapshot = await getDocs(q);
    
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const existing = await dexieDb.transactions.get(Number(docSnap.id));
      if (!existing) {
        await dexieDb.transactions.add({
          ...data,
          id: Number(docSnap.id),
          synced: true
        } as any);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/transactions`);
  }
}

// Similarly for Budgets and Goals...
export async function syncBudgets() {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  try {
    const unsynced = await dexieDb.budgets.where('synced' as any).equals(false as any).toArray();
    for (const b of unsynced) {
      const ref = doc(firestoreDb, `users/${userId}/budgets`, b.id?.toString() || '');
      await setDoc(ref, {
        ...b,
        userId,
        createdAt: serverTimestamp(),
      });
      await dexieDb.budgets.update(b.id!, { synced: true } as any);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/budgets`);
  }
}

export async function syncGoals() {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  try {
    const unsynced = await dexieDb.goals.where('synced' as any).equals(false as any).toArray();
    for (const g of unsynced) {
      const ref = doc(firestoreDb, `users/${userId}/goals`, g.id?.toString() || '');
      await setDoc(ref, {
        ...g,
        userId,
        createdAt: serverTimestamp(),
      });
      await dexieDb.goals.update(g.id!, { synced: true } as any);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/goals`);
  }
}

export async function syncAll() {
  await syncUserProfile();
  await syncTransactions();
  await syncBudgets();
  await syncGoals();
}

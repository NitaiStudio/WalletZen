import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  serverTimestamp,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db as dexieDb } from '@/database/db';
import { db as firestoreDb, auth, OperationType, handleFirestoreError } from '@/lib/firebase';

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
export async function syncAll() {
  await syncTransactions();
  // ... other syncs
}

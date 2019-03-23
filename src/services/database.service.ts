import firebaseSvc from "./firebase.service";

class FireStoreDatabase {

  async getCollection<T>(collectionPath: string, qry: (collection: firebase.firestore.Query) => firebase.firestore.Query = null) {

    let coll = this.firestore.collection(collectionPath) as firebase.firestore.Query;
    if (qry) {
      coll = qry(coll);
    }

    const snapshot = await coll.get();
    let items: T[] = [];
    snapshot.forEach(doc => {
      let docData: any = doc.data();
      docData.ID = doc.id;
      items.push(docData);
    });
    (items as any[]).sort((a, b) => a.ID.localeCompare(b.ID));
    return items;
  }

  async addToCollection<T>(collectionPath: string, item: T) {
    const docRef = await this.firestore
      .collection(collectionPath)
      .add(item);
    item['ID'] = docRef.id;
    return item;
  }

  updateItem<T>(collectionPath: string, item: T) {
    return this.firestore
      .collection(collectionPath)
      .doc(item['ID'])
      .update(item);
  }

  removeItem<T>(collectionPath: string, item: T) {
    return this.firestore
      .collection(collectionPath)
      .doc(item['ID'])
      .delete();
  }

  removeMany<T>(collectionPath:string, items:T[]){
    const batch = this.firestore.batch();
    for (const item of items) {
      const itemDocRef = this.firestore.collection(collectionPath).doc(item["ID"]);
      batch.delete(itemDocRef);
    }

    return batch.commit();
  }

  firestore = firebaseSvc.firestore();
}

export const databaseSvc = new FireStoreDatabase();
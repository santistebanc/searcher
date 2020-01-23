import PouchDB from "pouchdb-browser";

console.log("data worker spawned", Math.random());

const db = new PouchDB("tasks");

export function put(doc) {
  return db.put(doc).catch(err => new Promise((_, rej) => rej({ ...err })));
}

export function get(_id) {
  return db.get(_id).catch(err => new Promise((_, rej) => rej({ ...err })));
}

import DataWorker from "comlink-loader!./dataWorker"; // eslint-disable-line import/no-webpack-loader-syntax
import lodashThrottle from "lodash/throttle";

export class DataState {
  static dataWorker = new DataWorker();
  defaults = {};
  constructor() {
    this.create();
  }
  async connectToStore({ id, throttle = 5000, local = false } = {}) {
    this.isPersisted = true;
    this.throttlePersist = lodashThrottle(this.persist, throttle);
    this.doc._id = this.constructor.getStorageId(id, local);
    try {
      const doc = await this.constructor.dataWorker.get(this.doc._id);
      this.doc = doc;
    } catch (err) {
      if (err.name === "not_found") {
        return this.persist(this.doc);
      } else {
        console.error("error at get in connectToStore in pouchdb", err);
      }
    }
    return this;
  }
  static getStorageId(id, isLocal) {
    return `${isLocal ? "_local/" : ""}${this.name}/${id}`;
  }
  get(field) {
    return this.doc[field];
  }
  create() {
    const now = new Date().getTime();
    this.doc = {
      _id: now.toString(),
      dateCreated: now,
      ...this.defaults
    };
    return this;
  }
  update(newData) {
    console.log("updating", newData);
    const now = new Date().getTime();
    this.doc = {
      ...this.doc,
      lastUpdated: now,
      ...newData
    };
    if (this.isPersisted) this.throttlePersist();
    return this;
  }
  async persist(doc) {
    console.log('persisting...')
    try {
      const latestDoc =
        doc || (await this.constructor.dataWorker.get(this.doc._id));
      const res = await this.constructor.dataWorker.put({
        ...latestDoc,
        ...this.doc
      });
      this.doc._rev = res.rev;
      console.log('persisting finished')
    } catch (err) {
      console.error("error at persisting to pouchdb", doc._id, err);
    }
    return this;
  }
}

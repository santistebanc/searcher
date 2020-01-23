import { DataState } from "./data";

export class Task extends DataState {
  defaults = {
    status: "fresh",
    progress: 0,
    priority: 0
  };
  get status() {
    return this.get("status");
  }
  start() {
    const now = new Date().getTime();
    this.update({
      dateStarted: now,
      status: "inProgress"
    });
    return this;
  }
  updateProgress(progress) {
    const percentage = Math.round(progress);
    console.log("progress updated ", percentage);
    if (percentage === 100) {
      this.finish();
    } else {
      this.update({
        progress: percentage
      });
    }
    return this;
  }
  finish() {
    const now = new Date().getTime();
    this.update({
      dateFinished: now,
      status: "finished",
      progress: 100
    });
    return this;
  }
  pause() {
    this.update({
      status: "paused"
    });
    return this;
  }
  resume() {
    if (this.get("status") === "paused") {
      this.update({
        status: "inProgress"
      });
    }
    return this;
  }
}

export class Index extends DataState {
  get length() {
    return this.get("length");
  }
  get data() {
    return this.get("data");
  }
  write(data, length) {
    this.update({
      data,
      length
    });
    return this;
  }
}

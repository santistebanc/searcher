import deu_phrases from "./phrases/phrases.deu.json";
import searchWorker from "comlink-loader!./searchWorker"; // eslint-disable-line import/no-webpack-loader-syntax
import debounce from "./utils/debounce";
import * as Comlink from "comlink";
import { Task, Index } from "./models";

export default class searcher {
  constructor() {
    this.searchWorker = new searchWorker();
    this.startIndexing();
  }

  async startIndexing() {
    const index = await new Index().connectToStore({
      id: "deu_phrases_index",
      throttle: 10000,
      local: true
    });
    console.log("index length", index.length);
    if (index.length) {
      const data = index.data;
      console.time("import index");
      await this.searchWorker.importIndex(data);
      console.timeEnd("import index");
    } else {
      const task = await new Task().connectToStore({
        id: "index-phrases",
        throttle: 10000,
        local: true
      });

      const updateProgressCallback = progress => {
        task.updateProgress(progress);
      };

      const updateProgressProxy = Comlink.proxy(updateProgressCallback);

      task.start();
      this.searchWorker.index(updateProgressProxy).then(length => {
        console.time("export index");
        this.searchWorker.exportIndex().then(data => {
          console.timeEnd("export index");
          index.write(data, length);
          console.log("..................yea", index.length);
        });
      });
    }
  }

  search = debounce(async (query, limit) => {
    const resIndices = await this.searchWorker.searchQuery(query, limit);
    this.searchResult = resIndices.map(ind =>
      deu_phrases.find(ph => ph.id === ind)
    );
    return this.searchResult;
  }, 300);

  async cancel() {
    this.search(false);
  }
}

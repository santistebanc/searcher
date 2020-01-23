import deu_phrases from "./phrases/phrases.deu.json";
import FlexSearch from "flexsearch";

console.log("search worker spawned", Math.random());

const phrasesDeuIndex = new FlexSearch("speed");

export async function index(reportProgress) {
  console.log("starting indexing", deu_phrases.length);
  const totalPhrases = 100_000;
  let count = 1;
  deu_phrases.slice(0, 100_000).forEach((ph, i) => {
    if (i >> 13 === count) {
      count++;
      reportProgress(((i + 1) * 100) / totalPhrases);
    }
    phrasesDeuIndex.add(ph.id, ph.text);
  });
  reportProgress(100);
  console.log("finshed indexing", phrasesDeuIndex.length);
  return phrasesDeuIndex.length;
}

export async function importIndex(data) {
  console.log("importing index");
  await phrasesDeuIndex.import(data);
  console.log("finshed importing");
}

export async function exportIndex() {
  console.log("exporting index");
  const data = await phrasesDeuIndex.export();
  console.log("finshed exporting");
  return data;
}

export async function searchQuery(query, limit) {
  console.log("start search for: ", query, phrasesDeuIndex.length);
  const res = phrasesDeuIndex.search({ query, limit });
  console.log("finished search for: ", query, res);
  return res;
}

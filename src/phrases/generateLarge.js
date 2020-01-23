const fs = require("fs");
const es = require("event-stream");

let lineNr = 0;
const LIMIT = 10000000;

const eng_phrases = [];

const deu_phrases = [];

const readStream = fs
  .createReadStream("src/phrases/sentences.csv")
  .pipe(es.split())
  .pipe(
    es
      .mapSync(function(line) {
        readStream.pause();

        lineNr += 1;
        parseLine(line);
        if (lineNr >= LIMIT) readStream.end();

        readStream.resume();
      })
      .on("end", async function() {
        await Promise.all([
          fs
            .createWriteStream("src/phrases/phrases.eng.json")
            .write(JSON.stringify(eng_phrases)),
          fs
            .createWriteStream("src/phrases/phrases.deu.json")
            .write(JSON.stringify(deu_phrases))
        ]);
      })
  );

function addPhrase(phrases, id, text) {
  phrases.push({ id, text });
}

function parseLine(line) {
  const [id, lang, text] = line.split("\t");
  if (lang === "eng") {
    addPhrase(eng_phrases, Number(id), text);
  } else if (lang === "deu") {
    addPhrase(deu_phrases, Number(id), text);
  }
}

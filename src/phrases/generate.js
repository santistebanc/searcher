const fs = require("fs");
const es = require("event-stream");

let lineNr = 0;
const LIMIT = 20000;

const eng_phrases = {};
let phrasesCount = 0;

const deu_phrases = {};

const translations = {};
let translationsCount = 0;

const readStream = fs
  .createReadStream("src/phrases/deu.txt")
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
            .write(JSON.stringify(toArray(eng_phrases))),
          fs
            .createWriteStream("src/phrases/phrases.deu.json")
            .write(JSON.stringify(toArray(deu_phrases))),
          fs
            .createWriteStream("src/phrases/translations.json")
            .write(JSON.stringify(toArray(translations)))
        ]);
      })
  );

function addPhrasePair(eng, deu) {
  const engId = addPhrase(eng_phrases, eng);
  const deuId = addPhrase(deu_phrases, deu);
  addTranslation(translations, engId, deuId);
}

function addPhrase(phrases, text) {
  if (phrases[text]) {
    return phrases[text].id;
  } else {
    phrasesCount++;
    phrases[text] = {
      id: phrasesCount,
      text
    };
    return phrasesCount;
  }
}

function addTranslation(translations, eng, deu) {
  let id;
  if (translations[`${eng}-${deu}`]) {
    id = translations[`${eng}-${deu}`].id;
  } else if (translations[`${deu}-${eng}`]) {
    id = translations[`${deu}-${eng}`];
  } else {
    translationsCount++;
    translations[`${eng}-${deu}`] = {
      id: translationsCount,
      eng,
      deu
    };
    id = translationsCount;
  }
  return id;
}

function parseLine(line) {
  const [eng, deu] = line.split("\t");
  addPhrasePair(eng, deu);
}

function toArray(obj) {
  return Object.values(obj);
}

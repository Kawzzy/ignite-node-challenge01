import fs from "node:fs";
import { parse } from "csv-parse";

// get the file's path
const filePath = import.meta.url;
const csvPath = new URL("../../tasks.csv", filePath);

// reads the file
const readFile = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ",", // delimites each field
  from_line: 2, // starts reading from the 2nd line
  skipEmptyLines: true,
  trim: true,
});

async function readAndSaveTasks() {
  const lines = readFile.pipe(csvParse);

  for await (const line of lines) {
    const [title, description] = line;

    await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
  }
}

readAndSaveTasks();

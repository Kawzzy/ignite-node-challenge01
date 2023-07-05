import http from "node:http";
import { Database } from "./database.js";

const port = 3000;
const host = "localhost";

const database = new Database();

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (url && url === "/tasks") {
    if (method === "GET") {
      const data = database.select("tasks");

      return data;
    }

    // if (method === "POST") {
    //   // const { titulo, descricao, isConcluida } = req.body;
    //   let body = [];
    //   req
    //     .on("data", (chunk) => {
    //       body.push(chunk);
    //     })
    //     .on("end", () => {
    //       body = Buffer.concat(body).toString();
    //     });

    //   console.log("body", body);
    //   // console.log(titulo, descricao, isConcluida);
    //   database.insert("tasks" /*, data */);
    // }
  } else {
    res.end("URL não encontrada").statusCode(404);
  }
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

import http from "node:http";
import { Database } from "./database.js";

const port = 3000;
const host = "localhost";

const database = new Database();

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (url && url === "/tasks") {
    if (method === "GET") {
      const tasks = database.select("tasks");

      return res.writeHead(200).end(JSON.stringify(tasks));
    }

    if (method === "POST") {
      let body = [];

      req
        .on("data", (chunk) => {
          body.push(chunk);
        })
        .on("end", () => {
          body = JSON.parse(Buffer.concat(body).toString());

          const { title, description, isDone } = body;

          const task = {
            id: 2,
            title,
            description,
            isDone,
          };

          const data = database.insert("tasks", task);
          res.writeHead(200).end(`Task: ${data.title} registrada com sucesso`);
        });
    }
  } else {
    res.end("URL não encontrada").statusCode(404);
  }
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

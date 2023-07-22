import http from "node:http";
import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { convertDataToJson } from "./middlewares/convertDataToJson.js";

const port = 3000;
const host = "localhost";

const database = new Database();

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await convertDataToJson(req, res);

  if (url && url === "/tasks") {
    if (method === "GET") {
      const tasks = database.select("tasks");

      return res.writeHead(200).end(JSON.stringify(tasks));
    }

    if (method === "POST") {
      const { title, description, isDone } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        isDone,
      };

      const data = database.insert("tasks", task);
      res.writeHead(200).end(`Task: ${data.title} registrada com sucesso`);
    }
  } else {
    res.statusCode(404).end("URL não encontrada");
  }
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

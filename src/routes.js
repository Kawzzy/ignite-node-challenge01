import { Database } from "./database.js";
import { randomUUID } from "node:crypto";

const database = new Database();

export const routes = [
  {
    method: "GET",
    url: "/tasks",
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    url: "/tasks",
    handler: (req, res) => {
      const { title, description, isDone } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        isDone,
      };

      const data = database.insert("tasks", task);
      res.writeHead(200).end(`Task: ${data.title} registrada com sucesso`);
    },
  },
];

import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    url: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.selectUnique("tasks", id);

      return res.writeHead(200).end(JSON.stringify(task));
    },
  },
  {
    method: "GET",
    url: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    url: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description, isDone } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        isDone,
      };

      const data = database.insert("tasks", task);
      res.writeHead(200).end(`Task: ${data.title} registrada com sucesso.`);
    },
  },
  {
    method: "PUT",
    url: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description, isDone } = req.body;

      const data = database.update("tasks", id, {
        title,
        description,
        isDone,
      });

      res.writeHead(204).end(`Task: ${data.title} foi atualizada com sucesso.`);
    },
  },
  {
    method: "DELETE",
    url: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id);

      res.writeHead(204).end(`Task: ${id} foi excluída com sucesso.`);
    },
  },
  {
    method: "PATCH",
    url: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.selectUnique("tasks", id);

      if (!task.isDone) {
        task.isDone = true;

        const data = database.update("tasks", id, task);

        return res.writeHead(200).end(`Task: ${data.title} foi finalizada.`);
      }

      return res.writeHead(200).end(`Task: ${task.title} já está finalizada.`);
    },
  },
];

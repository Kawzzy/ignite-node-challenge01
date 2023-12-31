import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

function validateNull(res, title, description) {
  if (title == null) {
    res.writeHead(409).end("Informe um título.");
  }

  if (description == null) {
    res.writeHead(409).end("Informe uma descrição.");
  }
}

function getTask(res, id) {
  const task = database.selectUnique("tasks", id);

  if (!task) {
    res.writeHead(404).end(`Task com id: ${id} não existe.`);
  }

  return task;
}

export const routes = [
  {
    method: "GET",
    url: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = getTask(res, id);

      res.writeHead(200).end(JSON.stringify(task));
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
      const { title, description } = req.body;

      validateNull(res, title, description);

      const task = {
        id: randomUUID(),
        title,
        description,
      };

      const data = database.insert("tasks", task);
      res
        .writeHead(200)
        .end(`Task: ${data.title} com id: ${data.id} registrada com sucesso.`);
    },
  },
  {
    method: "PUT",
    url: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      let task = getTask(res, id);

      const { title, description } = req.body;

      validateNull(res, title, description);

      if (task.completed_at === null) {
        const updatedAttributes = {
          title,
          description,
        };

        task = { ...task, ...updatedAttributes };

        const data = database.update("tasks", id, task);

        res
          .writeHead(204)
          .end(`Task: ${data.title} foi atualizada com sucesso.`);
      } else {
        res
          .writeHead(406)
          .end(
            `Não é possível fazer update em uma task que já está marcada como completa.`
          );
      }
    },
  },
  {
    method: "DELETE",
    url: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = getTask(res, id);

      if (task) {
        database.delete("tasks", id);
      }

      res.writeHead(200).end(`Task: ${id} foi excluída com sucesso.`);
    },
  },
  {
    method: "PATCH",
    url: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = getTask(res, id);

      if (!task.completed_at) {
        const data = database.update("tasks", id, task, true);

        return res.writeHead(200).end(`Task: ${data.title} foi finalizada.`);
      }

      return res.writeHead(200).end(`Task: ${task.title} já está finalizada.`);
    },
  },
];

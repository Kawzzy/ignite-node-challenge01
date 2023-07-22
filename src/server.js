import http from "node:http";
import { convertDataToJson } from "./middlewares/convertDataToJson.js";
import { routes } from "./routes.js";

const port = 3000;
const host = "localhost";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await convertDataToJson(req, res);

  const route = routes.find(
    (route) => route.method === method && route.url === url
  );

  if (route) {
    return route.handler(req, res);
  } else {
    res.writeHead(404).end("URL não encontrada");
  }
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

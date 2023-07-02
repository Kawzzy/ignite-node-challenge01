import http from "node:http";

const port = 3333;
const host = "localhost";

const server = http.createServer((req, res) => {
  res.end("Node server");
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});

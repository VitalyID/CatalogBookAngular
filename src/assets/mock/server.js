const http = require("http");
const server = http
  .createServer(function (request, response) {
    console.log("method", request.method);
    console.log("url", request.url);
    console.log("user-agnt", request.headers["user-agent"]);
    console.log("All headers");
    console.log(request.headers);

    response.write("Text 1\n");
    response.end("sfbff");
  })
  .listen(3000, () => {
    console.log("sever started on port 3000");
  });

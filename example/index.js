import app from "./server";

const port = 3000;
app.listen(port, () => {
  console.log(`LightServerJs running at http://localhost:${port}`);
});

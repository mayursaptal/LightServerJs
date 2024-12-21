import app from "lightserverjs";

const port = 3000;
app.listen(port, () => {
  console.log(`LightServerJs running at http://localhost:${port}`);
});

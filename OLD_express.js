const express = require('express');
const app = express();

app.get('/', (req, res) => {
  // This is where we deal with each request
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});

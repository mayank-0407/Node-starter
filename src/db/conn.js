const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/startingtemplate", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
  })
  .then(() => {
    console.log(`Connected to DB`);
  })
  .catch((e) => {
    console.log(`Unable to Connect to DB`);
  })
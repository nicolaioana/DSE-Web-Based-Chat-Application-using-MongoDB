
const express = require('express');

//const app = express();
var app = express(); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
var cors = require('cors');
app.use(cors());
//bring in the routes
app.use("/user", require("./routes/user"));
app.use("/chatroom", require("./routes/chatroom"));

//setup cros origin
//app.use(require('cors')());

// setup error handler 
const errorHandlers = require("./handlers/errorHandlers");
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if(process.env.ENV === "DEVELOPMENT"){
    app.use(errorHandlers.developmentErrors)
} else {
    app.use(errorHandlers.productionErrors);
}

module.exports = app;
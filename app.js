const express = require('express');
const bodyParser = require('body-parser');

/* a function for when express requires a middleware 
function takes incoming requests and follow them through 
graphql query parser and forward them to right resolvers
*/
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');


const app = express();

//middleware to parses json bodys
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

/*
middleware
one endpoint graphql, not restricted to post.
graphqlHttp from graphQL WIT
GRAPHIQL used to play around with API

*/
app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

//node server
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@bookings-ygbmu.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
)
//mongodb+srv://tommyJackson85:<password>@bookings-ygbmu.mongodb.net/test?retryWrites=true&w=majority
  .then(() => {
    app.listen(8000);
  })
  .catch(err => {
    console.log("MONGO NO WORK!!!!!!!!!!!!!!!!!!")
    console.log(err);
  });

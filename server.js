const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}))
app.listen(4600, () => {
    console.log('The server is up on port 4600');
});
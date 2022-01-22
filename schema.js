const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// Hardcoded data

const customers = [
    {id:'1', name:'Roy Kathurima', email:'kathurima@gmai.com', age:25},
    {id:'2', name:'Roy Murithi', email:'roy@gmai.com', age:27},
    {id:'3', name:'Jason Mraz', email:'mraz@gmai.com', age:23},
]

// Customer Type
const CustomerType = new GraphQLObjectType({
    name: "Customer",
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type:GraphQLString},
        age: {type: GraphQLInt},
    }),
});

const CustomersType = new GraphQLList(CustomerType);

const searchCustomerResolver = (parentVal, args) => {
    return customers.filter(customer => customer.name.toLowerCase().includes(args.keyword.toLowerCase()));
}

// Root Query -> This' a must have
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType', // this is a must
    fields: {
        customerByID: {
            type: CustomerType,
            args: {
                id: {type: GraphQLString}
            },
            resolve(parentValue, args) {
                return customers.filter(customer => customer.id === args.id)[0];
            }
        },
        customerByAge: {
            type: CustomerType,
            args: {
                age: {type: GraphQLInt}
            },
            resolve(parentValue, args) {
                return customers.filter(customer => customer.age === args.age)[0];
            }
        },
        searchCustomer: {
            type: CustomersType,
            args: {
                keyword: {type: GraphQLString}
            },
            resolve: searchCustomerResolver,
        },
        customers: {
            type: CustomersType,
            resolve(){
                return customers;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})

/**
 * 
 * At the heart of a GQL schema is the root query.
 * 
 * The root query has fields
 * The fields have a type and resolvers
 * The types describe the shape of the data
 * The resolvers describe how the data is resolved/fetched.
 */
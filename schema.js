const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const axios = require('axios');

const CUSTOMER_URL = 'http://localhost:3000/customers';

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

const searchCustomerResolver = async (parentVal, args) => {
    const customers = (await axios.get(CUSTOMER_URL)).data;
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
            async resolve(parentValue, args) {
                return (await axios.get(`${CUSTOMER_URL}/${args.id}`)).data;
            }
        },
        customerByAge: {
            type: CustomerType,
            args: {
                age: {type: GraphQLInt}
            },
            async resolve(parentValue, args) {
                const customers = (await axios.get(CUSTOMER_URL)).data;
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
            async resolve(){
                return (await axios.get(CUSTOMER_URL)).data;
            }
        }
    }
});

// Our Root Mutation :)
const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
            },
            async resolve(parentVal, args) {
                return (await axios.post(CUSTOMER_URL, args)).data; 
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})

/**
 * 
 * At the heart of a GQL schema is the root query and mutation.
 * 
 * The root query has fields
 * The fields have a type and resolvers
 * The types describe the shape of the data
 * The resolvers describe how the data is resolved/fetched.
 */
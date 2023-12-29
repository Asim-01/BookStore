module.exports = {
    development: {
        connectionString: 'mongodb://localhost:27017/BookStore',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    },
    production: {

    }
};
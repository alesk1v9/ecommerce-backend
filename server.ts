import express from 'express';
import sequelize from './src/config/connection';
import routes from './src/routes';
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
app.use(routes);

sequelize.sync({ force: false, alter: true }).then(() => { 
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
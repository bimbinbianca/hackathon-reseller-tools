import express from 'express';
import {
    savingBook,
    getaBook,
    getaBookById,
    editBookById,
    deleteBookById
} from './controller.js';

const routes = express.Router();

routes.post('/books', savingBook);
routes.get('/books', getaBook);
routes.get('/books/:bookId', getaBookById);
routes.put('/books/:bookId', editBookById);
routes.delete('/books/:bookId', deleteBookById);

export default routes;

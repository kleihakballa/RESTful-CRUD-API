const express = require('express');
const router = express.Router();

const authorRoutes = require('./authors');
router.use('/authors', authorRoutes);

const bookRoutes = require('./books');
router.use('/books', bookRoutes);

const loansRoutes = require('./loans');
router.use('/loans', loansRoutes);

const memberRoutes = require('./members');
router.use('/members', memberRoutes);

const transactionRouts = require('./transactions');
router.use('/transactions', transactionRouts);

const getBooksApi = require('./apiBooks');
router.use('/apiBooks', getBooksApi);

const loginRouter = require('./authroutes');
router.use('/', loginRouter);

const deleteComment =require('./books');
router.use('/books', deleteComment);

const postComment = require('./books');
router.use('/books', postComment);

const getCommentsApi = require('./books');
router.use('/books', getCommentsApi);

const statsRouter = require('./stats');
router.use('/stat', statsRouter);

const auth = require('./request');
router.use('/auth', auth);

module.exports = router;

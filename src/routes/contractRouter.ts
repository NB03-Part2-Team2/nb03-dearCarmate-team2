import express from 'express'

const contractRouter = express.Router()

contractRouter.route('/')

contractRouter.route('/cars')

contractRouter.route('/customers')

contractRouter.route('/users')

contractRouter.route('/:contractId')
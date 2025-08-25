import express from 'express';

const carRouter = express.Router();

carRouter.route('/').post().get();

carRouter.route('/:carId').get().patch().delete();

carRouter.route('/upload').post();

carRouter.route('/models').get();

export default carRouter;

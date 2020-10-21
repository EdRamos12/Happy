import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import OrphanageView from '../views/orphanages_view';
import * as Yup from 'yup';

export default {
    async create(req: Request, resp: Response) {
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
        } = req.body;
    
        const orphanageRepository = getRepository(Orphanage);

        const requestImages = req.files as Express.Multer.File[];
        console.log(requestImages);
        const images = requestImages.map(image => {
            return {path: image.filename}
        });

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            images
        };

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(Yup.object().shape({
                path: Yup.string().required()
            }))
        });
    
        await schema.validate(data, {
            abortEarly: false,
        })
        const orphanage = orphanageRepository.create(data);
    
        await orphanageRepository.save(orphanage);
    
        return resp.status(201).json(orphanage);
    },

    async index(_: Request, resp: Response) {
        const orphanageRepository = getRepository(Orphanage);

        const orphanages = await orphanageRepository.find({
            relations: ['images']
        });

        return resp.json(OrphanageView.renderMany(orphanages));
    },

    async show(req: Request, resp: Response) {
        const {id} = req.params;

        const orphanageRepository = getRepository(Orphanage);

        const orphanage = await orphanageRepository.findOneOrFail(id, {
            relations: ['images']
        });

        return resp.json(OrphanageView.render(orphanage));
    }
};
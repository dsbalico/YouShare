import { Request, Response } from "express";
import User from "../models/user.model";
import { Op } from "sequelize";
import { rest } from "lodash";
import { validateUser } from "../services/sessions.service";
import Post from "../models/post.model";

async function createUser(req: Request, res: Response): Promise<Response> {
    try {
        const user: User = await User.create(req.body);

        return res.status(201).json({ status: 'success', message: 'User created successfully.', data: user });
    }
    catch (error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

async function readAll(_req: Request, res: Response): Promise<Response> {
    try {
        const users: User[] = await User.findAll({ order: [['createdAt', 'DESC']] });

        const data = {
            users,
            totalUsers: users.length
        }

        return res.status(200).json({ status: 'success', message: 'Users retrieved successfully.', data });
    }
    catch (error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

async function readOne(req: Request, res: Response): Promise<Response> {
    try {
        const user = await User.findOne({ where: req.params, include: Post });

        if (!user) 
            return res.status(404).json({ status: 'failed', message: 'User does not exist.' });

        return res.status(200).json({ status: 'success', message: 'User retrieved successfully.', data: user });
    }
    catch(error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

async function searchUser(req: Request, res: Response): Promise<Response> {
    try {
        const { q: query } = req.query;

        if (!query) 
            return res.status(400).json({ status: 'failed', message: 'Please provide a search query.' });

        const users: User[] = await User.findAll({ where: { 
            [Op.or]: [
                { name: { [Op.like]: `%${query}%` }},
                { username: { [Op.like]: `%${query}%` }},
                { email: { [Op.like]: `%${query}%` }}
            ]
        }});

        return res.status(200).json({ status: 'success', message: 'Users retrieved successfully.', data: users });
    }
    catch (error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

async function updateUser(req: Request, res: Response) {
    try {
        if(req.body.password) {
            if (!req.body.currentPassword) throw new Error('Please provide your current password.');
            
            await validateUser({ credential: req.params.id, password: req.body.currentPassword})
        }

        const { currentPassword, ...updates } = req.body;

        const result = await User.update(updates, {
            where: req.params, individualHooks: true, returning: true
        });
        
        const updatedUser = result[1][0].dataValues;

        if(result[0] < 1) throw new Error('Failed to update user.');

        return res.status(200).json({ status: 'success', message: 'User updated successfully.', data: updatedUser });
    }
    catch(error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

async function deleteUser(req: Request, res: Response): Promise<Response> {
    try {
        const destroyedUser = await User.destroy({ where: req.params });

        if(destroyedUser < 1)
            return res.status(404).json({ status: 'failed', message: 'User to deleted not found.' });

        return res.status(200).json({ status: 'success', message: 'User deleted successfully.' });
    }
    catch(error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

export { createUser, readAll, readOne, searchUser, updateUser, deleteUser };


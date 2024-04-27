import { Request, Response } from "express";

import Post from "../models/post.model";
import User from "../models/user.model";

async function createPost(req: Request, res: Response): Promise<Response> {
    try {
        const userId = res.locals.user.userData.id;

        const { title, content } = req.body;

        const post: Post = await Post.create({ userId, title, content });

        return res.status(201).json({ status: 'success', message: "Post created successfully", data: post })
    }
    catch(error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

async function readAll(_req: Request, res: Response): Promise<Response> {
    try {
        const posts: Post[] = await Post.findAll({ order: [['createdAt', 'DESC']], include: { model: User, attributes: { exclude: ['password'] } }}); 

        const data = {
            posts,
            totalPosts: posts.length
        }

        return res.status(200).json({ status: 'success', message: "Posts retrieved successfully", data })
    }
    catch(error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

async function readUserPosts(req: Request, res: Response): Promise<Response> {
    try {
        const posts: Post[] = await Post.findAll({ order: [['createdAt', 'DESC']], where: { userId: req.params.id} });

        const data = {
            posts,
            totalPosts: posts.length
        }

        return res.status(200).json({ status: 'success', message: "User posts retrieved successfully", data })
    }
    catch(error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

async function updatePost(req: Request, res: Response): Promise<Response> {
    try {
        const updatedPost = await Post.update({ ...req.body }, {
            where: req.params
        });

        if(updatedPost[0] < 1)
            return res.status(404).json({ status: 'failed', message: 'Post to update not found.'});

        return res.status(200).json({ status: 'success', message: "Post updated successfully" })
    }
    catch(error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

async function deletePost(req: Request, res: Response): Promise<Response> {
    try {
        const destroyedPost = await Post.destroy({ where: req.params });

        if(destroyedPost < 1)
            return res.status(404).json({ status: 'failed', message: 'Post to delete not found.'});

        return res.status(200).json({ status: 'success', message: 'Post deleted successfully.' });
    }
    catch(error: any) {
        return res.status(500).json({ status: 'failed', message: error.message });
    }
}

export { createPost, readAll, readUserPosts, deletePost, updatePost }
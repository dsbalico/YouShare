import { Router } from 'express';
import * as PostsController from '../controllers/posts.controller';
import requireUser from '../middlewares/requireUser';

const postsRoute: Router = Router();

postsRoute.post('/', requireUser, PostsController.createPost);

postsRoute.get('/', PostsController.readAll);
postsRoute.get('/users/:id', PostsController.readUserPosts);

postsRoute.patch('/:id', requireUser, PostsController.updatePost);

postsRoute.delete('/:id', requireUser, PostsController.deletePost);

export default postsRoute;
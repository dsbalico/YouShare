import { Router } from 'express';
import * as UsersController from '../controllers/users.controller';

const usersRoute: Router = Router();

usersRoute.post('/', UsersController.createUser);

usersRoute.get('/', UsersController.readAll);
usersRoute.get('/search', UsersController.searchUser);
usersRoute.get('/:username', UsersController.readOne);

usersRoute.patch('/:id', UsersController.updateUser);

usersRoute.delete('/:id', UsersController.deleteUser);

export default usersRoute;
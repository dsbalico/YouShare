import { Express } from "express";

import usersRoute from "./routes/users.route";
import sessionsRoute from "./routes/sessions.route";
import postsRoute from "./routes/posts.route";
import googleRoute from "./routes/google.route";

function registeredRoutes(app: Express): void {
    app.use("/users", usersRoute);
    app.use("/sessions", sessionsRoute);
    app.use('/posts', postsRoute);
    app.use('/google', googleRoute)
}

export default registeredRoutes;
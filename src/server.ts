import App from "./app";
import PostRoute from "./routes/post.routes";
import UserRoute from "./routes/user.routes";

const app = new App([new UserRoute(), new PostRoute()]);

app.listen();

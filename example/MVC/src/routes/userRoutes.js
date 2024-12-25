import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

// Define user-related routes
const userRoutes = [
  {
    method: "get",
    path: "/users",
    handler: getUsers,
    middlewares: [],
  },
  {
    method: "get",
    path: "/users/:id",
    handler: getUserById,
    middlewares: [],
  },
  {
    method: "post",
    path: "/users",
    handler: createUser,
    middlewares: [authMiddleware],
  },
  {
    method: "put",
    path: "/users/:id",
    handler: updateUser,
    middlewares: [authMiddleware],
  },
  {
    method: "delete",
    path: "/users/:id",
    handler: deleteUser,
    middlewares: [authMiddleware],
  },
];

export default userRoutes;

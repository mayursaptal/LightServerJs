// Hardcoded users
const users = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Doe", email: "jane@example.com" },
];

// Controller to get all users
export const getUsers = (req, res, next) => {
  res.writeHead(200);
  res.end(JSON.stringify(users));
};

// Controller to get a specific user by ID
export const getUserById = (req, res, next) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "User not found" }));
    return;
  }
  res.writeHead(200);
  res.end(JSON.stringify(user));
};

// Controller to create a new user
export const createUser = async (req, res, next) => {
  try {
    // Read and parse the request body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString());

    const { name, email } = body;
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
    };

    users.push(newUser);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newUser));
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid JSON input" }));
  }
};

// Controller to update an existing user
export const updateUser = async (req, res, next) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "User not found" }));
    return;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = JSON.parse(Buffer.concat(chunks).toString());

  const { name, email } = body;
  user.name = name;
  user.email = email;
  res.writeHead(200);
  res.end(JSON.stringify(user));
};

// Controller to delete a user
export const deleteUser = (req, res, next) => {
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "User not found" }));
    return;
  }
  users.splice(index, 1);
  res.writeHead(204);
  res.end();
};

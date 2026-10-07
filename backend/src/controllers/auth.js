import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function login(req, res) {
  const { email, password } = req.body || {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password ||
    Buffer.byteLength(password) > 72
  ) {
    return res.status(400).json({ message: "Informe email e senha validos." });
  }

  const [rows] = await req.app.locals.db.execute(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = ?",
    [email.trim().toLowerCase()]
  );
  const user = rows[0];


  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: "Email ou senha incorretos." });
  }
  req.clearLoginAttempts?.();

  
  const token = jwt.sign(
    { role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { subject: String(user.id), expiresIn: "1h", algorithm: "HS256" }
  );

  
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
}

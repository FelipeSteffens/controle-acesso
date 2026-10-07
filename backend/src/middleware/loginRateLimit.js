export function loginRateLimit(maxAttempts = 5, windowMs = 1 * 60 * 1000) {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || "desconhecido";
    const now = Date.now();
    let current = attempts.get(key);
    if (current && current.resetAt <= now) {
      attempts.delete(key);
      current = undefined;
    }
    if (current?.count >= maxAttempts) {
      res.set("Retry-After", String(Math.ceil((current.resetAt - now) / 1000)));
      return res.status(429).json({
        message: "Limite de tentativas de login atingido.",
        retryAt: new Date(current.resetAt).toISOString(),
      });
    }
    if (!current) current = { count: 0, resetAt: now + windowMs };
    current.count += 1;
    attempts.set(key, current);
    req.clearLoginAttempts = () => attempts.delete(key);
    next();
  };
}

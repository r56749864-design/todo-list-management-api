const crypto = require("crypto");

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const validApiKey = process.env.EXTERNAL_API_KEY;

  if (!apiKey || !validApiKey) {
    return res.status(401).json({
      success: false,
      message: "API Key diperlukan.",
    });
  }

  const providedKey = Buffer.from(apiKey);
  const expectedKey = Buffer.from(validApiKey);

  if (
    providedKey.length !== expectedKey.length ||
    !crypto.timingSafeEqual(providedKey, expectedKey)
  ) {
    return res.status(401).json({
      success: false,
      message: "API Key tidak valid.",
    });
  }

  next();
};

module.exports = apiKeyMiddleware;


const crypto = require("crypto");

const isValidApiKey = (providedKey, expectedKey) => {
  if (
    typeof providedKey !== "string" ||
    typeof expectedKey !== "string" ||
    !providedKey ||
    !expectedKey
  ) {
    return false;
  }

  const providedBuffer = Buffer.from(providedKey, "utf8");
  const expectedBuffer = Buffer.from(expectedKey, "utf8");

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
};

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (typeof apiKey !== "string" || !apiKey) {
    return res.status(401).json({
      success: false,
      message: "API Key diperlukan.",
    });
  }

  const productionKey = process.env.EXTERNAL_API_KEY;
  const demoKey = process.env.DEMO_API_KEY;

  const isProductionKeyValid = isValidApiKey(
    apiKey,
    productionKey
  );

  const isDemoKeyValid = isValidApiKey(
    apiKey,
    demoKey
  );

  if (!isProductionKeyValid && !isDemoKeyValid) {
    return res.status(401).json({
      success: false,
      message: "API Key tidak valid.",
    });
  }

  next();
};

module.exports = apiKeyMiddleware;

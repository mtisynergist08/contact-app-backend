/** @format */

import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";

// export const authMiddleware = async (req, res, next) => {
//   const token = req.get("Authorization", "").replace("Bearer ", "").trim();
//   if (!token) {
//     return res.status(401).json({ errors: "Unauthorized" }).end();
//   } else {
//     const user = await prismaClient.user.findFirst({
//       where: {
//         token: token,
//       },
//     });

//     if (!user) {
//       return res.status(401).json({ errors: "Unauthorized" }).end();
//     } else {
//       req.user = user;
//       next();
//     }
//   }
// };

export const authMiddleware = async (req, res, next) => {
  const token = req.get("Authorization", "").replace("Bearer ", "").trim();
  if (!token) {
    return res.status(401).json({ errors: "Token is missing" }).end();
  }

  const user = await prismaClient.user.findFirst({
    where: {
      token: token,
    },
  });

  if (!user) {
    return res.status(401).json({ errors: "Invalid token" }).end();
  }

  req.user = user;
  logger.info(req.user);
  next();
};

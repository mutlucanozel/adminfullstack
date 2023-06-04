import Admin from "../models/authModel.js";
import jwt from "jsonwebtoken";

export const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      "mcanzely",
      async (err, decodedToken) => {
        if (err) {
          res.json({ status: false });
          next();
        } else {
          const admin = await Admin.findById(decodedToken.id);
          if (admin) res.json({ status: true, admin: admin.email });
          else res.json({ status: false });
          next();
        }
      }
    );
  } else {
    res.json({ status: false });
    next();
  }
};

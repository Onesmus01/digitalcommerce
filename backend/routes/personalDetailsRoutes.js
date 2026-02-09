import express from "express";
import {
  upsertPersonalDetails,
  getPersonalDetails,
} from "../controller/personalDetailsController.js";
import authToken from "../middleware/authToken.js";

const personalDetailsRouter = express.Router();

personalDetailsRouter.post("/add-personal-details", authToken, upsertPersonalDetails);
personalDetailsRouter.get("/get-personal-details", authToken, getPersonalDetails);

export default personalDetailsRouter;
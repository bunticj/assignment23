import jwt from "jsonwebtoken";
import { Constants } from "../Constants";
import EnvConfigVars from "./EnvConfigVars";
class JwtToken {
    public signJwtToken(test = { key: "value" }) {
        const payload = test; // TODO LATER
        return jwt.sign(payload, EnvConfigVars.SECRET_KEY, { expiresIn: Constants.SERVER_TOKEN_DURATION });
    }
}
export const jwtToken = new JwtToken()

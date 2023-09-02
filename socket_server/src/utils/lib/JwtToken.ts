import jwt from "jsonwebtoken";
import { Constants } from "../Constants";
import EnvConfigVars from "./EnvConfigVars";
class JwtToken {

    private readonly tokenAudience: string = "php-srvr";
    private readonly tokenIssuer: string = "sckt-srvr";
    public signJwtToken() {
        const iss = this.tokenIssuer;
        const aud = this.tokenAudience;
        const iat = Date.now() / 1000;
        return jwt.sign(
            { iss, iat, aud }, EnvConfigVars.SECRET_KEY, { expiresIn: Constants.SERVER_TOKEN_DURATION });
    }
}
export const jwtToken = new JwtToken()

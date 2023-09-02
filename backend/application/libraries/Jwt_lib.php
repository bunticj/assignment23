<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Jwt_lib
{
    private $jwt_secret = "t32ads90_78-fda8?f09dfa89dfadfle";
    private $php_server_issuer = "php-srvr";
    private $socket_server_issuer = "sckt-srvr";

    public function __construct()
    {
        // todo -> hide secret somewhere
    }

    private function jwt_encode_data($data)
    {
        $time_now = time();
        $token = array(
            //Adding the identifier to the token (who issue the token)
            //audience
            "iss" => $this->php_server_issuer,
            "aud" =>  $this->php_server_issuer,
            "iat" => $time_now,
            "exp" => $time_now + 3600,
            "data" => $data
        );

        $jwt = JWT::encode($token, $this->jwt_secret, 'HS256');
        return $jwt;
    }

    private function jwt_decode_data($jwt_token)
    {
        try {
            $decoded = JWT::decode($jwt_token, new Key($this->jwt_secret, 'HS256'));
            return $decoded;
        } catch (Exception $e) {
            $err_msg = $e->getMessage();
            return null;
        }
    }

    public function handle_authorization($token)
    {   
        if ($token) {
            $payload = $this->jwt_decode_data($token);
            if ($payload) {
                if ($payload->iss !== $this->socket_server_issuer && $payload->iss !== $this->php_server_issuer) return null;
                else return $payload;
            }
        }
        return null;
    }

    public function sign_token($user_id, $email)
    {
        $data = array(
            "user_id" => $user_id,
            "email" => $email
        );
        $token = $this->jwt_encode_data($data);
        return $token;
    }
}

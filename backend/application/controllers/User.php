<?php
class User extends CI_Controller
{
    private  $jwt;
    public function __construct()
    {
        parent::__construct();
        $this->load->model('User_model');
        $this->load->library('Jwt_lib');
        $this->jwt = new Jwt_lib();
    }

    private function validateUserBody($json_data, $isLogin)
    {
        if (!isset($json_data['password']) || empty($json_data['password'])) {
            return 'Invalid password';
        }
        if (!isset($json_data['email']) || empty($json_data['email'])) {
            return 'Invalid email';
        }
        if (!$isLogin) {
            if (!isset($json_data['full_name']) || empty($json_data['full_name'])) {
                return 'Invalid full name';
            }
        }
        return 'Success';
    }

    public function login()
    {
        $raw_input = file_get_contents('php://input');
        $json_data = json_decode($raw_input, true);
        $message = $this->validateUserBody($json_data, true);
        $status_code = 401;
        $status_message = 'Unauthorized';
        $response = array('error' => $message);

        if ($message === 'Success') {
            $user = $this->User_model->get_user_by_email($json_data['email']);
            if ($user && password_verify($json_data['password'], $user->password)) {
                $token =  $this->jwt->sign_token($user->user_id, $user->email);
                $response = array('message' => $message, 'token' => $token);
                $status_code = 200;
                $status_message = 'OK';
            }
        }
        $this->output
            ->set_content_type('application/json')
            ->set_status_header($status_code, $status_message)
            ->set_output(json_encode($response));
    }

    public function register()
    {
        $raw_input = file_get_contents('php://input');
        $json_data = json_decode($raw_input, true);
        $message = $this->validateUserBody($json_data, false);

        $status_code = 401;
        $status_message = 'Unauthorized';
        $response = array('error' => $message);

        if ($message === 'Success') {
            $exist = $this->User_model->get_user_by_email($json_data['email']);
            if (!$exist) {
                $hashed_pass =  password_hash($json_data['password'], PASSWORD_BCRYPT);
                $user_id = $this->User_model->insert_user($json_data, $hashed_pass);
                // todo generate token
                if ($user_id) {
                    $token =  $this->jwt->sign_token($user_id, $json_data['email']);
                    $response = array('message' => $message, 'token' => $token);
                    $status_code = 200;
                    $status_message = 'OK';
                }
            }
        }
        $this->output
            ->set_content_type('application/json')
            ->set_status_header($status_code, $status_message)
            ->set_output(json_encode($response));
    }

    public function me()
    {
        $request_headers = $this->input->request_headers();
        $token =  $request_headers['Authorization'];
        $payload = $this->jwt->handle_authorization($token);
        $user = 0;
        if ($payload) {
            $user = $this->User_model->get_user_by_id($payload->data->user_id);
        }
        if ($user) {
            $response = array('user_id' => $user->user_id, 'email' => $user->email);
            $status_code = 200;
            $status_message = 'OK';
        } else {
            $status_code = 401;
            $status_message = 'Unauthorized';
            $response = array('error' => 'Authentication failed');
        }
        $this->output
            ->set_content_type('application/json')
            ->set_status_header($status_code, $status_message)
            ->set_output(json_encode($response));
    }
}

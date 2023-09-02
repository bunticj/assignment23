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

    private function bodyHasErrors($json_data, $isLogin)
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
        return null;
    }

    public function login()
    {
        $raw_input = file_get_contents('php://input');
        $json_data = json_decode($raw_input, true);
        $err_message = $this->bodyHasErrors($json_data, true);
        $isValid = false;
        if (!$err_message) {
            $user = $this->User_model->get_user_by_email($json_data['email']);
            if ($user && password_verify($json_data['password'], $user->password)) {
                $token =  $this->jwt->sign_token($user->user_id, $user->email);
                $response = array('token' => $token);
                $status_code = 200;
                $status_message = 'OK';
                $isValid = true;
            }
        }

        if (!$isValid) {
            $status_code = 401;
            $status_message = 'Unauthorized';
            $response = array('error' => $status_message);
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
        $err_message = $this->bodyHasErrors($json_data, false);
        $isValid = false;
        if (!$err_message) {
            $exist = $this->User_model->get_user_by_email($json_data['email']);
            if (!$exist) {
                $hashed_pass =  password_hash($json_data['password'], PASSWORD_BCRYPT);
                $user_id = $this->User_model->insert_user($json_data, $hashed_pass);
                if ($user_id) {
                    $token =  $this->jwt->sign_token($user_id, $json_data['email']);
                    $response = array('token' => $token);
                    $status_code = 200;
                    $status_message = 'OK';
                    $isValid = true;
                }
            }
        }

        if (!$isValid) {
            $status_code = 401;
            $status_message = 'Unauthorized';
            $response = array('error' => $status_message);
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
        $isValid = false;
        if ($payload) {
            $user = $this->User_model->get_user_by_id($payload->data->user_id);
            if ($user) {
                $response = array('user_id' => $user->user_id, 'email' => $user->email);
                $status_code = 200;
                $status_message = 'OK';
                $isValid = true;
            }
        }
        if (!$isValid) {
            $status_code = 401;
            $status_message = 'Unauthorized';
            $response = array('error' => status_message);
        }
        $this->output
            ->set_content_type('application/json')
            ->set_status_header($status_code, $status_message)
            ->set_output(json_encode($response));
    }
}

<?php
defined('BASEPATH') or exit('No direct script access allowed');

class User extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('User_model');
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
        if ($message === 'Success') {
            $user = $this->User_model->get_user_by_email($json_data['email']);
            if ($user && password_verify($json_data['password'], $user->password)) {
                $response = array('message' => $message, 'token' => 'Some generated token which will be able to identify us');
                $this->output
                    ->set_content_type('application/json')
                    ->set_status_header(200, 'OK')
                    ->set_output(json_encode($response));
                return;
            }
        }
        $response = array('error' => "Unauthorized");
        $this->output
            ->set_content_type('application/json')
            ->set_status_header(401, "Unauthorized")
            ->set_output(json_encode($response));
    }

    public function register()
    {
        $raw_input = file_get_contents('php://input');
        $json_data = json_decode($raw_input, true);
        //should extract playerid from header
        //$input_header = $this->input->request_headers();
        //$stringified = json_encode($input_header);
        //printf($stringified);
        $message = $this->validateUserBody($json_data, false);
        if ($message === 'Success') {
            $exist = $this->User_model->get_user_by_email($json_data['email']);
            if (!$exist) {
                $hashed_pass =  password_hash($json_data['password'], PASSWORD_BCRYPT);
                $data = $this->User_model->insert_user($json_data, $hashed_pass);
                // todo generate token
                $response = array('message' => $message, 'token' => 'Some generated token which will be able to identify us');
                $status_code = 200;
                $status_message = 'OK';
                $this->output
                    ->set_content_type('application/json')
                    ->set_status_header($status_code, $status_message)
                    ->set_output(json_encode($response));
                return;
            } else $message = 'User exists';
        }
        $response = array('error' => $message);

        $this->output
            ->set_content_type('application/json')
            ->set_status_header(401, 'Unauthorized')
            ->set_output(json_encode($response));
    }

    public function me()
    {
        $input_header = $this->input->request_headers();
        $authToken = $input_header['Authorization'];
        // decode token and get id
        // for test, set id as token
        $user_id= $authToken;
        $user = $this->User_model->get_user_by_id($user_id);
        if ($user) {
            $response = array('user_id' => $user_id, 'email' => $user->email);
            $status_code = 200;
            $status_message = 'OK';
            $this->output
                ->set_content_type('application/json')
                ->set_status_header($status_code, $status_message)
                ->set_output(json_encode($response));
            return;
        } else $message = 'Authentication failed';

        $response = array('error' => $message);

        $this->output
            ->set_content_type('application/json')
            ->set_status_header(401, 'Unauthorized')
            ->set_output(json_encode($response));
    }
}

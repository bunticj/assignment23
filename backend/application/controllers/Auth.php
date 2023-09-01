<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Auth extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
        $this->load->library('form_validation');
    }

    public function login()
    {
        log_message('info', 'Received message, bla bla ');

        $raw_input = file_get_contents('php://input');
        $json_data = json_decode($raw_input, true);
        log_message('info', 'Received JSON data: ' . print_r($json_data, true));

        $this->form_validation->set_rules('email', 'email', 'required|valid_email');
        $this->form_validation->set_rules('password', 'password', 'required');
        log_message('debug', 'This is an error message.');
        if ($this->form_validation->run() === false) {
            $response = array('error' => validation_errors());
        } else {
            $user = $this->user_model->get_user_by_email($json_data['email']);

            if ($user && password_verify($json_data['password'], $user->password)) {
                $response = array('message' => 'Login successful');
            } else {
                $response = array('error' => 'Invalid credentials');
            }
        }

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($response));
    }
}

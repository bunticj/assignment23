<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Auth extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
        $this->load->library('form_validation');
        //     $this->load->library('input');

    }

    public function login()
    {
        /*
        $raw_input = file_get_contents('php://input');
        $json_data = json_decode($raw_input, true);

        $this->form_validation->set_rules('email', 'email', 'required');
        $this->form_validation->set_rules('password', 'password', 'required');
        if ($this->form_validation->run() === false) {
            $response = array('error' => validation_errors());
        } else {
            $user = $this->user_model->get_user_by_email($json_data['email']);

            if ($user && password_verify($json_data['password'], $user->password)) {
                $response = array('message' => 'Login successful', 'token' => 'Some generated token which will be able to identify us');
            } else {
                $response = array('error' => 'Invalid credentials');
            }
        }
        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($response));
            */
    }

    public function register()
    {
        $raw_input = file_get_contents('php://input');
        $json_data = json_decode($raw_input, true);
/*
        $this->form_validation->set_rules('name', 'name', 'trim|required');
        $this->form_validation->set_rules('email', 'email', 'trim|required');
        $this->form_validation->set_rules('password', 'password', 'required');
        if ($this->form_validation->run() === false) {
            $response = array('error' => validation_errors());
        } else {
            $user = array('name' => $json_data['name'], 'email' => $json_data['email'], "password" => $json_data['password']);
            $this->user_model->insert_user($json_data);

            if ($user && password_verify($json_data['password'], $user->password)) {
                $response = array('message' => 'Login successful', 'token' => 'Some generated token which will be able to identify us');
            } else {
                $response = array('error' => 'Invalid credentials');
            }

            $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode($response));
        }
        */
    }
}




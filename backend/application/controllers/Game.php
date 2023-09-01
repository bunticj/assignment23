<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Game extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Game_model');
    }



    public function create()
    {
        $raw_input = file_get_contents('php://input');
        $json_data = json_decode($raw_input, true);
        $isValidBody = true;
        //should extract playerid from header
        //$input_header = $this->input->request_headers();
        //$stringified = json_encode($input_header);
        //printf($stringified);
        if (!isset($json_data['player1']) || empty($json_data['player1'])) {
            $isValidBody = false;
            $message = 'Invalid playerId';
        }
        if (!isset($json_data['game_state']) || empty($json_data['game_state'])) {
            $isValidBody = false;
            $message = 'Invalid game state';
        } else if (!is_numeric($json_data['game_state'])) {
            $isValidBody = false;
            $message = 'Invalid game state type';
        }

        if ($isValidBody === true) {
            $data = $this->Game_model->insert_game($json_data);
            $status_code = 200;
            $stringif = json_encode(($data));
            printf($stringif);
            $message = "OK";
            $response = array('message' => 'Login successful', 'token' => 'Some generated token which will be able to identify us');
        } else {
            $response = array('error' => $message);
            $status_code = 400;
        }
        $input_header = $this->input->request_headers();
        $stringified = json_encode($input_header);
        printf($stringified);

        $this->output
            ->set_content_type('application/json')
            ->set_status_header($status_code, $message)
            ->set_output(json_encode($response));
    }

    public function updateGame()
    {
        // Update
        //$value=array('name'=>$name,'email'=>$email);
    }
}

<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Game extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Game_model');
    }

    private function patch_game_data($patch_data)
    {
        $patch_data = json_decode($this->input->raw_input_stream);
        if (!isset($patch_data->game_id)) {
            return null;
        }
        $existing_data = $this->Game_model->get_game_by_game_id($patch_data->game_id);

        if (!$existing_data) {
            return null;
        }

        if (isset($patch_data->game_state) && is_numeric($patch_data->game_state)) {
            $existing_data->game_state = $patch_data->game_state;
        }
        if (isset($patch_data->started_at)) {
            $existing_data->started_at = $patch_data->started_at;
        }
        if (isset($patch_data->finished_at)) {
            $existing_data->finished_at = $patch_data->finished_at;
        }
        if (isset($patch_data->player2) && is_numeric($patch_data->player2)) {
            $existing_data->player2 = $patch_data->player2;
        }
        if (isset($patch_data->winner) && is_numeric($patch_data->winner)) {
            $existing_data->winner = $patch_data->winner;
        }

        return $existing_data;
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

    public function fetch($id)
    {
        //should extract playerid from header
        //$input_header = $this->input->request_headers();
        //$stringified = json_encode($input_header);

        $data = $this->Game_model->get_game_by_game_id($id);
        
        if ($data) {
            $status_code = 200;
            $message = 'OK';
            $response = array('data' => $data);
        } else {
            show_404();
            return;
        }
        $this->output
            ->set_content_type('application/json')
            ->set_status_header($status_code, $message)
            ->set_output(json_encode($response));
    }

    public function update()
    {
        $raw_input = file_get_contents('php://input');
        $json_data = json_decode($raw_input, true);


        $patch_data = $this->patch_game_data($json_data);
        if ($patch_data) {
            $this->Game_model->update_game( $patch_data->game_id,$patch_data);
        } else {
            show_404();
            return;
        }
        $response = array('message' => 'Updated successful');
        $this->output
            ->set_content_type('application/json')
            ->set_status_header(200, "OK")
            ->set_output(json_encode($response));
    }
}

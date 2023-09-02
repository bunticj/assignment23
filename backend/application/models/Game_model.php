<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Game_model extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->load->helper('string');
    }

    public function insert_game($data)
    {
        $counter = 0;
        do {
            $game_id = random_string('alnum', 9);
            $gameExist = $this->get_game_by_game_id($game_id);
            $counter++;
        } while ($gameExist);
        $game = array(
            'game_id' =>  $game_id,
            'player1' => $data['player1'],
            'game_state' => $data['game_state']
        );
        $isSuccess = $this->db->insert('game', $game);
        if ($isSuccess) {
            return  $game_id;
        } else {
            return "";
        }
    }

    public function get_game_by_game_id($gameId)
    {
        $this->db->where('game_id', $gameId);
        return $this->db->get('game')->row();
    }

    public function update_game($gameId, $data)
    {
        $this->db->where('game_id', $gameId);
        return $this->db->update('game', $data);
    }
}

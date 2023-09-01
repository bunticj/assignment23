
<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Game_model extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function insert_game($data)
    {
        return $this->db->insert('game', $data);
    }

    public function get_game_by_gameId($gameId)
    {
        $this->db->where('game_id', $gameId);
        return $this->db->get('game')->row();
    }

    public function update_game($gameId, $data)
    {
        $this->db->where('game_id', $gameId);
        $this->db->update('game', $data);
    }
}

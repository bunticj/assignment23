
<?php
defined('BASEPATH') or exit('No direct script access allowed');

class User_model extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function insert_user($data)
    {
        return $this->db->insert('user', $data);
    }

    public function get_user_by_email($email)
    {
        $this->db->where('email', $email);
        return $this->db->get('user')->row();
    }
}

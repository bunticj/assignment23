
<?php
defined('BASEPATH') or exit('No direct script access allowed');

class User_model extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function insert_user($data, $hashedPassword)
    {
        $data = array(
            'email'    =>   $data['email'],
            'password' => $hashedPassword,
            'full_name' => $data['full_name']
        );
       $isSuccess =  $this->db->insert('user', $data);
       if($isSuccess) return $this->db->insert_id();
    }

    public function get_user_by_email($email)
    {
        $this->db->where('email', $email);
        return $this->db->get('user')->row();
    }

    public function get_user_by_id($id)
    {
        $this->db->where('user_id', $id);
        return $this->db->get('user')->row();
    }
}

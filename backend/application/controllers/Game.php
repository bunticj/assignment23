<?php
$pathToFile = APPPATH . 'libraries/REST_Controller.php';
echo "Path $pathToFile";
require "$pathToFile";
class Auth extends REST_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('game_model');
        $this->load->library('form_validation');
    }

    public function createGame()
    {
        $raw_input = file_get_contents('php://input');
        $json_data = json_decode($raw_input, true);

        $input = $this->input->post();
        printf($input);

        if (empty($json_data->player1) || empty($json_data['game_state'])) {
            $this->response(['Item deleted successfully.'], REST_Controller::HTTP_BAD_REQUEST);
        }
        printf("check will it come here");
        $this->response(['Success.'], REST_Controller::HTTP_OK);
    }

    public function updateGame()
    {

        // Update
        //$value=array('name'=>$name,'email'=>$email);

    }
}

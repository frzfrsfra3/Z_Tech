<?php

namespace App\ApiHelper;

use Illuminate\Support\Facades\Lang;

class ErrorResult
{
    public $isOk = true;

    public $validationMessage;

    public $message = 'Error Message';

    public $result;
    
    public $errorCode;
    public $paginate;

    /**
     * Result constructor.
     *
     * @param  null  $result
     * @param  null  $validationMessage
     * @param  null  $paginate
     */
    public function __construct($result = null, string $message = 'Done', $paginate = null, bool $isOk = true,$errorCode=null)
    {
        $this->isOk = $isOk;
        $this->errorCode=$errorCode;
        $this->message = empty($message) ? Lang::get('Messages.TaskCompleteSuccessfully') : $message;
        $this->result = $result;
        $this->paginate = $paginate;
    }
}

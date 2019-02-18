<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    protected $table = 'scores';

    public function getCreatedAtAttribute( $value ) {
        return (new \Carbon\Carbon($value))->format('Y-m-d H:i');
    }
}

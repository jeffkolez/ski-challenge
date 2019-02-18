<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Library\DataMigration\Importer;
use App\Models\Transaction;

class ScoreController extends Controller
{
    public function add(Request $request)
    {
        if ($request->isMethod('post')) {
            $score = new \App\Score;
            $score->score = $request['data']['score'];
            $score->save();
        }
        
    }

    public function latest()
    {
        return \App\Score::orderBy('created_at', 'desc')
               ->limit(10)
               ->get();
    }

    public function best()
    {
        return \App\Score::orderBy('score', 'desc')
               ->limit(10)
               ->get();
    }

}

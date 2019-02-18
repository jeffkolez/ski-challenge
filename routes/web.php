<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('ski');
});

Route::post('/score', 'ScoreController@add');
Route::get('/score/latest', 'ScoreController@latest');
Route::get('/score/best', 'ScoreController@best');
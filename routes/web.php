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

Route::get('/', "TicketController@index")->name('home');

Route::get('/login', 'SessionController@index')->name('login');

Route::post('/login', 'SessionController@login');

Route::get('/signup', 'SessionController@show_signup');

Route::post('/signup', 'SessionController@signup');

Route::get('/logout','SessionController@destroy');

Route::get('/dashboard', "DashboardController@index")->name('dashboard');

Route::get('/patient', "PatientController@index");

Route::post('/patient', "PatientController@store");

Route::put('/patient/{user}', "PatientController@update");

Route::delete('/patient/{user}', "PatientController@destroy");

Route::get('/doctor', "doctorController@index");

Route::post('/doctor', "doctorController@store");

Route::put('/doctor/{user}', "doctorController@update");

Route::delete('/doctor/{user}', "doctorController@destroy");

Route::get('/agent_detail/{user}', "doctorController@agent_detail");

Route::get('/settings', "SettingsController@index");

Route::get('/settings/change_password', "SettingsController@change_password");

Route::put('/settings/change_password/{user}', "SettingsController@update");

Route::post('/message', "MessageController@store");

Route::put('/message/{message}', "MessageController@update");

Route::get('/ticket/answer/{user}', "TicketController@answer");

Route::get('/ticket/create', "TicketController@create");

Route::post('/ticket/create', "TicketController@store");

Route::get('/ticket/{ticket}', "TicketController@show");

Route::get('/ticket', "TicketController@index")->name('ticket');

Route::post('/ticket', "TicketController@store");

Route::put('/ticket/{ticket}', "TicketController@update");

//dari msoftweb
Route::get('/preview','PreviewController@preview');
Route::get('/preview/data','PreviewController@previewdata');

Route::get('/previewvideo/{id}','PreviewController@previewvideo');

Route::get('/upload','PreviewController@upload');
Route::post('/upload','PreviewController@form');

Route::get('/emergency','EmergencyController@index');


Route::get('/download/{folder}/{image_path}','PreviewController@download');

//change carousel image to small thumbnail size
Route::get('/thumbnail/{folder}/{image_path}','PreviewController@thumbnail');

//appointment

Route::get('/appointment','AppointmentController@show');
Route::get('/appointment/table','AppointmentController@table');
Route::post('/appointment/form','AppointmentController@form');
Route::get('/appointment/getEvent','AppointmentController@getEvent');
Route::post('/appointment/addEvent','AppointmentController@addEvent');
Route::post('/appointment/editEvent','AppointmentController@editEvent');
Route::post('/appointment/delEvent','AppointmentController@delEvent');

//webservice luar
Route::get('/webservice/patmast','WebserviceController@patmast');
Route::get('/webservice/episode','WebserviceController@episode');
Route::get('/webservice/ticket','WebserviceController@ticket');

//util dr msoftweb
Route::get('/util/get_value_default','defaultController@get_value_default')->name('util_val');
Route::get('/util/get_table_default','defaultController@get_table_default')->name('util_tab');



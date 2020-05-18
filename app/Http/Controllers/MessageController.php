<?php

namespace App\Http\Controllers;

use App\message;
use App\ticket;
use App\User;
use App\Mail\Notification;
use Illuminate\Http\Request;
use DB;
use Mail; 
use Auth;

class MessageController extends Controller
{

    public function __construct()
    {
        // $this->middleware('auth');
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        ////validate message
        $validatedData = $request->validate([
            'ticket_id' => 'required',
            'message' => 'required',
        ]);

        ////check message type
        $user = Auth::user();
        $msgType = $user->groupid;
        if(!empty($request->remark)){
            $msgType = 'remark';
        }

        ////determined ticket status
        $ticket_status = $request->status;
        if($ticket_status == 'normal'){
            $ticket_status = ($user->type == 'customer') ? 'Open' : 'Answered';
        }

        ////create new message
        $message = new message;

        $message->ticket_id = $request->ticket_id;
        $message->text = $request->message;
        $message->message_type = $msgType;
        $message->user_id = $user->id;

        $message->save();

        ////update ticket status
        $ticket = ticket::find($request->ticket_id);
        $ticket->status = $ticket_status;
        $ticket->save();

        ////mail notification
        // if($user->type == "agent" && $msgType != 'remark'){
        //     $report_by = User::find($ticket->report_by);
        //     $notify = new Notification($report_by,$request->ticket_id);
        //     Mail::to($report_by)->send($notify);
        // }


        return redirect()->back()->with('data', '#segment_'.$message->id);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\message  $message
     * @return \Illuminate\Http\Response
     */
    public function show(message $message)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\message  $message
     * @return \Illuminate\Http\Response
     */
    public function edit(message $message)
    {
    
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\message  $message
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, message $message)
    {
        $message->text = $request->text;
        $message->updflg = '1';
        $message->save();

        return redirect()->back()->with('data', '#segment_'.$message->id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\message  $message
     * @return \Illuminate\Http\Response
     */
    public function destroy(message $message)
    {
        //
    }
}

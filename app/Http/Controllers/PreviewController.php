<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use stdClass;
use DB;
use Carbon\Carbon;
use Intervention\Image\Facades\Image;
use Response;
use Auth;

class PreviewController extends Controller
{   
    
    public function __construct()
    {

    }

    public function preview(Request $request)
    {   
        $navbar = $this->navbar();
        if(!empty($request->mrn)){
            $user = DB::table('hisdb.pat_mast')->where('mrn','=',$request->mrn)->first();
        }else{
            // $user = DB::table('hisdb.pat_mast')->where('loginid','=',Auth::user()->username)->first();
            $user = DB::table('hisdb.pat_mast')->where('Newic','=',Auth::user()->username)->first();
        }
        // $previews = DB::table('hisdb.patresult')->where('mrn','=',$request->mrn)->get();
        return view('preview',compact('user','navbar'));
    }

    public function previewdata(Request $request)
    {
        $table = DB::table('hisdb.patresult')->where('mrn','=',$request->mrn);

        $responce = new stdClass();
        $responce->rows = $table->get();
        $responce->sql = $table->toSql();
        $responce->sql_bind = $table->getBindings();

        return json_encode($responce);
    }

    public function previewvideo($auditno)
    {   
        $video = DB::table('hisdb.patresult')->where('auditno','=',$auditno)->first();
        return view('previewvideo',compact('video'));
    }

    

    public function uploaddata(Request $request)
    {
        
        $rows = $table->merge($user);



        $responce = new stdClass();
        $responce->rows = $rows;
        $responce->sql = $table->toSql();
        $responce->sql_bind = $table->getBindings();

        return json_encode($responce);
    }


    public function upload(Request $request)
    {   
        // $navbar = $this->navbar();
        $episode = DB::table('hisdb.episode')->select('mrn','reg_date','reg_time')->where('mrn','=',$request->mrn)->where('episno','=',$request->episno)->first();
        $patient = DB::table('hisdb.pat_mast')->select('Name','newic','DOB')->where('mrn','=',$request->mrn)->first();
        $patresult = DB::table('hisdb.patresult')->where('mrn','=',$request->mrn)->get();

        return view('upload',compact('patient','episode','patresult'));
    }

    
    public function thumbnail($folder,$image_path){

        if($folder == 'pat_enq'){ //image
            $img = Image::make('uploads/'.$folder.'/'.$image_path)->resize(96, 96);
        }else if($folder == 'application'){
            switch($image_path){
                case 'pdf': $img = Image::make('uploads/pat_enq/pdf_icon.png')->resize(96, 96); break;
                case 'msword': $img = Image::make('uploads/pat_enq/word_icon.png')->resize(96, 96); break;
            }
        }else if($folder == 'video'){
            switch($image_path){
                case 'video': $img = Image::make('uploads/pat_enq/video-icon.png')->resize(96, 96); break;
            }
        }else if($folder == 'audio'){
            switch($image_path){
                case 'audio': $img = Image::make('uploads/pat_enq/audio-icon.png')->resize(96, 96); break;
            }
        }else{

        }

        return $img->response();
    }

    public function download(Request $request,$folder,$image_path){
        $file = public_path()."\\uploads\\".$folder."\\".$image_path;
        // dump($file);
        return Response::download($file,$request->filename);
    }


    public function form(Request $request)
    {   
        $type = $request->file('file')->getClientMimeType();
        if(!empty($request->rename)){
            $filename = $request->rename;
        }else{
            $filename = $request->file('file')->getClientOriginalName();
        }
        $file_path = $request->file('file')->store('pat_enq', 'public_uploads');
        DB::table('hisdb.patresult')
            ->insert([
                'compcode' => '-',
                'resulttext' => $filename,
                'attachmentfile' => $file_path,
                'adduser' => 'system',
                'adddate' => Carbon::now("Asia/Kuala_Lumpur"),
                'mrn' => $request->mrn,
                'type' => $type,
                'trxdate' => $request->trxdate
            ]);

        return redirect()->back();
    }

}
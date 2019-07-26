<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="/favicon.ico" type="image/x-icon">

        <title>Customer Support</title>

        <link rel="stylesheet" type="text/css" href="{{ asset('assets/Semantic/semantic.min.css') }}">
        <link rel="stylesheet" type="text/css" href="{{ asset('css/main.css') }}">
        <link rel="stylesheet" type="text/css" href="{{ asset('assets/Summernote 0.8.9/summernote-lite.css') }}">

        <style type="text/css">
            .ui.vertical.menu .item>i.icon {
                width: 1.18em !important;
                float: left !important;
                margin: 0 .5em 0 .5em !important;
            }
            body{
                height: auto !important;
            }
            @yield('style')
        </style>

        @yield('css')

    </head>
    <body>
        <input type="hidden" id="util_val" value="{{route('util_val')}}">
        <input type="hidden" id="util_tab" value="{{route('util_tab')}}">
        @if(!Request::is('login'))
            @if(!Request::is('upload'))
                @include('layouts.navs')
            @endif
        @endif
        <div class="pusher container_sem" id="content">
            @yield('content')
        </div>
    </body>  

    <script src="{{ asset('assets/moment.js') }}"></script>
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('assets/Semantic/semantic.min.js') }}"></script>
    <script src="{{ asset('js/utility.js') }}"></script>
    <script src="{{ asset('js/main.js') }}"></script>
    <script src="{{ asset('assets/velocity.min.js') }}"></script>
    <script src="{{ asset('assets/Summernote 0.8.9/summernote-lite.js') }}"></script>

    @yield('js')
</html>
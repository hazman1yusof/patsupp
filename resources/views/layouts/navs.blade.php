<div id="top"></div>
<a href="#top" class="ui circular icon button" id="toTop" data-slide="slide">
    <i class="angle up icon"></i>
</a>
<div class="ui fixed top menu sidemenu">
    <a class="item" id="showSidebar"><i class="sidebar inverted icon"></i></a>
</div>

<div class="ui sidebar inverted vertical menu sidemenu">
    <!-- @foreach($navbar as $item)
        {!!$item->condition2!!}
    @endforeach -->
    @if (Auth::user()->groupid == 'patient')
        <a class="item {{(Request::is('appointment') ? 'active' : '')}}" href="{{url('/appointment')}}"><i style="float: left" class="calendar alternate outline inverted icon big link"></i>Appointment</a>

        <a class="item @if(Request::is('ticket') || Request::is('ticket/*')) {{'active'}} @endif" href="{{ url('/ticket')}}"><i style="float: left" class="comments inverted big link icon"></i>Chat</a>

        <a class="item {{(Request::is('preview') ? 'active' : '')}}" href="{{ url('/preview')}}"><i style="float: left" class="folder open inverted big icon link"></i>Medical Images</a>

    @else
        <a class="item {{(Request::is('appointment') ? 'active' : '')}}" href="{{url('/appointment')}}"><i style="float: left" class="calendar alternate outline inverted icon big link"></i>Appointment</a>

        <a class="item {{(Request::is('emergency') ? 'active' : '')}}" href="{{ url('/emergency')}}"><i style="float: left" class="folder open inverted big icon link"></i>Document Upload</a>

        <a class="item @if(Request::is('ticket') || Request::is('ticket/*')) {{'active'}} @endif" href="{{ url('/ticket')}}"><i style="float: left" class="comments inverted big link icon"></i>Chat</a>
        
    @endif
    <a class="item" href=".\logout"><i style="float: left" class="plug inverted big icon link"></i>Log Out</a>
</div>

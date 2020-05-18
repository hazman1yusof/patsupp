<!DOCTYPE html>
<html>
<head>
	<title>Preview Video</title>
</head>
<body>
	<div class="video-container">
	<video width="100%" autoplay  loop >
		<source src="{{ url('uploads/'.$video->attachmentfile)}}" type="{{$video->type}}">
		Your browser does not support HTML5 video.
	</video>
	</div>

</body>
</html>
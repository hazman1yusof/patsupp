<?php
	$display = (Auth::user()->type=='customer') ? "none":"";
?>

<div class="ui teal segment" style="padding-bottom: 30px;">
	<form method="GET" class="ui form" id="filterForm_basic" action="/ticket" name="ticketSearch" >
		<div class="three fields">
			<div class="field">
				<label>Posted By</label>
				<input type="text" name="title" placeholder="Posted By" value="@if(!empty(Request::input('title'))){{Request::input('title')}}@endif">
			</div>
			<div class="field">
				<label>Question</label>
				<input type="text" name="description" placeholder="Question" value="@if(!empty(Request::input('description'))){{Request::input('description')}}@endif">
			</div>
			<div class="field"><button class="ui teal button " style="margin-left: 0px;margin-top: 22px"> Search Chat </button></div>
		</div>

	</form>
</div>
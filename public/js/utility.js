

///////////////////////start utility function/////////////////////////////////////////////////////////

function addParamField(grid,needRefresh,param,except){
	var temp=[];
	$.each($(grid).jqGrid('getGridParam','colModel'), function( index, value ) {
		if(except!=undefined && except.indexOf(value['name']) === -1){
			temp.push(value['name']);
		}else if(except==undefined){
			temp.push(value['name']);
		}
	});
	param.field=temp;
	if(needRefresh){
		refreshGrid(grid,param);
	}
}

function refreshGrid(grid,urlParam,oper){
	if(oper == 'add'){
		$(grid).jqGrid('setGridParam',{datatype:'json',url:urlParam.url+'?'+$.param(urlParam)}).trigger('reloadGrid', [{page:1}]);
	}else if(oper == 'edit' || oper == 'del'){
		$(grid).jqGrid('setGridParam',{datatype:'json',url:urlParam.url+'?'+$.param(urlParam)}).trigger('reloadGrid', [{current:true}]);
	}else if(oper == 'kosongkan'){
		$(grid).jqGrid('setGridParam',{datatype:'local'}).trigger('reloadGrid');
	}else{
		$(grid).jqGrid('setGridParam',{datatype:'json',url:urlParam.url+'?'+$.param(urlParam)}).trigger('reloadGrid');
	}
}

function populateFormdata(grid,dialog,form,selRowId,state){
	if(!selRowId){
		alert('Please select row');
		return emptyFormdata([],form);
	}
	rowData = $(grid).jqGrid ('getRowData', selRowId);
	$.each(rowData, function( index, value ) {
		var input=$(form+" [name='"+index+"']");
		if(input.is("[type=radio]")){
			$(form+" [name='"+index+"'][value='"+value+"']").prop('checked', true);
		}else{
			input.val(value);
		}
	});
	if(dialog!=''){
		$(dialog).dialog( "open" );	
	}
}

function inputCtrl(dialog,form,oper,butt2){
	switch(oper) {
		case state = 'add':
			$( dialog ).dialog( "option", "title", "Add" );
			enableForm(form);
			rdonly(form);
			break;
		case state = 'edit':
			$( dialog ).dialog( "option", "title", "Edit" );
			enableForm(form);
			frozeOnEdit(form);
			rdonly(form);
			break;
		case state = 'view':
			$( dialog ).dialog( "option", "title", "View" );
			disableForm(form);
			$( dialog ).dialog("option", "buttons",butt2);
			break;
	}
}

function frozeOnEdit(form){
	$(form+' input[frozeOnEdit]').prop("readonly",true);
}

function rdonly(form){
	$(form+' input[rdonly]').prop("readonly",true);
}

function hideOne(form){
	$(form+' [hideOne]').hide();
}

function parent_close_disabled(isClose){
	if (window.frameElement) {
		parent.disableCloseButton(isClose);
	}
}

function parent_change_title(title){
	if (window.frameElement) {
		parent.changeParentTitle(title);
	}
}

function selrowData(grid){
	selrow = $(grid).jqGrid ('getGridParam', 'selrow');
	return $(grid).jqGrid ('getRowData', selrow);
}

function emptyFormdata(errorField,form,except){
	var temp=[];
	if(except!=null){
		$.each(except, function( index, value ) {
			temp.push($(value).val());
		});
	}
	errorField.length=0;
	$(form).trigger('reset');
	$(form+' .help-block').html('');
	if(except!=null){
		$.each(except, function( index, value ) {
			$(value).val(temp[index]);
		});
	}
}

function saveFormdata(grid,dialog,form,oper,saveParam,urlParam,searchForm,obj){
	if(obj==null){
		obj={};
	}
	$('.ui-dialog-buttonset button[role=button]').prop('disabled',true);
	saveParam.oper=oper;
	
	$.post( saveParam.url+'?'+$.param(saveParam), $( form ).serialize()+'&'+$.param(obj) , function( data ) {
		
	}).fail(function(data) {
		errorText(dialog.substr(1),data.responseText);
		$('.ui-dialog-buttonset button[role=button]').prop('disabled',false);
	}).success(function(data){
		if(grid!=null){
			refreshGrid(grid,urlParam,oper);
			$('.ui-dialog-buttonset button[role=button]').prop('disabled',false);
			$(dialog).dialog('close');
			// addmore($(searchForm+' .StextClass input[type=checkbox]').is(':checked'),grid,oper);
		}
	});
}

function addmore(addmore,grid,oper){
	var pager=$(grid).jqGrid('getGridParam', 'pager');
	if(oper == 'add' && addmore){
		delay(function(){
			$(pager+" td[title='Add New Row']").click();
		}, 500 );
	}
}

function errorText(dialog,text){///?
	$("div[aria-describedby="+dialog+"] .ui-dialog-buttonpane" ).prepend("<div class='alert alert-warning'><a href='#' class='close' data-dismiss='alert'>&times;</a><strong>Error!</strong> "+text+"</div>");
}

var delay = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();

function populateSelect(grid,form){
	$.each($(grid).jqGrid('getGridParam','colModel'), function( index, value ) {
		if(value['canSearch']){
			if(value['checked']){
				$( form+" [name=Scol]" ).append( "<label class='radio-inline'><input type='radio' name='dcolr' value='"+value['name']+"' checked>"+value['label']+"</input></label>" );
			}
			else{
				$( form+" [name=Scol]" ).append( "<label class='radio-inline'><input type='radio' name='dcolr' value='"+value['name']+"'>"+value['label']+"</input></label>" );
			}
		}
	});
}

function searchClick(grid,form,urlParam){
	$(form+' [name=Stext]').on( "keyup", function() {
		delay(function(){
			search(grid,$(form+' [name=Stext]').val(),$(form+' input:radio[name=dcolr]:checked').val(),urlParam);
		}, 500 );
	});

	$(form+' [name=Scol]').on( "change", function() {
		search(grid,$(form+' [name=Stext]').val(),$(form+' input:radio[name=dcolr]:checked').val(),urlParam);
	});
}

function searchClick2(grid,form,urlParam){
	$(form+' [name=Stext]').on( "keyup", function() {
		delay(function(){
			search(grid,$(form+' [name=Stext]').val(),$(form+' [name=Scol] option:selected').val(),urlParam);
			$('#recnodepan').text("");//tukar kat depan tu
			$('#reqdeptdepan').text("");
			refreshGrid("#jqGrid3",null,"kosongkan");
		}, 500 );
	});

	$(form+' [name=Scol]').on( "change", function() {
		search(grid,$(form+' [name=Stext]').val(),$(form+' [name=Scol] option:selected').val(),urlParam);
		$('#recnodepan').text("");//tukar kat depan tu
		$('#reqdeptdepan').text("");
		refreshGrid("#jqGrid3",null,"kosongkan");
	});
}

function search(grid,Stext,Scol,urlParam){
	urlParam.searchCol=null;
	urlParam.searchVal=null;
	if(Stext.trim() != ''){
		var split = Stext.split(" "),searchCol=[],searchVal=[];
		$.each(split, function( index, value ) {
			searchCol.push(Scol);
			searchVal.push('%'+value+'%');
		});
		urlParam.searchCol=searchCol;
		urlParam.searchVal=searchVal;
	}
	refreshGrid(grid,urlParam);
}

function autoPad(array){
	$.each(array,function(i,v){
		$(v).on( "blur", function(){
			$(v).val(pad('000000000',$(v).val(),true));
		});
		$(v).on( "focus", function(){
			$(v).val(parseInt($(v).val(), 10));
		});
	});
}

function padArray(array){
	$.each(array,function(i,v){
		$(v).val(pad('000000000',$(v).val(),true));
	});
}

function padzero(cellvalue, options, rowObject){
	let padzero = 8, str="";
	while(padzero>0){
		str=str.concat("0");
		padzero--;
	}
	return pad(str, cellvalue, true);
}

function unpadzero(cellvalue, options, rowObject){
	return cellvalue.substring(cellvalue.search(/[1-9]/));
}

function pad(pad, str, padLeft) {
	if (typeof str === 'undefined') 
		return pad;
	if (padLeft) {
		return (pad + str).slice(-pad.length);
	} else {
		return (str + pad).substring(0, pad.length);
	}
}

function removeValidationClass(array){
	$.each(array,function(i,v){
		if ( $(v).closest("div").hasClass('has-success') ||  $(v).closest("div").hasClass('has-error') ){
			$(v).closest("div").removeClass('has-success');
			$(v).closest("div").removeClass('has-error');
		}
	});
}

Date.prototype.addDays = function(days){
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

function formatDate(someDate){
	var dd = someDate.getDate();
	var mm = pad('00', someDate.getMonth() + 1, true);
	var y = someDate.getFullYear();

	return y + '-'+ mm + '-'+ dd;
}

function formatDate_mom(date,format,returnformat = 'DD-MM-YYYY'){
	let mom = moment(date, format);
	return mom.format(returnformat);
}

function setDateToNow(){
	$('input[type=date]').val(moment().format('YYYY/M/D'));
}

function currencymode(arraycurrency){
	this.array = arraycurrency;
	this.formatOn = function(){
		$.each(this.array, function( index, value ) {
			$(value).val(numeral($(value).val()).format('0,0.00'));
		});
	}
	this.formatOnBlur = function(){
		$.each(this.array, function( index, value ) {
			$(value).on("blur",{value:value},currencyBlur);
			$(value).on("keyup",{value:value},currencyChg);
			// currencyBlur(value);currencyChg(value)
		});
	}
	this.off = function(){
		$.each(this.array, function( index, value ) {
			$(value).off("blur",currencyBlur);
			$(value).off("keyup",currencyChg);
			// currencyBlur(value);currencyChg(value)
		});
	}
	this.formatOff = function(){
		$.each(this.array, function( index, value ) {
			$(value).val(currencyRealval(value));
		});
	}
	this.check0value = function(errorField){
		$.each(this.array, function( index, value ) {
			if($(value).val()=='0' || $(value).val()=='0.00'){
				$(value).val('');
			}
		});
	}

	function currencyBlur(event){
		value = event.data.value;
		$(value).val(numeral($(value).val()).format('0,0.00'));
	}

	function currencyChg(event){
		value = event.data.value;
		var val = $(value).val();
		if(val.match(/[^0-9\.]/)){
			event.preventDefault();
			$(this).val(val.slice(0,val.length-1));
		}
	}

	function currencyRealval(v){
		return numeral().unformat($(v).val());
	}
}

function dateFormatter(cellvalue, options, rowObject){
	if(cellvalue == null) return '';
	return moment(cellvalue).format("DD/MM/YYYY");
}

function dateUNFormatter(cellvalue, options, rowObject){
	return moment(cellvalue, "DD/MM/YYYY").format("YYYY-MM-DD");
}

function timeFormatter(cellvalue, options, rowObject){
	return moment(cellvalue, 'HH:mm:ss').format("hh:mm A");
}

function timeUNFormatter(cellvalue, options, rowObject){
	return moment(cellvalue, "hh:mm A").format('HH:mm:ss');
}

////////////////////formatter status////////////////////////////////////////
function formatterstatus(cellvalue, option, rowObject) {
	if (cellvalue == 'A') {
		return 'Active';
	}

	if (cellvalue == 'D') {
		return 'Deactive';
	}
}

////////////////////unformatter status////////////////////////////////////////
function unformatstatus(cellvalue, option, rowObject) {
	if (cellvalue == 'Active') {
		return 'A';
	}

	if (cellvalue == 'Deactive') {
		return 'D';
	}
}

function jqgrid_label_align_right(grid){
	$.each($(grid).jqGrid('getGridParam','colModel'), function( index, value ) {
		if(value['align'] == 'right'){
			$(grid).jqGrid('setLabel',value['name'],value['label'],{'text-align':'right'});
		}
	});
}

function ordialog(unique,table,id,errorField,jqgrid_,dialog_,checkstat='urlParam',dcolrType='radio',needTab='notab',required=true){
	this.unique=unique;
	this.gridname="othergrid_"+unique;
	this.dialogname="otherdialog_"+unique;
	this.otherdialog = "<div id='"+this.dialogname+"' title='"+dialog_.title+"'><div class='panel panel-default'><div class='panel-heading'><form id='checkForm_"+unique+"' class='form-inline'><div class='form-group'><b>Search: </b><div id='Dcol_"+unique+"' name='Dcol_"+unique+"'></div></div><div class='form-group' style='width:70%'><input id='Dtext_"+unique+"' name='Dtext_"+unique+"' type='search' style='width:100%' placeholder='Search here ...' class='form-control text-uppercase' autocomplete='off'></div></form></div><div class=panel-body><div id='"+this.gridname+"_c' class='col-xs-12' align='center'><table id='"+this.gridname+"' class='table table-striped'></table><div id='"+this.gridname+"Pager'></div></div></div></div></div>";
	this.errorField=errorField;
	this.dialog_=dialog_;
	this.jqgrid_=jqgrid_;
	this.check=checkInput;
	this.field=jqgrid_.colModel;
	this.textfield=id;
	this.eventstat='off';
	this.checkstat=checkstat;
	this.urlParam={
		from:unique,
		action:'get_table_default',
		url:'./util/get_table_default',
		table_name:table,
		field:getfield(jqgrid_.colModel),
		table_id:getfield(jqgrid_.colModel)[0],
		filterCol:[],filterVal:[],
		searchCol2:null,searchCol2:null,searchCol:null,searchCol:null
	};
	this.needTab=needTab;
	this.dcolrType=dcolrType;
	this.required=required;
	this.on = function(){
		this.eventstat='on';
		if(this.needTab=='tab'){
			$(this.textfield).on('keydown',{data:this},onTab);
		}
		$(this.textfield+" ~ a").on('click',{data:this},onClick);
		$("#Dtext_"+unique).on('keyup',{data:this},onChange);
		$("#Dcol_"+unique).on('change',{data:this},onChange);
		$(this.textfield).on('blur',{data:this,errorField:errorField},onBlur);
		return this;
	}
	this.off = function(){
		this.eventstat='off';
		if(this.needTab=='tab'){
			$(this.textfield).off('keydown',onTab);
		}
		$(this.textfield+" ~ a").off('click',onClick);
		$("#Dtext_"+unique).off('keyup',onChange);
		$("#Dcol_"+unique).off('change',onChange);
		$(this.textfield).off('blur',onBlur);
	}
	this.makedialog = function(on=false){
		$("html").append(this.otherdialog);
		makejqgrid(this);
		makedialog(this);
		if(this.dcolrType == 'radio'){
			othDialog_radio(this);
		}else{
			othDialog_dropdown(this);
		}
		if(on){
			this.eventstat='on';
			if(this.needTab=='tab'){
				$(this.textfield).on('keydown',{data:this},onTab);
			}
			$(this.textfield+" ~ a").on('click',{data:this},onClick);
			$("#Dtext_"+unique).on('keyup',{data:this},onChange);
			$("#Dcol_"+unique).on('change',{data:this},onChange);
			$(this.textfield).on('blur',{data:this,errorField:errorField},onBlur);
		}
	}

	function onClick(event){
		var textfield = $(event.currentTarget).siblings("input[type='text']");

		var obj = event.data.data;
		$("#"+obj.gridname).jqGrid('setGridParam',{ ondblClickRow: function(id){ 
			if(!obj.jqgrid_.hasOwnProperty('ondblClickRow_off')){
				textfield.off('blur',onBlur);
				textfield.val(selrowData("#"+obj.gridname)[getfield(obj.field)[0]]);
				textfield.parent().next().html(selrowData("#"+obj.gridname)[getfield(obj.field)[1]]);
				textfield.focus();
				if(obj.jqgrid_.hasOwnProperty('ondblClickRow'))obj.jqgrid_.ondblClickRow(event);
				$("#"+obj.dialogname).dialog( "close" );
				// $("#"+obj.gridname).jqGrid("clearGridData", true);
				$(obj.textfield).parent().parent().removeClass( "has-error" ).addClass( "has-success" );
				textfield.removeClass( "error" ).addClass( "valid" );
				textfield.on('blur',{data:obj,errorField:errorField},onBlur);
			}

			// var idtopush = (obj.textfield.substring(0, 1) == '#')?obj.textfield.substring(1):obj.textfield;
			var idtopush = $(event.currentTarget).siblings("input[type='text']").attr('id');
			if($.inArray(idtopush,obj.errorField)!==-1 && obj.required){
				obj.errorField.splice($.inArray(idtopush,obj.errorField), 1);
			}
		}});

		$("#"+obj.gridname).jqGrid('setGridParam',{ onSelectRow: function(rowid){ 
			if(obj.jqgrid_.hasOwnProperty('onSelectRow'))obj.jqgrid_.onSelectRow(rowid);
		}});

		renull_search(obj);
		$("#"+obj.dialogname).dialog( "open" );

		var idtopush = $(event.currentTarget).siblings("input[type='text']").attr('id');
		var jqgrid = $(event.currentTarget).siblings("input[type='text']").attr('jqgrid');
		var optid = (event.data.data.urlParam.hasOwnProperty('optid'))? event.data.data.urlParam.optid:null;

		if(optid!=null){
			var id_optid = idtopush.substring(0,idtopush.search("_"));
			optid.field.forEach(function(element,i){
				obj.urlParam.filterVal[optid.id[i]] = $(optid.jq+' input#'+id_optid+element).val();
			});
		}

		refreshGrid("#"+obj.gridname,obj.urlParam);
	}

	function onBlur(event){
		var idtopush = $(event.currentTarget).siblings("input[type='text']").end().attr('id');
		var jqgrid = $(event.currentTarget).siblings("input[type='text']").end().attr('jqgrid');
		var optid = (event.data.data.urlParam.hasOwnProperty('optid'))? event.data.data.urlParam.optid:null;

		if(event.data.data.checkstat!='none'){
			event.data.data.check(event.data.data.errorField,idtopush,jqgrid,optid);
		}
	}

	function onTab(event){
		renull_search(event.data.data);
		var textfield = $(event.currentTarget);
		if(event.key == "Tab" && textfield.val() != ""){
			
			var obj = event.data.data;
			$("#"+obj.gridname).jqGrid('setGridParam',{ ondblClickRow: function(id){ 
				if(!obj.jqgrid_.hasOwnProperty('ondblClickRow_off')){
					textfield.off('blur',onBlur);
					textfield.val(selrowData("#"+obj.gridname)[getfield(obj.field)[0]]);
					textfield.parent().next().html(selrowData("#"+obj.gridname)[getfield(obj.field)[1]]);
					textfield.focus();
					if(obj.jqgrid_.hasOwnProperty('ondblClickRow'))obj.jqgrid_.ondblClickRow(event);
					$("#"+obj.dialogname).dialog( "close" );
					// $("#"+obj.gridname).jqGrid("clearGridData", true);
					$(obj.textfield).parent().parent().removeClass( "has-error" ).addClass( "has-success" );
					textfield.removeClass( "error" ).addClass( "valid" );
					textfield.on('blur',{data:obj,errorField:errorField},onBlur);
				}

				// var idtopush = (obj.textfield.substring(0, 1) == '#')?obj.textfield.substring(1):obj.textfield;
				var idtopush = $(event.currentTarget).attr('id');
				if($.inArray(idtopush,obj.errorField)!==-1 && obj.required){
					obj.errorField.splice($.inArray(idtopush,obj.errorField), 1);
				}
			}});

			$("#"+obj.gridname).jqGrid('setGridParam',{ onSelectRow: function(id){ 
				if(obj.jqgrid_.hasOwnProperty('onSelectRow'))obj.jqgrid_.onSelectRow(rowid, selected);
			}});

			event.preventDefault();
			let text = $(this).val().trim();
			if(text != ''){
				let split = text.split(" "),searchCol2=[],searchVal2=[];
				$.each(split, function( index, value ) {
					getfield(event.data.data.field,true).forEach(function(element){
						searchCol2.push(element);
						searchVal2.push('%'+value+'%');
					});
				});
				event.data.data.urlParam.searchCol2=searchCol2;
				event.data.data.urlParam.searchVal2=searchVal2;
			}
			$("#"+event.data.data.dialogname).dialog("open");
			refreshGrid("#"+event.data.data.gridname,event.data.data.urlParam);
			$("#Dtext_"+unique).val(text);
		}
	}

	function onChange(event){
		let obj = event.data.data;
		renull_search(obj);
		let Dtext=$("#Dtext_"+obj.unique).val().trim();
		if(obj.dcolrType == 'radio'){
			var Dcol=$("#Dcol_"+obj.unique+" input:radio[name=dcolr]:checked").val();
		}else{
			var Dcol=$("#Dcol_"+obj.unique+" select[name=dcolr]").val();
		}
		let split = Dtext.split(" "),searchCol=[],searchVal=[];
		$.each(split, function( index, value ) {
			searchCol.push(Dcol);
			searchVal.push('%'+value+'%');
		});
		if(event.type=="keyup" && Dtext != ''){
			delay(function(){
				obj.urlParam.searchCol=searchCol;
				obj.urlParam.searchVal=searchVal;
				refreshGrid("#"+obj.gridname,obj.urlParam);
			},500);
		}else if(event.type=="change" && Dtext != ''){
			obj.urlParam.searchCol=searchCol;
			obj.urlParam.searchVal=searchVal;
			refreshGrid("#"+obj.gridname,obj.urlParam);
		}else{
			refreshGrid("#"+obj.gridname,obj.urlParam);
		}
	}

	function othDialog_radio(obj){
		$.each($("#"+obj.gridname).jqGrid('getGridParam','colModel'), function( index, value ) {
			if(value['canSearch']){
				if(value['checked']){
					$("#Dcol_"+unique+"").append("<label class='radio-inline'><input type='radio' name='dcolr' value='"+value['name']+"' checked>"+value['label']+"</input></label>" );
				}else{
					$("#Dcol_"+unique+"").append( "<label class='radio-inline'><input type='radio' name='dcolr' value='"+value['name']+"' >"+value['label']+"</input></label>" );
				}
			}
		});
	}

	function othDialog_dropdown(obj){
		$("#Dcol_"+unique+"").append("<select name='dcolr' class='form-control input-sm' style='margin-right:10px;min-width:150px'></select>");
		$("#Dtext_"+unique+"").parent().prepend("<b>&nbsp;</b>");
		$.each($("#"+obj.gridname).jqGrid('getGridParam','colModel'), function( index, value ) {
			if(value['canSearch']){
				if(value['checked']){$("#Dcol_"+unique+" select[name=dcolr]").append( "<option value='"+value['name']+"' selected>"+value['label']+"</option>" );
				}else{
					$("#Dcol_"+unique+" select[name=dcolr]").append( "<option value='"+value['name']+"'>"+value['label']+"</option>" );
				}
			}
		});
	}

	function renull_search(obj){
		obj.urlParam.searchCol2=obj.urlParam.searchVal2=obj.urlParam.searchCol=obj.urlParam.searchVal=null;
	}

	function makedialog(obj){
		let width = 7/10 * $(window).width();
		if(obj.dialog_.hasOwnProperty('width')){
			width = obj.dialog_.width;
		}
		$("#"+obj.dialogname).dialog({
			autoOpen: false,
			width: width,
			modal: true,
			open: function(event, ui){
				$("#"+obj.gridname).jqGrid ('setGridWidth', Math.floor($("#"+obj.gridname+"_c")[0].offsetWidth-$("#"+obj.gridname+"_c")[0].offsetLeft));
				if(obj.dialog_.hasOwnProperty('open'))obj.dialog_.open(event);
				if(obj.needTab == 'notab')$("#Dtext_"+unique).focus();

			},
			close: function( event, ui ){
				$("#Dtext_"+unique).val('');
				if(obj.dialog_.hasOwnProperty('close'))obj.dialog_.close(event);
			},
		});
	}

	function makejqgrid(obj){
		$("#"+obj.gridname).jqGrid({
			datatype: "local",
			colModel: obj.field,
			autowidth: true,viewrecords:true,loadonce:false,width:200,height:200,owNum:30,
			pager: "#"+obj.gridname+"Pager",
			onSelectRow:function(rowid, selected){
				if(obj.jqgrid_.hasOwnProperty('onSelectRow'))obj.jqgrid_.onSelectRow(rowid, selected);
			},
			ondblClickRow: function(rowid, iRow, iCol, e){
				if(!obj.jqgrid_.hasOwnProperty('ondblClickRow_off')){
					$(obj.textfield).off('blur',onBlur);
					$(obj.textfield).val(selrowData("#"+obj.gridname)[getfield(obj.field)[0]]);
					$(obj.textfield).parent().next().html(selrowData("#"+obj.gridname)[getfield(obj.field)[1]]);
					$(obj.textfield).focus();
					if(obj.jqgrid_.hasOwnProperty('ondblClickRow'))obj.jqgrid_.ondblClickRow();
					$("#"+obj.dialogname).dialog( "close" );
					// $("#"+obj.gridname).jqGrid("clearGridData", true);
					$(obj.textfield).parent().parent().removeClass( "has-error" ).addClass( "has-success" );
					$(obj.textfield).removeClass( "error" ).addClass( "valid" );
					$(obj.textfield).on('blur',{data:obj,errorField:errorField},onBlur);
				}
				var idtopush = (obj.textfield.substring(0, 1) == '#')?obj.textfield.substring(1):obj.textfield;
				if($.inArray(idtopush,obj.errorField)!==-1 && obj.required){
					obj.errorField.splice($.inArray(idtopush,obj.errorField), 1);
				}
			},
			loadComplete: function(data) {
				$("#"+obj.gridname+' tr#1').click().focus();
				if(obj.jqgrid_.hasOwnProperty('loadComplete'))obj.jqgrid_.loadComplete(data,obj);
		    },
			gridComplete: function() {
				if(obj.jqgrid_.hasOwnProperty('gridComplete'))obj.jqgrid_.gridComplete(obj);
		    },

		});

		if(obj.jqgrid_.hasOwnProperty('sortname')){
			$("#"+obj.gridname).jqGrid('setGridParam',{ sortname: obj.jqgrid_.sortname});
		};
		if(obj.jqgrid_.hasOwnProperty('sortorder')){
			$("#"+obj.gridname).jqGrid('setGridParam',{ sortorder: obj.jqgrid_.sortorder});
		};

		$("#"+obj.gridname).jqGrid('bindKeys', {"onEnter":function( rowid ) { 
				$("#"+obj.gridname+' tr#'+rowid).dblclick();
			}
		})
		addParamField("#"+obj.gridname,false,obj.urlParam);
	}

	function getfield(field,or_search){
		var fieldReturn = [];
		field.forEach(function(element){
			if(or_search){
				if(element.or_search)fieldReturn.push(element.name);
			}else{
				fieldReturn.push(element.name);
			}
		});
		return fieldReturn;
	}

	function checkInput(errorField,idtopush,jqgrid=null,optid=null){
		var table=this.urlParam.table_name,field=this.urlParam.field,value=$(this.textfield).val(),param={},self=this,urlParamID=0,desc=1;

		if(idtopush){ /// ni nk tgk sama ada from idtopush exist atau tak
			var idtopush = idtopush,id;
			if(jqgrid==null){
				id = 'input#'+idtopush;
				value = $(id).val();
			}else{
				id = '#'+jqgrid+' input#'+idtopush;
				value = $(id).val();
			}
		}else{
			var idtopush = (this.textfield.substring(0, 1) == '#')?this.textfield.substring(1):this.textfield;
			value = $('#'+idtopush).val();
			var id = '#'+idtopush;
		}

		if(this.urlParam.fixPost == 'true'){
			code_ = this.urlParam.field[urlParamID];
			desc_ = this.urlParam.field[desc];
			code_ = code_.replaceAt(code_.search("_"),'.');
		}else{
			code_ = this.urlParam.field[urlParamID];
			desc_ = this.urlParam.field[desc];
		}

		let index=0;
		if(this.checkstat=='default'){
			param={action:'input_check',table:table,field:field,value:value};

		}else{

			param=Object.assign({},this.urlParam);

			if(optid!=null){
				var id_optid = idtopush.substring(0,idtopush.search("_"));
				optid.field.forEach(function(element,i){
					param.filterVal[optid.id[i]] = $(optid.jq+' input#'+id_optid+element).val();
				});
			}

			param.action="get_value_default";
			param.url='/util/get_value_default';
			param.field=[code_,desc_];
			index=jQuery.inArray(code_,param.filterCol);
			if(index == -1){
				param.filterCol.push(code_);
				param.filterVal.push(value);
			}else{
				param.filterVal[index]=value;
			}
		}

		$.get( param.url+"?"+$.param(param), function( data ) {

		},'json').done(function(data) {
			if(index == -1){
				param.filterCol.pop();
				param.filterVal.pop();
			}
			let fail=true,code,desc2;
			if(self.checkstat=='default'){
				if(data.msg=='success'){
					fail=false;desc2=data.rows[field[1]];
				}else if(data.msg=='fail'){
					fail=true;code=field[0];
				}
			}else{
				if(data.rows.length>0){
					fail=false;
					if(param.fixPost == 'true'){
						desc2=data.rows[0][self.urlParam.field[desc].split('.')[1]];
					}else{
						desc2=data.rows[0][self.urlParam.field[desc]];
					}
				}else{
					fail=true;code=code_;
				}
			}

			if(typeof errorField != 'string' && self.required){
				if(!fail){
					if($.inArray(idtopush,errorField)!==-1){
						errorField.splice($.inArray(idtopush,errorField), 1);
					}
					$( id ).parent().parent().removeClass( "has-error" ).addClass( "has-success" );
					$( id ).removeClass( "error" ).addClass( "valid" );
					$( id ).parent().siblings( ".help-block" ).html(desc2);
					$( id ).parent().siblings( ".help-block" ).show();
				}else{
					$( id ).parent().parent().removeClass( "has-success" ).addClass( "has-error" );
					$( id ).removeClass( "valid" ).addClass( "error" );
					$( id ).parent().siblings( ".help-block" ).html("Invalid Code ( "+code+" )");
					if($.inArray(idtopush,errorField)===-1){
						errorField.push( idtopush );
					}
				}
			}
			
		});
	}

	this.init_func = null;
	this._init_func = function _init_func(init_func){
		this.init_func = init_func;
	}
	this._init = function(){
		this.init_func(this);
	}
	
}

function getfield(field,or_search){
	var fieldReturn = [];
	field.forEach(function(element){
		if(or_search){
			if(element.or_search)fieldReturn.push(element.name);
		}else{
			fieldReturn.push(element.name);
		}
	});
	return fieldReturn;
}


function checkradiobutton(radiobuttons){
	this.radiobuttons=radiobuttons;
	this.check = function(){
		$.each(this.radiobuttons, function( index, value ) {
			var checked = $("input[name="+value+"]:checked").val();
		    if(!checked){
		     	$("label[for="+value+"]").css('color', '#a94442');
		     	$(":radio[name='"+value+"']").parent('label').css('color', '#a94442');
			}else{
				$("label[for="+value+"]").css('color', '#444444');
				$(":radio[name='"+value+"']").parent('label').css('color', '#444444');
			}
		});
	}
	this.reset = function(){
		$.each(this.radiobuttons, function( index, value ) {
			$("label[for="+value+"]").css('color', '#444444');
			$(":radio[name="+value+"]").parent('label').css('color', '#444444');
		});
	}
}

////////////////////////////////// faster detail loading  ///////////////////////////////////////////


fixPositionsOfFrozenDivs = function () {
    var $rows;
    if (typeof this.grid.fbDiv !== "undefined") {
        $rows = $(">div>table.ui-jqgrid-btable>tbody>tr", this.grid.bDiv);
        $(">table.ui-jqgrid-btable>tbody>tr", this.grid.fbDiv).each(function (i) {
            var rowHight = $($rows[i]).height(), rowHightFrozen = $(this).height();
            if ($(this).hasClass("jqgrow")) {
                $(this).height(rowHight);
                rowHightFrozen = $(this).height();
                if (rowHight !== rowHightFrozen) {
                    $(this).height(rowHight + (rowHight - rowHightFrozen));
                }
            }
        });
        $(this.grid.fbDiv).height(this.grid.bDiv.clientHeight);
        $(this.grid.fbDiv).css($(this.grid.bDiv).position());
    }
    if (typeof this.grid.fhDiv !== "undefined") {
        $rows = $(">div>table.ui-jqgrid-htable>thead>tr", this.grid.hDiv);
        $(">table.ui-jqgrid-htable>thead>tr", this.grid.fhDiv).each(function (i) {
            var rowHight = $($rows[i]).height(), rowHightFrozen = $(this).height();
            $(this).height(rowHight);
            rowHightFrozen = $(this).height();
            if (rowHight !== rowHightFrozen) {
                $(this).height(rowHight + (rowHight - rowHightFrozen));
            }
        });
        $(this.grid.fhDiv).height(this.grid.hDiv.clientHeight);
        $(this.grid.fhDiv).css($(this.grid.hDiv).position());
    }
}

function parseParams(query){
  var setValue = function(root, path, value){
    if(path.length > 1){
      var dir = path.shift();
      if( typeof root[dir] == 'undefined' ){
        root[dir] = path[0] == '' ? [] : {};
      }

      arguments.callee(root[dir], path, value);
    }else{
      if( root instanceof Array ){
        root.push(value);
      }else{
        root[path] = value;
      }
    }
  };
  var nvp = query.split('&');
  var data = {};
  for( var i = 0 ; i < nvp.length ; i++ ){
    var pair = nvp[i].split('=');
    var name = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);

    var path = name.match(/(^[^\[]+)(\[.*\]$)?/);
    var first = path[1];
    if(path[2]){
      //case of 'array[level1]' || 'array[level1][level2]'
      path = path[2].match(/(?=\[(.*)\]$)/)[1].split('][')
    }else{
      //case of 'name'
      path = [];
    }
    path.unshift(first);

    setValue(data, path, value);
  }
  return data;
}


/////////////////////////////////End utility function////////////////////////////////////////////////
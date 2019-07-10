var listRegisters = {
    paginationStar  : 0,
    paginationStep  : 10,
    numberOfButtons : 1,     //Mock, se actualiza cuando se reciben los datos ajax
    by              : 'id',
    order           : 'ASC',
    searchBy        : '',
    valueSearchBy   : '',
    goToRegister : function(thisElement){
        var idRegister = thisElement.getAttribute('idRegister');
        var catalog = document.getElementById('catalogName').value;
        var url = '/'+ catalog +'/edit/' + idRegister;
        window.open( url ,"_self"); 
    },
    getDataTable : function( url, createBtns ){
         $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                
                var numAllRegisters = res.count;
                
                if( createBtns ){
                    setTag.createButtons( numAllRegisters, listRegisters.searchBy, listRegisters.valueSearchBy );
                }

                setTag.setTable(res.data)
        
               document.getElementById('waintingAnimation').style.display = "none";
               

            },

            data:  JSON.stringify ({'paginationStart': listRegisters.paginationStar ,
                                    'paginationStep' : listRegisters.paginationStep ,
                                    'by'             : listRegisters.by,
                                    'order'          : listRegisters.order,
                                    'searchBy'       : listRegisters.searchBy,    
                                    'valueSearchBy'  : listRegisters.valueSearchBy
                                    })
        }).done(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        })
        .fail(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        })
        .always(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        }) ;
       
    },
    linkAddProvider: function(){
        var catalog = document.getElementById('catalogName').value;
        var url = '/'+ catalog +'/add';
        window.open( url ,"_self"); 
    },
    actionButtonPagination: function( thisButton ){

        //Icono de espera
        document.getElementById('waintingAnimation').style.display = "block";

        //Set list
        var url      =  document.getElementById('catalogName').value;

        listRegisters.paginationStar = parseInt( thisButton.getAttribute('initL') ) ;

        listRegisters.getDataTable( url, false )
        
        //Behavior button
        $(".button_pag").removeAttr("active");
        $( thisButton ).attr('active','')

    },
    


    initSearch : function() {
        document.getElementById('waintingAnimation').style.display = "block";
        
        var searchBy      = $('#searchRegisterSelect').val();
        var valueSearchBy = $('#searchRegisterField').val();
        var url = document.getElementById('catalogName').value;

        listRegisters.paginationStar = 0;
        listRegisters.searchBy       = $('#searchRegisterSelect').val();  
        listRegisters.valueSearchBy  = $('#searchRegisterField').val();
        
        listRegisters.getDataTable( url, true  );
        
    },

    init : function(){

        document.getElementById('waintingAnimation').style.display = "block";

        //Set values for init pagination
        listRegisters.paginationStar = 0;
        listRegisters.searchBy       = '';  
        listRegisters.valueSearchBy  = '';

        var url = document.getElementById('catalogName').value;

        listRegisters.getDataTable(  url, true );
    }
};

          


//Para las secciones de agragar o editar             
var POSTRegister = {
    messages : {
        'update': {
            'success': 'El registro fué actualizado',
            'fail'   : 'El registro no pudo ser actualizado'
        },
        'create': {
            'success': 'El registro fué agregado',
            'fail'   : 'El registro no pudo ser agregado'
        }
    },
    send: function( url, dataJson, msj ){
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if( data.status_code >=200 && data.status_code < 300 ) {
                    var message = POSTRegister.messages[msj].success;
                }else {
                    var message = POSTRegister.messages[msj].fail;
                }

                notifyRegisters.set( 'true', message );
                window.location.href = document.getElementById('titleFirstLink').href;
            },
            data: dataJson
        });               
    }
} 


var DELETERegisters = {
    messages : {
        'success': 'El registro fué eliminado',
        'fail'   : 'El registro no pudo ser eliminado'
    },
    warning : function warningDelete(){
        $('#modalconfirm').modal({ show: true });
        $('.modal-backdrop').removeClass("modal-backdrop");  
    },
    send: function(){
            
        var idRegister = $('#registerid').val();
        var catalog = document.getElementById('catalogName').value;
        var url = '/'+ catalog +'/edit/' + idRegister;

        $.ajax({
            url: url,
            type: 'DELETE',
            success: function (data) {
                if( data.status_code >=200 && data.status_code < 300 ) {
                    var message = DELETERegisters.messages.success;
                }else {
                    var message = DELETERegisters.messages.fail;
                }

                notifyRegisters.set( 'true', message );
                window.location.href = document.getElementById('titleFirstLink').href;
            }
        });
    
    }
};





var validate={
    'fields' : function( dataJson ){
        
        //Clean
        for(var f in dataJson){
            var thisField = dataJson[f];
            var idField = thisField.id;
            
            document.getElementById( idField ).style.border = "solid 1px #ced4da";
            document.getElementById( 'for_' + idField ).style.display = "none";
            
            //If is a select2 select element
            if( $('#' + idField ).next().closest('.select2-container').length > 0 ){
                 $('#' + idField ).next().closest('.select2-container').css('border','solid 1px #ced4da');
            }

        }

        var send = true;
        for(var f in dataJson){
            var thisField = dataJson[f];
            var idField = thisField.id;
            var fieldValue = $('#' + idField ).val();
            var isValide = validate[thisField.type]( fieldValue );
            if (  !isValide[0] ){
                document.getElementById( idField ).style.border = "1px solid #a33";
                document.getElementById( 'for_' + idField ).style.display = "block";
                document.getElementById( 'for_' + idField ).innerHTML = isValide[1];

                //If is a select2 select element
                if( $('#' + idField ).next().closest('.select2-container').length ){
                    $('#' + idField ).next().closest('.select2-container').css('border','solid 1px #a33');
                }

                send = false
            }
        }

        return send;
    },
    'text' : function( val ){
        if( val == '' ){return [false, 'Ingresa este campo'];}
        else{return [true];}
    },
    'int' : function( val ){
        if( val == '' ){return [false, 'Ingresa un número válido'];}
        else if( isNaN( val ) ){return [false, 'Ingresa un número válido'];}
        else if( parseFloat(val)%1 != 0 ){return [false, 'Ingresa un entero'];}
        else{return [true];}
    },
    'intMil' : function( val ){        //Entero entre el 0 y 100
        if( val == '' ){return [false, 'Ingresa un número válido'];}
        else if( isNaN( val ) ){return [false, 'Ingresa un número válido'];}
        else if( parseFloat(val)%1 != 0 ){return [false, 'Ingresa un entero'];}
        else if( parseFloat(val) > 9999 ){return [false, 'Ingresa un número menor de 10000'];}
        else if( parseFloat(val) < 0 ){return [false, 'Ingresa un número positivo'];}
        else{return [true];}
    },
    'float' : function( val ){
        if( val == '' ){return [false, 'Ingresa un número válido'];}
        else if( isNaN( val ) ){return [false, 'Ingresa un número válido'];}
        else{return [true];}
    },
    'date' : function( val ){
        var patt = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
        if( val == '' ){return [false, 'Ingresa este campo'];}
        else if( !val.match(patt) ){return [false, 'Ingresa una fecha válida'];}
        else{return [true];}
    },
    'selectNumber': function( val ){
        if( val == '' || val == 0 ){return [false, 'Selecciona un elemento'];}
        else{return [true];}
    },

    'image': function( id ){
        var sendForm = true;
        document.getElementById( 'for_' + id ).style.display = "none";
        jQuery.each(jQuery('#' + id)[0].files, function(i, file) {
            if( file.type == 'image/png' || file.type == 'image/jpeg'  ){ 
                ;
            }else{
                document.getElementById( 'for_' + id ).style.display = "block";
                document.getElementById( 'for_' + id ).innerHTML = 'Ingresa un formato de imagen válido';
                sendForm = false;
            }
        });

        return sendForm;
    }
}




var datesGENL = {
    formatPicker : { dateFormat: 'dd-mm-yy' },
    formatOrder : function(val){
        var dateArr = val.split('-')
        return dateArr[2] +'-'+ dateArr[1] +'-' + dateArr[0];
    },
    formatOrderTime : function(val){
        var dateArrTime = val.split('T')
        var dateArr = dateArrTime[0].split('-')
        return dateArr[2] +'-'+ dateArr[1] +'-' + dateArr[0];
    },
    formatDateSend: function(dat){
        var dateArr = dat.split('-')
        return dateArr[2] +'-'+ dateArr[1] +'-' + dateArr[0];
    }
}







/////////////// Follow Up


var listProjectsFollowUps = {
    paginationStar  : 0,
    paginationStep  : 10,
    numberOfButtons : 1,     //Mock, se actualiza cuando se reciben los datos ajax
    by              : 'id',
    order           : 'DESC',
    searchBy        : '',
    valueSearchBy   : '',
    goToRegister : function(thisElement){
        var idRegister = thisElement.getAttribute('idRegister');
        var catalog = document.getElementById('goToLinkRegister').value;
        var url = catalog +'/' + idRegister;
        window.open( url ,"_self"); 
    },
    getDataTable : function( url, createBtns ){
         $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                
                var numAllRegisters = res.count;
                
                if( createBtns ){
                    setTag.createButtons( numAllRegisters, listProjectsFollowUps.searchBy, listProjectsFollowUps.valueSearchBy );
                }

                setTag.setTable(res.data)
        
               document.getElementById('waintingAnimation').style.display = "none";
               

            },

            data:  JSON.stringify ({'paginationStart': listProjectsFollowUps.paginationStar ,
                                    'paginationStep' : listProjectsFollowUps.paginationStep ,
                                    'by'             : listProjectsFollowUps.by,
                                    'order'          : listProjectsFollowUps.order,
                                    'searchBy'       : listProjectsFollowUps.searchBy,    
                                    'valueSearchBy'  : listProjectsFollowUps.valueSearchBy
                                    })
        }).done(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        })
        .fail(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        })
        .always(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        }) ;
       
    },
    projects: false,
    categories: false,
    contracts: false,
    setOptionsSelect: function(catalogo, res){
        var optionsTag = ""
        if(catalogo == 'contract'){
            for( var opt in res ){
                optionsTag += '<option value="'+ res[opt].id +'"> '+ res[opt].number +' </option>'
            }
        }else {
            for( var opt in res ){
                optionsTag += '<option value="'+ res[opt].id +'"> '+ res[opt].title +' </option>'
            }
        }
        document.getElementById('searchRegisterField').innerHTML = optionsTag;
        document.getElementById('waintingAnimation').style.display = "none";
        
        $('.select2-container').css('width','100%');
        

    },
    getAllOptionsForSelect: function( url, catalogo){
        
        //Si contiene un arreglo no hace la paticion
        if( listProjectsFollowUps[catalogo] ){ 
            listProjectsFollowUps.setOptionsSelect( catalogo, listProjectsFollowUps[catalogo]);
            return 0; 
        }
        
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {

                $('#searchRegisterField').select2();

                listProjectsFollowUps[catalogo] = res;
                listProjectsFollowUps.setOptionsSelect( catalogo,res);

            }
        }).done(function() { document.getElementById('waintingAnimation').style.display = "none"; })
        .fail(function() { document.getElementById('waintingAnimation').style.display = "none"; })
        .always(function() { document.getElementById('waintingAnimation').style.display = "none"; }) ;       
    },
    linkAddRegister: function(){
        var catalog = document.getElementById('catalogName').value;
        var url = '/'+ catalog +'/add';
        window.open( url ,"_self"); 
    },
    actionButtonPagination: function( thisButton ){

        //Icono de espera
        document.getElementById('waintingAnimation').style.display = "block";

        //Set list
        var url      =  document.getElementById('catalogName').value;

        listProjectsFollowUps.paginationStar = parseInt( thisButton.getAttribute('initL') ) ;

        listProjectsFollowUps.getDataTable( url, false )
        
        //Behavior button
        $(".button_pag").removeAttr("active");
        $( thisButton ).attr('active','')

    },
    addFollowUp: function(thisElement){
        var idProject = document.getElementById('projectId').value;
        var catalog = document.getElementById('goToAddRegister').value;
        var url = catalog + '/' + idProject;
        window.open( url ,"_self"); 
    },

    changeSarchSelect: function(){

        if( document.getElementById('searchRegisterSelect') ){ ;}else{return;}

        document.getElementById('waintingAnimation').style.display = "block";
        
        var searchBy = document.getElementById('searchRegisterSelect').value;
        if(searchBy == 'project'){ listProjectsFollowUps.getAllOptionsForSelect( '/getAllProjects','project' ) }
        else if(searchBy == 'contract'){ listProjectsFollowUps.getAllOptionsForSelect( '/getAllContracts','contract'  ) }
        //else (searchBy == 'category'){ listProjectsFollowUps.getAllOptionsForSelect( '/getAllCategories','categories' ) }
        else { listProjectsFollowUps.getAllOptionsForSelect( '/getAllCategories','category' ) }
    },
    initSearch : function() {
        document.getElementById('waintingAnimation').style.display = "block";
        
        var searchBy      = $('#searchRegisterSelect').val();
        var valueSearchBy = $('#searchRegisterField').val();
        var url = document.getElementById('catalogName').value;

        listProjectsFollowUps.paginationStar = 0;
        listProjectsFollowUps.searchBy       = $('#searchRegisterSelect').val();  
        listProjectsFollowUps.valueSearchBy  = $('#searchRegisterField').val();
        
        listProjectsFollowUps.getDataTable( url, true  );
        
    },

    init : function(){

        document.getElementById('waintingAnimation').style.display = "block";

        //Set values for init pagination
        listProjectsFollowUps.paginationStar = 0;
        listProjectsFollowUps.searchBy       = '';  
        listProjectsFollowUps.valueSearchBy  = '';
        
        
        var url = document.getElementById('catalogName').value;


        listProjectsFollowUps.getDataTable(  url, true );
        
        listProjectsFollowUps.changeSarchSelect();

    }
};


//Para las secciones de agragar o editar             
var POSTFollowUps = {
    messages : {
        'update': {
            'success': 'El registro fué actualizado',
            'fail'   : 'El registro no pudo ser actualizado'
        },
        'create': {
            'success': 'El registro fué agregado',
            'fail'   : 'El registro no pudo ser agregado'
        }
    },
    messageForShow : "",
    send: function( url, dataJson, msj ){
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if( data.status_code >=200 && data.status_code < 300 ) {

                    var sendImage = false;
                    POSTFollowUps.messageForShow = POSTFollowUps.messages[msj].success;
                    var dataFile = new FormData();
                    jQuery.each(jQuery('#file')[0].files, function(i, file) {
                        sendImage = true;
                        var ext = '';
                        if(file.type == 'image/png' ){ 
                            ext = '.png';    
                        }else if( file.type == 'image/jpeg' ){
                            ext = '.jpg';    
                        }else{
                            sendImage = false;
                            POSTFollowUps.messageForShow = "Ingresa un formato de imagen válido"
                        }
                        var d = new Date();
                        var n = d.getTime();
                        dataFile.append(n+i+ext, file);
                    });

                    if( !sendImage ){
                        notifyRegisters.set( 'true', POSTFollowUps.messageForShow );
                        window.location.href = document.getElementById('titleProjectRegister').href;
                 
                        return 0;
                    }

                    
                    jQuery.ajax({
                        url: '/save_image_followups/' + data.follow_up_id ,
                        data: dataFile,
                        cache: false,
                        contentType: false,
                        processData: false,
                        method: 'POST',
                        type: 'POST', // For jQuery < 1.9
                        success: function(data){
                            //var message = POSTRegister.messages[msj].success;

                            if( data.status_code >=200 && data.status_code < 300 ) {
                                POSTFollowUps.messageForShow = POSTFollowUps.messages[msj].success;
                            }else {
                                POSTFollowUps.messageForShow = "La imagen no pudo ser actualizada";
                            }
                            
                            notifyRegisters.set( 'true', POSTFollowUps.messageForShow );
                            window.location.href = document.getElementById('titleProjectRegister').href;

                        }
                    });

                }else {
                    POSTFollowUps.messageForShow = POSTFollowUps.messages[msj].fail;
                    
                    notifyRegisters.set( 'true', POSTFollowUps.messageForShow );
                    window.location.href = document.getElementById('titleProjectRegister').href;
                }

            },
            data: dataJson
        });               
    }
} 





var imagesFollowUps = {
    tagImg : function(url, imageName, num){
        
        var tag = `
            <div class="row" id="rowImage`+ num +`" >
                <div class="col-md-3 col-sm-4">
                    <img src="`+ url +`" style="width:100%; height: auto;" >
                </div>
                <div class="col-md-4">
                    <span idToDelete="rowImage`+ num +`" imageName="`+ imageName +`" style="position:absolute; top: 40%;color:#88f;cursor: pointer;" onclick="imagesFollowUps.removeImage(this);"> Eliminar imagen</span>
                </div>
            </div>
        `;
        return tag;
    },
    inputFileChange : function(){
        var files = document.getElementById('file').files;
        
        var filesTag = '';
        for(var f = 0; f < files.length; f++){
                
            filesTag += '<span style="margin-left:10px;">'+ files[f].name +'</span><br>';
        }
        document.getElementById('nameFileUpload').innerHTML = filesTag;
    },
    init : function(){
        var images = document.getElementById("img_paths").value;
        var pathUrl = document.getElementById("pathUrl").value;

        var imagesArr = images.split('|');

        var strImages = "";
        for(var i in imagesArr){
            var urlImage = pathUrl + imagesArr[i];
            strImages += imagesFollowUps.tagImg( urlImage, imagesArr[i], i );
        }
        
        if( images ){
            document.getElementById('containerImagesFollowUp').innerHTML= strImages;
        }
    },
    removeImage : function(thisE){
        var idToDelete = thisE.getAttribute('idToDelete');
        var imageName  = thisE.getAttribute('imageName');
        
        var imgPaths = document.getElementById('img_paths').value;
        
        var newImgPaths = imgPaths.replace( imageName, '');
        
        var newImgPaths = newImgPaths.replace('||','|');
        var newImgPaths = newImgPaths.replace(/\|$/,'');
        var newImgPaths = newImgPaths.replace(/^\|/,'');

        document.getElementById('img_paths').value = newImgPaths;
        

        document.getElementById(idToDelete).remove();
    }
}





/////// Graphics

var plotsChart = {
    department    : '',
    check_stage   : '',
    city          : '',
    year          : '',
    provider      : '',
    funding       : '',
    program       : '',
    adjudication  : '',
    chartTitle    : '',
    init : function(){
        plotsChart.getData( 'pieStatus' );
    },
    initStackCities : function(){

        this.cleanParameters();
        plotsChart.getData( 'barCities' );
    },
    initDepartmentsPie : function(){

        this.cleanParameters();
        plotsChart.getData( 'pieDepartment' );
    },
    setChartSelect: function(){

        this.department   = $('#dependencySelect').val();
        this.check_stage  = '';
        this.city         = '';
        this.year         = '';
        this.provider     = '';
        this.funding      = '';
        this.program      = '';
        this.adjudication = '';
        
        plotsChart.getData()
    },   
    search: function(){
        this.department   = $('#departmentSearch').val();
        this.check_stage  = $('#check_stage').val();
        this.city         = $('#city').val();
        this.year         = $('#year').val();
        this.provider     = $('#provider').val();
        this.funding      = $('#funding').val();
        this.program      = $('#program').val();
        this.adjudication = $('#adjudication').val();

        $('#modalSearch').modal('hide');

        plotsChart.getData();

    },
    cleanParameters: function(){
        this.department   = ''; 
        this.check_stage  = '';
        this.city         = '';
        this.year         = '';
        this.provider     = '';
        this.funding      = '';
        this.program      = '';
        this.adjudication = '';
    },
    chart : '',
    getData : function ( chartType ){
        
        document.getElementById('waintingAnimation').style.display = "block";

        $.ajax({
            url: '/graphics',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                
                if( chartType == 'pieStatus' ){
                    var values = plotsChart.setJsonChart(res.data);
                    var options = plotsChart.optionsChart(values)
                    
                    $('#genl-pie-chart').css('height','400px');
                    plotsChart.chart = Highcharts.chart('genl-pie-chart', options);

                }else if( chartType == 'barCities' ){
                    var values = plotsChart.setJsonStackedBar(res.data);
                    var optionsHighChart = plotsChart.optionsStackedBar(values[0], values[1]);
                    
                    $('#genl-pie-chart').css('height','2000px');
                    plotsChart.chart = Highcharts.chart('genl-pie-chart', optionsHighChart);
                }else {
                    var values = plotsChart.setJsonDeparmentChart(res.data);
                    console.log(values);
                    var optionsHighChart = plotsChart.optionsChart(values);
                    
                    $('#genl-pie-chart').css('height','400px');
                    plotsChart.chart = Highcharts.chart('genl-pie-chart', optionsHighChart);
                }

                
                $('#waintingAnimation').css('display','none');

            },

            data:  JSON.stringify ({'department'    : plotsChart.department.toString(),
                                    'city'          : plotsChart.city.toString(),
                                    'check_stage'   : plotsChart.check_stage.toString(),
                                    'year'          : plotsChart.year.toString(),
                                    'provider'      : plotsChart.provider.toString(),
                                    'adjudication'  : plotsChart.adjudication.toString(),
                                    'funding'       : plotsChart.funding.toString(),
                                    'program'       : plotsChart.program.toString(),
                                   })

        }).done(function() { $('#waintingAnimation').css('display','none');
        }).fail(function() { $('#waintingAnimation').css('display','none');
        }).always(function() { $('#waintingAnimation').css('display','none');
        });

    },
    setJsonChart : function( resp ){
        var countStages = ['',0,0,0,0,0,0,0]
        var values = [];

        var namesStages = [ '',
            "TERMINADAS",
            "EN TIEMPO",
            "CON RETRASO",
            "RESCINDIDAS",
            "NO INICIADAS",
            "CON AVANCE FINANCIERO MAYOR AL FÍSICO",
            "OBRAS RESTRINGIDAS"
        ]


        var finalContractedAmountTotal = 0;

        for(var i in resp){
            var stat = resp[i];
            countStages[stat.check_stage]++;
            finalContractedAmountTotal += stat.final_contracted_amount;
        }

        for( var s = 1; s<=7; s++ ){
            if( countStages[s] > 0 ){    
                values.push( {
                    name : namesStages[s],   
                    y: countStages[s],
                    x: s,
                    color: plotsChart.colors[ s ]
                } )
            }
        }
        
        var sfcat = finalContractedAmountTotal.toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

        //Establece el titulo de la grafica, se guarda en este objeto y lo obtiene cuando se forman las opciones de la grafica
        plotsChart.chartTitle = 'TOTAL DE OBRAS ' + resp.length + '<br>$' +  sfcat;
        
        return values;
    },
    setJsonStackedBar: function( jsonResponse ){
        
        //[Estatus][Ciudad]  
        var countCities = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ];

        var categories        = citiesNL.slice(1);
        plotsChart.chartTitle = 'TOTAL DE OBRAS ' + jsonResponse.length;

        //Por cada obra aumenta en 1 el elemento countCities[estatus][ciudad]
        for(var i in jsonResponse){
            var obra = jsonResponse[i];
            countCities[obra.check_stage - 1][obra.city_id - 1]++;
        }


        /*
        var dataForStatus = [[],[],[],[],[],[],[]];

        for( var ciudad in countCities[0] ){

            dataForStatus[0].push({
                y: countCities[0][ciudad],
                city: parseInt(ciudad)+1
            })
            dataForStatus[1].push({
                y: countCities[1][ciudad],
                city: parseInt(ciudad)+1
            })
            dataForStatus[2].push({
                y: countCities[2][ciudad],
                city: parseInt(ciudad)+1
            })
            dataForStatus[3].push({
                y: countCities[3][ciudad],
                city: parseInt(ciudad)+1
            })
            dataForStatus[4].push({
                y: countCities[4][ciudad],
                city: parseInt(ciudad)+1
            })
            dataForStatus[5].push({
                y: countCities[5][ciudad],
                city: parseInt(ciudad)+1
            })
            dataForStatus[6].push({
                y: countCities[6][ciudad],
                city: parseInt(ciudad)+1
            })

        }
        */

        
        var data = [
            {
                name: 'OBRAS RESTRINGIDAS',
                data: countCities[6],
                color: plotsChart.colors[ 7 ]
            },{
                name: 'CON AVANCE FINANCIERO MAYOR AL FÍSICO',
                data: countCities[5],
                color: plotsChart.colors[ 6 ]
            },{
                name: 'NO INICIADAS',
                data: countCities[4],
                color: plotsChart.colors[ 5 ]
            },{
                name: 'RESCINDIDAS',
                data: countCities[3],
                color: plotsChart.colors[ 4 ]
            },{
                name: 'CON RETRASO',
                data: countCities[2],
                color: plotsChart.colors[ 3 ]
            },{
                name: 'EN TIEMPO',
                data: countCities[1],
                color: plotsChart.colors[ 2 ]
            },{
                name: 'TERMINADAS',
                data: countCities[0],
                color: plotsChart.colors[ 1 ]
            }
        ];


        return [data, categories];
    },
    setJsonDeparmentChart: function(resp){
        
        var countDepartments = ['',0,0,0,0,0,0,0,0,0,0,0,0,0]
        var values = [];

        var namesDepartments = [ '',
            'INFRAESTRUCTURA',
            'ICIFED',
            'REA',
            'SADM',
            'SSNL',
            'CODETUR',
            'CODEFRONT',
            'DIF',
            'FIDEPROES',
            'FUNDIDORA',
            'CONALEP',
            'CAMINOS',
            'ISSSTELEON'
        ]


        var finalContractedAmountTotal = 0;
        
        //Cuenta o aumenta el elemento que representa al departamento 
        for(var i in resp){
            var stat = resp[i];
            countDepartments[stat.department_id]++;
            //finalContractedAmountTotal += stat.final_contracted_amount;
        }

        for( var s = 1; s<=13; s++ ){
            if( countDepartments[s] > 0 ){    
                values.push( {
                    name : namesDepartments[s],   
                    y: countDepartments[s],
                    x: s,
                    //color: plotsChart.colors[ s ]
                } )
            }
        }
        
        //var sfcat = finalContractedAmountTotal.toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

        //Establece el titulo de la grafica, se guarda en este objeto y lo obtiene cuando se forman las opciones de la grafica
        plotsChart.chartTitle = 'TOTAL DE OBRAS ' + resp.length + '<br>$' ;
        
        return values;
    },
    optionsChart : function(data){

        /*var numTotales = 0; //Suma todas obras por titulo
        for(var dd in data){
            numTotales += parseInt(data[dd].y);
        }*/
        
            
        var widthWindow = jQuery(window).width()


        if(widthWindow < 600){
            var chartDataLabel = false;                
            var chartShowInLegend = true;
        }else{
            var chartDataLabel = true;
            var chartShowInLegend = true;
        }
        
        var titleTextPev = 'TOTAL DE OBRAS ';


        var options = {
   	        chart: {
   	    	    type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                },
                events: {
                    render: function () {    //Cuando se ocultan una rebanada o barra se actualizan las cantidades del titulo
                        try{
                            if( plotsChart.chart ){
                                var totalProjectsVisible = plotsChart.chart.series[0].total;
                                plotsChart.chartTitle = titleTextPev + totalProjectsVisible;
                                plotsChart.chart.setTitle({ text: plotsChart.chartTitle } )
                            }
                        }
                        catch(e){
                            ;
                        }
                    }
                }
   	    	},
   	    	title: {
   	            text: plotsChart.chartTitle,
                useHTML: true
   	    	},
   	    	tooltip: {
   	            pointFormat: '<b>{point.percentage:.1f} %</b>'
   	    	},
   	    	plotOptions: {
   	    	    pie: {
   	    		    allowPointSelect: true,
   	    		    cursor: 'pointer',
                    depth: 35,
                    showInLegend: chartShowInLegend,
   	                point: {
   	                    events: {
   	                        click: function () {
                                var urlLink = $('#urlLink').val();

                                var department = plotsChart.department;
                                var statusIdNum = parseInt(this.x);
                                var city = plotsChart.city ;
                                var queryString = '?department=' + department;
                                queryString += '&status=' + statusIdNum;
                                queryString += '&city=' + city;

                                queryString += '&year='         + plotsChart.year;
                                queryString += '&provider='     + plotsChart.provider;
                                queryString += '&funding='      + plotsChart.funding;
                                queryString += '&program='      + plotsChart.program;
                                queryString += '&adjudication=' + plotsChart.adjudication;
                                var url = urlLink + queryString ;
                                window.open( url ,"_self");   
   	                        }/*,
                            legendItemClick: function(){
                                console.log(this.series.total);                                
                            }*/
   	                    }
   	                },									    
   	    		    dataLabels: {
   	    		        enabled: chartDataLabel,
   	    		        color: '#000000',
   	    		        connectorColor: '#000000',
   	    		        format: '<b>{point.name}</b>: {point.y:.0f}'
   	                }
   	    	    }
   	        },
            legend: {
                useHTML: true,
                labelFormatter: function () {
                    var a = this.percentage
                    var styleText = ' style="font-family: \'Poppins\', sans-serif; font-weight: 400; margin: 2px 2px;"  '
                    var styleTextS = ' style="font-family: \'Poppins\', sans-serif; font-weight: 400; margin: 2px 0px; font-weight:600;"  '
                    var styleTextN = ' style="font-family: \'Poppins\', sans-serif; font-weight: 400; margin: 2px 2px; font-weight:bold;"  '
                    var nameO = '<span '+ styleTextS +'>' + this.name + '</span>  '
                    var yValue = this.y === null ? 0 : this.y;
                    var pYO = '<span '+ styleTextN +'>' + yValue + '</span> '

                    var decimals = 0;
                    if( (this.percentage*100)%100 == 0 ){ decimals=0; }else if( (this.percentage*10)%10 == 1 ){ decimals=1; }else{decimals=2}

                    var percentO = '<span '+ styleText +'>' + this.percentage.toFixed(decimals) + '%</span>  '

                    if( yValue === 0 ){
                        this.options.color = "#777"
                        this.legendGroup.element.style.display = "none"
                        return null;
                    }
                    
                    var re = this.y === null ? null : percentO + nameO + ': ' + pYO ;
                    return re;
                }
            },
            credits: {
                enabled: false
            },		
   	    	series: [{
   	    	    data: data
   	    	}]
   	    };
        
        return options;
    },
    optionsStackedBar: function(data, categories) {

        var options = {
            chart: {
                type: 'bar'
            },
            title: {
                text: plotsChart.chartTitle
            },
            xAxis: {
                categories: categories,
                labels: {
                    step: 1
                }
            },
            yAxis: {
                stackLabels: {
                    enabled: true,
                    align: 'right',
                    style: {
                        color: '#226',
                        fontWeight: 'bold'
                    },
                    x: 5,
                    y: 17,
                    verticalAlign: 'top',
                    formatter: function () {
                        if(this.total == 0){return '';}
                        return this.total;
                    }
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                },
                bar: {
                    groupPadding:0,
                    //pointWidth:10
                    point: {
   	                    events: {
   	                        click: function () {
                                var city = this.x;
                                //plotsChart.department   = '';
                                plotsChart.check_stage  = '';
                                plotsChart.city         = city+1;
                                plotsChart.year         = '';
                                plotsChart.provider     = '';
                                plotsChart.funding      = '';
                                plotsChart.program      = '';
                                plotsChart.adjudication = '';
                                
                                plotsChart.getData()

   	                        }
   	                    }
   	                }
                }
            },
            series: data
        }
        
        return options;
    },
    colors : [
        '',
        "#EEEE00",
        "#009900",
        "#C70000",
        "#999999",
        "#663399",
        "#EE6600",
        "#79ccec"
    ]
}





/////////////// Listado de obras filtrado por el estatus y la dependencia


var listStatusProjects = {
    
    paginationStar  : 0,
    paginationStep  : 10,
    by              : 'id',
    order           : 'ASC',
    department      : '',
    statusId        : '',
    city            : '',
    year            : '',
    provider        : '',
    funding         : '',
    program         : '',
    adjudication    : '',
    createRow: function( nameProject, cityProject, categoriaProject, dependency, idProject, idStatus, contractNumber, departmentName ){
        var stringTag = `
         <div class="row tableAll"  idProject="`+ idProject +`" dependency="`+ dependency +`"  idStatus="`+ idStatus +`" onclick="listStatusProjects.goToDetail(this)" >

             <div class="col-md-12">
                 <div class="valueee nameObraTable">
                    ` + nameProject + `
                 </div>
                 <div class="row  municipioYCategoria" >
                    <div class="col-md-4">
                         <div class="obracategoriaaa" > <i class="fas fa-file-signature"></i>  </div>
                         <div class="valueee ">
                            ` + contractNumber + `
                         </div>
                     </div>
                    <div class="col-md-2">
                         <div class="obracategoriaaa" ><i class="fas fa-building"></i> </div>
                         <div class="valueee ">
                            ` + departmentName + `
                         </div>
                     </div>
                     <div class="col-md-3">
                         <div class="obramunicipiooo" ><i class="fas fa-map"></i> </div>
                         <div class="valueee ">
                            ` + cityProject + `
                         </div>
                     </div>
                     <div class="col-md-3">
                         <div class="obracategoriaaa" ><i class="fas fa-industry"></i> </div>
                         <div class="valueee ">
                            ` + categoriaProject + `
                         </div>
                     </div>
                  </div>
             </div>
         </div>
         `;
        return stringTag;
    },
    buttonTag : function(init, numValueButton, isActive){
        return '<button initL="'+ init +'" onclick="listStatusProjects.actionPagination(this)" class="button_pag" '+isActive+'>'+ numValueButton +'</button>';
    },
    setList: function(rows, dependency, idStatus){
        var strTagRows = '';
        for (var i in rows) {
            strTagRows += ( listStatusProjects.createRow( rows[i].project_title, 
                                                          citiesNL[ rows[i].city_id ], 
                                                          rows[i].category, 
                                                          dependency, 
                                                          rows[i].project_id,
                                                          idStatus,
                                                          rows[i].contract_number,
                                                          rows[i].department ));
        }
        
        document.getElementById('table-obras').innerHTML = strTagRows;
         
    },
    getDataList: function ( url ){
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                
                var rows = res.data;
                
                //***document.getElementById('titleSecondLink').innerHTML = rows[0].department;

                listStatusProjects.setList( rows, listStatusProjects.department, listStatusProjects.statusId  );
                listStatusProjects.buttons.create( res.count.count );

                $('#headerListProjects').css("borderBottom", plotsChart.colors[listStatusProjects.statusId] + ' 2px solid');
                $('#nameStatusProjectTitle').html(res.count.count + ' Obras ' + $('#checkState'+listStatusProjects.statusId).val());

                $('#waintingAnimation').css("display", "none");
                

            },
            data:  JSON.stringify ({'paginationStart': listStatusProjects.paginationStar ,
                                    'paginationStep' : listStatusProjects.paginationStep ,
                                    'by'             : listStatusProjects.by,
                                    'order'          : listStatusProjects.order,
                                    'department'     : listStatusProjects.department,
                                    'status'         : listStatusProjects.statusId,
                                    'city'           : listStatusProjects.city,
                                    'year'           : listStatusProjects.year,
                                    'provider'       : listStatusProjects.provider,
                                    'funding'        : listStatusProjects.funding,
                                    'program'        : listStatusProjects.program,
                                    'adjudication'   : listStatusProjects.adjudication
                                    })

        }).done(function() {
            $('#waintingAnimation').css("display", "none");
        }) .fail(function() {
            $('#waintingAnimation').css("display", "none");
        }) .always(function() {
            $('#waintingAnimation').css("display", "none");
        }) ;
       
    },
    buttons: {
        tagHTML : function(init, numValueButton, isActive ){
            return '<button initL="'+ init +'"  onclick="listStatusProjects.buttons.action(this)" class="button_pag" '+isActive+'>'+ numValueButton +'</button>';
        },
        create : function( numRegisters ){
            var numOfButtons = Math.ceil( numRegisters/listStatusProjects.paginationStep ) ;
            
           // if(numOfButtons <= 1 ){return ;}

            var strAllButtons = '';
            for(var b=0; b< numOfButtons ; b++ ){
                var start = b * listStatusProjects.paginationStep ;
                var numLabelButton = b + 1;
                var isActive = b==0? 'active' : '';
                strAllButtons += listStatusProjects.buttons.tagHTML( start, numLabelButton, isActive)
            }
            $('#buttons_pagination').html(strAllButtons);
        },
        action: function( thisButton ){

            listStatusProjects.paginationStar = parseInt( thisButton.getAttribute('initL') ) ;
        
            $('#waintingAnimation').css("display", "block");
            
            var url = '/projects_follow_ups';

            listStatusProjects.getDataList( url )


            //Behavior button
            $(".button_pag").removeAttr("active");
            $( thisButton ).attr('active','')

        }
    },
    goToDetail : function ( thisTag ){
        var idObra = thisTag.getAttribute("idProject");
        var urlLink = document.getElementById('urlLink').value;
        var url = urlLink + idObra ;
        window.open( url ,"_self");   
    },
    initList: function(){
        
        this.department     = document.getElementById('dependencyId').value;
        this.statusId       = document.getElementById('statusId').value;
        this.city           = document.getElementById('cityId').value;
        this.year           = document.getElementById('yearId').value;
        this.provider       = document.getElementById('providerId').value;
        this.funding        = document.getElementById('fundingId').value;
        this.program        = document.getElementById('programId').value;
        this.adjudication   = document.getElementById('adjudicationId').value;


        $('#waintingAnimation').css("display", "block");

        var url = '/projects_follow_ups';

        listStatusProjects.getDataList( url )

    }
}









var projectDetail = {
    init: function(){
        var projectId = document.getElementById('projectId').value;
        var catalog = document.getElementById('catalogName').value;
        var url = catalog + projectId;
        


        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                
                var projectFiels = res.data[0];
                var contractFiels = res.contract;

                document.getElementById('nameDepartment').innerHTML = projectFiels.project_title ;

                document.getElementById("municipioField").innerHTML                             = citiesNL[projectFiels.city_id]            ;
                document.getElementById("categoriaField").innerHTML                             = projectFiels.category                            ;
                document.getElementById("empresaField").innerHTML                               = res.provider.title       ;
                document.getElementById("monto_contratoField").innerHTML                        = contractFiels.final_contracted_amount       ;
                document.getElementById("termino_obra_segun_contratoField").innerHTML           = datesGENL.formatOrder(contractFiels.ending);
                document.getElementById("monto_contrato_finalField").innerHTML                  = contractFiels.final_contracted_amount       ;
                document.getElementById("numero_contratoField").innerHTML                       = contractFiels.number       ;
                document.getElementById("inicio_obra_segun_contratoField").innerHTML            = datesGENL.formatOrder(contractFiels.kickoff);
                document.getElementById("fecha_pago_anticipoField").innerHTML                   = datesGENL.formatOrderTime(contractFiels.down_payment);
                document.getElementById("monto_anticipoField").innerHTML                        = contractFiels.down_payment_amount       ;
                document.getElementById("anticipo_pendiente_amortizarField").innerHTML          = contractFiels.outstanding_down_payment       ;
                document.getElementById("convenio_ampliacion_economicoField").innerHTML         = contractFiels.ext_agreement_amount       ;
                document.getElementById("fecha_convenio_ampliacion_obraField").innerHTML        = datesGENL.formatOrder(contractFiels.ext_agreement);
                document.getElementById("total_pagadoField").innerHTML                          = contractFiels.total_amount_paid       ;
                document.getElementById("fecha_de_verificacion_contraloriaField").innerHTML     = projectFiels.check_date    ;
                document.getElementById("estatus_verificado_por_la_contraloriaField").innerHTML = $('#checkState' + projectFiels.check_stage).val() ;
                //document.getElementById("entregada_al_beneficiarioField").innerHTML             = valueEntregada_al_beneficiario            ;

                

                var financialAvance = projectFiels.financial_advance + '%';
                document.getElementById('avance_financieroField').innerHTML = financialAvance ;
                $("#avance_financieroField").css('width', financialAvance );
                
                var verifiedProgress = projectFiels.verified_progress + '%';
                document.getElementById('avance_fisico_verificado_contraloriaField').innerHTML = verifiedProgress ;
                $("#avance_fisico_verificado_contraloriaField").css('width', verifiedProgress );

                
                var urlBeforeImage = document.getElementById('pathUrl').value;
                var imgsPaths = projectFiels.img_paths.split('|');

                var strWhitTagImages = '';
                for( var i in imgsPaths ){
                    if( imgsPaths[i] ){
                        strWhitTagImages += '<img src="'+ urlBeforeImage + imgsPaths[i] + '" class="imagesInfoDetail">'
                    }
                }
                document.getElementById('registro_fotograficoField').innerHTML = strWhitTagImages;


                var map = L.map('map').setView([25.6761633,-100.2952764], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                L.marker([25.6761633,-100.2952764]).addTo(map)
                setTimeout(function(){map._onResize()}, 1000);


                projectDetail.setTitlesLinks( projectFiels );


                $("#monto_anticipoField").digits();
                $("#monto_contratoField").digits();
                $("#convenio_ampliacion_economicoField").digits();
                $("#monto_contrato_finalField").digits();
                $("#total_pagadoField").digits();
                $("#anticipo_pendiente_amortizarField").digits();

                document.getElementById('waintingAnimation').style.display = "none";
                

            }

        }).done(function() { document.getElementById('waintingAnimation').style.display = "none";
        }) .fail(function() { document.getElementById('waintingAnimation').style.display = "none";
        }) .always(function() { document.getElementById('waintingAnimation').style.display = "none"; }) ;

    },
    setTitlesLinks: function(data){
        
        var pathPagePreg = document.getElementById('pagePrev').value;
        var department   = data.department_id;
        var check_status = data.check_stage;

        document.getElementById('titleSecondLink').innerHTML = data.department;
        document.getElementById('titleSecondLink').setAttribute('href', pathPagePreg + department + '/' + check_status );
    }
}











var notifyRegisters = {
    set: function( showMessage, message ){
        localStorage.setItem("showMessage", showMessage );
        localStorage.setItem("message", message );
    },
    show: function(){
        if ( localStorage.getItem('showMessage') == 'true' ){
            var message = localStorage.getItem('message');
            $.notify(
                message, 
                { position:"bottom right"}
            );
        }
        localStorage.setItem("showMessage", 'false' );
        localStorage.setItem("message", '' );
    }
}


var citiesNL = [
'',
'Abasolo',
'Agualeguas',
'Los Aldamas',
'Allende',
'Anahuac',
'Apodaca',
'Aramberri',
'Bustamante',
'Cadereyta Jimenez',
'Carmen',
'Cerralvo',
'Cienega de Flores',
'China',
'Dr. Arroyo',
'Dr. Coss',
'Dr. Gonzalez',
'Galeana',
'Garcia',
'San Pedro Garza Garcia',
'Gral. Bravo',
'Gral. Escobedo',
'Gral. Teran',
'Gral. Trevi',
'Gral. Zaragoza',
'Gral. Zuazua',
'Guadalupe',
'Los Herreras',
'Higueras',
'Hualahuises',
'Iturbide',
'Juarez',
'Lampazos de Naranjo',
'Linares',
'Marin',
'Melchor Ocampo',
'Mier y Noriega',
'Mina',
'Montemorelos',
'Monterrey',
'Paras',
'Pesqueria',
'Los Ramones',
'Rayones',
'Sabinas Hidalgo',
'Salinas Victoria',
'San Nicolas de los Garza',
'Hidalgo',
'Santa Catarina',
'Santiago',
'Vallecillo',
'Villaldama'
]

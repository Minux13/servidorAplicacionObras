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
                }else if( data.status_code >=400 && data.status_code < 600 ) {
                    var message = POSTRegister.messages[msj].fail;
                }else {
                    var message = POSTRegister.messages[msj].fail;
                }

                $.notify(
                    message, 
                    { position:"bottom right"}
                );
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
                }else if( data.status_code >=400 && data.status_code < 600 ) {
                    var message = DELETERegisters.messages.fail;
                }else {
                    var message = DELETERegisters.messages.fail;
                }

                $.notify(
                    message, 
                    { position:"bottom right" }
                );
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
    'intCent' : function( val ){        //Entero entre el 0 y 100
        if( val == '' ){return [false, 'Ingresa un número válido'];}
        else if( isNaN( val ) ){return [false, 'Ingresa un número válido'];}
        else if( parseFloat(val)%1 != 0 ){return [false, 'Ingresa un entero'];}
        else if( parseFloat(val) > 100 ){return [false, 'Ingresa un número menor de 100'];}
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
        console.log(catalogo);
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
                console.log(data);
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
                        $.notify(
                            POSTFollowUps.messageForShow, 
                            { position:"bottom right"}
                        );

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

                            $.notify(
                                POSTFollowUps.messageForShow, 
                                { position:"bottom right"}
                            );

                        }
                    });

                }else {
                    POSTFollowUps.messageForShow = POSTFollowUps.messages[msj].fail;
                    $.notify(
                        POSTFollowUps.messageForShow, 
                        { position:"bottom right"}
                    );
                }

            },
            data: dataJson
        });               
    }
} 





var imagesFollowUps = {
    tagImg : function(url){
        
        var tag = `
            <img src="`+ url +`" style="width:100%; height: auto;" >
        `;
        return tag;
    },
    init : function(){
        var images = document.getElementById("img_paths").value;
        var pathUrl = document.getElementById("pathUrl").value;

        var imagesArr = images.split(',');

        var strImages = "";
        for(var i in imagesArr){
            var urlImage = pathUrl + imagesArr[i];
            strImages += imagesFollowUps.tagImg( urlImage );
        }
        
        if( images ){
            document.getElementById('containerImagesFollowUp').innerHTML= strImages;
        }
    }
}





/////// Graphics

var plotsChart = {
    init : function(){
        var idDependency = document.getElementById('dependencySelect').value;
        plotsChart.getData(idDependency)
    },
    getData : function (idDependency ){
        
        document.getElementById('waintingAnimation').style.display = "block";

        $.ajax({
            url: '/graphics',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                
                var values = plotsChart.setJsonChart(res.data);
                
                var options = plotsChart.optionsChart(values)

                document.getElementById('waintingAnimation').style.display = "none";
                
                chart = Highcharts.chart('genl-pie-chart', options);
   	            chart.series[0].setData(values);

            },

            data:  JSON.stringify ({'dependency': idDependency })

        }).done(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        }) .fail(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        }) .always(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        }) ;

    },
    setJsonChart : function( resp ){
        var values = [];
        for(var i in resp){
            var stat = resp[i];
            values.push( {
                name : stat.stage,   
                y: stat.count,
                color: plotsChart.colors[ stat.id ]
            } )
        }
        
        return values;
    },
    optionsChart : function(data){

        var numTotales = 0; //Sum of all obras for titulo
        for(var dd in data){
            numTotales += parseInt(data[dd].y);
        }
        
            
        var widthWindow = jQuery(window).width()


        if(widthWindow < 600){
            var chartDataLabel = false;                
            var chartShowInLegend = true;
        }else{
            var chartDataLabel = true;
            var chartShowInLegend = false;
        }
        


        var options = {
   	        chart: {
   	    	    type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                },
                /*events: {
                    render: function () {
                        var enableDataLabel = setLegendsChart(data);
                        console.log(this);
                        this.series[0].plotOptions.dataLabels.enabled = enableDataLabel
                    }
                } */   
   	    	},
   	    	title: {
   	            text: 'TOTAL DE OBRAS ' + numTotales
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
                                var dependency= $('#dependencySelect').val();
                                var urlLink = $('#urlLink').val();
                                var url = urlLink + dependency + "/" + this.x + 1;
                                window.open( url ,"_self");   
   	                        },
                            legendItemClick: function(){
                                this.slice(null);
                                return false;
                            }
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
                    console.log(this);
                    bb=this
                    var a = this.percentage
                    var styleText = ' style="font-family: \'Poppins\', sans-serif; font-weight: 400; margin: 2px 2px;"  '
                    var nameO = '<span '+ styleText +'>' + this.name + '</span>    </tspan>'
                    var yValue = this.y === null ? 0 : this.y;
                    var pYO = '<span '+ styleText +'>' + yValue + '</span>  </tspan>'

                    var decimals = 0;
                    if( (this.percentage*100)%100 == 0 ){ decimals=0; }else if( (this.percentage*10)%10 == 1 ){ decimals=1; }else{decimals=2}

                    var percentO = '<span '+ styleText +'>' + this.percentage.toFixed(decimals) + '%</span>  '

                    if( yValue === 0 ){
                        this.options.color = "#777"
                        this.legendGroup.element.style.display = "none"
                        return null;
                    }
                    
                    var re = this.y === null ? null : pYO + nameO +  percentO ;
                    return re;
                }
            },
            credits: {
                enabled: false
            },		
   	    	series: [{
   	    	    data: []
   	    	}]
   	    };
        
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





/////////////// List Status Projects by Dependency


var listStatusProjects = {
    
    createRow: function(numProject, nameProject, cityProject, categoriaProject, dependency, idProject, idStatus ){
        var stringTag = `
         <div class="row tableAll"  idProject="`+ idProject +`" dependency="`+ dependency +`"  idStatus="`+ idStatus +`" onclick="listProjects.goToDetail(this)" >

             <div class="col-md-12">
                 <div class="valueee nameObraTable">
                    ` + nameProject + `
                 </div>
                 <div class="row  municipioYCategoria" >
                     <div class="col-md-6">
                         <div class="obramunicipiooo" ><i class="fas fa-map"></i> </div>
                         <div class="valueee ">
                            ` + cityProject + `
                         </div>
                     </div>
                     <div class="col-md-6">
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
    namesAsociatesProjects : ['',
        'INFRAESTRUCTURA',
        'ICIFED',
        'REA',
        'SADM',
        'SSNL',
        'CODETUR',
        'CODEFRONT',
        'FIDEPROES',
        'DIF',
        'FUNDIDORA',
        'CONALEP',
        'CAMINOS',
        'ISSSTELEON',
        'Total'
    ],
    sizeRowsPagination : 10,
    arrayTagsHTML : [],
    buttonTag : function(init, numValueButton, isActive){
        return '<button initL="'+ init +'" onclick="listProjects.actionPagination(this)" class="button_pag" '+isActive+'>'+ numValueButton +'</button>';
    },
    createAllButtons: function(){   //It runs only once when the buttons are created

        var numProjects = listStatusProjects.arrayTagsHTML.length;
        var numProjecstShow = listStatusProjects.sizeRowsPagination;
        var numButtons = Math.ceil(numProjects/numProjecstShow);
        
        var strAllButtons = '';
        for(var b=0; b<numButtons; b++ ){
            var init = b * listStatusProjects.sizeRowsPagination;
            var numValueButton = b + 1;
            var isActive = b==0? 'active' : '';
            strAllButtons += listStatusProjects.buttonTag( init, numValueButton, isActive )
        }
        document.getElementById('buttons_pagination').innerHTML = strAllButtons;
        
    },
    actionPagination: function( thisButton ){

        //List of projects
        var init =  parseInt( thisButton.getAttribute('initL') ) ;
        listProjects.setRowsPagination( init )
        
        //Behavior button
        $(".button_pag").removeAttr("active");
        $( thisButton ).attr('active','')

    },
    setRowsPagination: function(init){  //Sets and show the list of projects visible
        var size = listStatusProjects.sizeRowsPagination;
        var stringList = '';
        for( var i=init; i<(init+size); i++ ){
            stringList += listStatusProjects.arrayTagsHTML[i] ? listStatusProjects.arrayTagsHTML[i] : '' ;
        }
        document.getElementById('table-obras').innerHTML = stringList;
    },
    initList: function (  ){
        var dependency = document.getElementById('dependencyId').value;
        var idStatus = document.getElementById('statusId').value;

        document.getElementById('waintingAnimation').style.display = "block";

        var url = '/projects_follow_ups/'+ dependency +'/' + idStatus;



        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                
                var rows = res.data;
                console.log(res);
                for (var i in rows) {
                    listStatusProjects.arrayTagsHTML.push( listStatusProjects.createRow( i+1, 
                                                                             rows[i].project_title, 
                                                                             citiesNL[ rows[i].city_id ], 
                                                                             rows[i].category, 
                                                                             dependency, 
                                                                             rows[i].project_id,
                                                                             idStatus ));
                }
                
                listStatusProjects.setRowsPagination( 0 );
                listStatusProjects.createAllButtons();

                document.getElementById('waintingAnimation').style.display = "none";
                

            }

            //data:  JSON.stringify ({'dependency': idDependency })

        }).done(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        }) .fail(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        }) .always(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        }) ;
       


        return 

        $.getJSON( urlJson , function(data) {

            var rows = jsonPath(data, "$.[?( @.id_estado_obra=='"+idStatus+"')]");

            //Create array of elemts HTML 
            for (var i=0;i<rows.length;i++) {
                listProjects.arrayTagsHTML.push( listProjects.createRow( i+1, 
                                                                         rows[i].obra, 
                                                                         rows[i].municipio, 
                                                                         rows[i].categoria, 
                                                                         dependency, 
                                                                         rows[i].id_obra,
                                                                         idStatus ));
            }
            
            listProjects.setRowsPagination( 0 );
            listProjects.createAllButtons();


            document.getElementById('titleDepartment').innerHTML = listProjects.namesAsociatesProjects[dependency]
            document.getElementById('nameDepartment').innerHTML = listProjects.namesAsociatesProjects[dependency]
            
            document.getElementById('titleFirstLink').setAttribute('href','./');


            var styleTitulo = 'color:' + statusProjectsSettings[idStatus].color +'; background:'+ statusProjectsSettings[idStatus].background + ';';
            document.getElementById('headerListProjects').style.color = statusProjectsSettings[idStatus].color;
            document.getElementById('headerListProjects').style.background = statusProjectsSettings[idStatus].background;
            document.getElementById('statusProjectName').innerHTML = statusProjectsSettings[idStatus].name ;


            //Set and save this url
            listProjects.thisHashUrl = dependency + ',' + idStatus;
        
        }).done(function() { ; })
          .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + " // " + error;
            console.log( "Request Failed: " + err );
            console.log(jqxhr);
        })
        .always(function() {
            document.getElementById('waintingAnimation').style.display = "none";
        })
    },
    thisHashUrl : '',
    goToDetail : function ( thisTag ){

        var idObra = thisTag.getAttribute("idProject");
        var dependency = thisTag.getAttribute("dependency");
        var idStatus = thisTag.getAttribute("idStatus");
        var url = "./info2.html#" + dependency + ',' + idStatus + ',' + idObra  ;
        window.open( url ,"_self");   
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

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
    'intCent' : function( val ){
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
        console.log(dat);
        var dateArr = dat.split('-')
        return dateArr[2] +'-'+ dateArr[1] +'-' + dateArr[0];
    }
}





















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
                console.log(res);
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
    }
};




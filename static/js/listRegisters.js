var listRegisters = {
    paginationStar : 0,
    paginationStep : 10,
    numberOfButtons: 1,     //Mock, se actualiza cuando se reciben los datos ajax
    isStartPage : true,
    goToRegister : function(thisElement){
        var idRegister = thisElement.getAttribute('idRegister');
        var catalog = document.getElementById('catalogName').value;
        var url = '/'+ catalog +'/edit/' + idRegister;
        window.open( url ,"_self"); 
    },
    getDataTable : function( start, step, catalog, createBtns ){
         $.ajax({
            url: catalog,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                ////////////Set buttons and table
                
                var numAllRegisters = 10;
                
                if( createBtns ){
                    setTag.createButtons( numAllRegisters );
                    listRegisters.isStartPage = false;
                }

                setTag.setTable(res.data)
        
               document.getElementById('waintingAnimation').style.display = "none";

            },

            data:  JSON.stringify ({'paginationStart':  start,
                                    'paginationStep': step,
                                    'by'            : 'id',
                                    'order'         : 'ASC'
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

        //Set list
        var init =  parseInt( thisButton.getAttribute('initL') ) ;
        listRegisters.getDataTable( init, listRegisters.paginationStep )
        
        //Behavior button
        $(".button_pag").removeAttr("active");
        $( thisButton ).attr('active','')

    },
    init : function(){
        document.getElementById('waintingAnimation').style.display = "block";
        
        var catalog = document.getElementById('catalogName').value;
        listRegisters.getDataTable( listRegisters.paginationStar, listRegisters.paginationStep, catalog, true );
    }
};

          


             
function sendPOSTRegister( url, dataJson ){
     $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            $.notify(
                "El registro fue agregado", 
                { position:"bottom right"}
            );
        },
        data: dataJson
    });               
} 




var validate={
    'fields' : function( dataJson ){
        
        //Clean
        for(var f in dataJson){
            var thisField = dataJson[f];
            var idField = thisField.id;
            
            document.getElementById( idField ).style.border = "solid 1px #606";
            document.getElementById( 'for_' + idField ).style.display = "none";

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
                send = false
            }
        }

        return send;
    },
    'text' : function( val ){
        if( val == '' ){return [false, 'Ingresa este campo'];}
        else{return [true];}
    }
}

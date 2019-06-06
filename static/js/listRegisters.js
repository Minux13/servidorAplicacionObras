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
                
                console.log(res);
                
                if( createBtns ){
                    setTag.createButtons( numAllRegisters );
                    listRegisters.isStartPage = false;
                }

                setTag.setTable(res.data)
            },

            data:  JSON.stringify ({'paginationStart':  start,
                                    'paginationStep': step,
                                    'by'            : 'id',
                                    'order'         : 'ASC'
                                    })
        });
       
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
        var catalog = document.getElementById('catalogName').value;
        listRegisters.getDataTable( listRegisters.paginationStar, listRegisters.paginationStep, catalog, true );
    }
};

            

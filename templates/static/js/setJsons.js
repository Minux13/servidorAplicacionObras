var setJsonsHC = {
    Chart : function( resp ){
        var countStages = ['',0,0,0,0,0,0,0];
        var countStagesAmount = [0,0,0,0,0,0,0,0];  
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


        for(var i in resp){
            var stat = resp[i];
            countStages[stat.check_stage]++;
            countStagesAmount[ stat.check_stage ] += stat.final_contracted_amount;
        }


        var finalContractedAmountTotal =  countStagesAmount.reduce(function(total, sum){return total + sum;}) ;

        for( var s = 1; s<=7; s++ ){
            if( countStages[s] > 0 ){    
                values.push( {
                    name : namesStages[s],   
                    y: countStages[s],
                    x: s,
                    amount: countStagesAmount[s],
                    color: colorStatus[ s ]
                } )
            }
        }
        
        
        plotsChart.chartTitle.obras = resp.length;
        plotsChart.chartTitle.amount = finalContractedAmountTotal;
        
        return values;
    },
    dates: {
        byAmount: function( jsonResponse ){
        
            //[Estatus][Anio]  
            var countField = [
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
            ];
            
            var countFieldAmount = [
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
            ];
            
            var countFieldAmountByCity = [0,0,0,0,0] ;  
            
            var categories        = ['2015', '2016', '2017', '2018', '2019'];
            
            //Por cada obra aumenta en 1 el elemento countField[estatus][ciudad]
            for(var i in jsonResponse){
                var obra = jsonResponse[i];
                var year = parseInt( obra.contract_kickoff );
                if( year >= 2015 && year <= 2019 ){
                    var yearArray = year - 2015;
                    countField[obra.check_stage - 1][ yearArray ]++;
                    countFieldAmount[obra.check_stage - 1][ yearArray ] += obra.final_contracted_amount;
                    countFieldAmountByCity[ yearArray ] += obra.final_contracted_amount;
                }
            }

            var finalContractedAmountTotal =  countFieldAmountByCity.reduce(function(total, sum){return total + sum;}) ;
            
            var dataForStatus = [[],[],[],[],[],[],[]];
            for( var field in countField[0] ){
            
                dataForStatus[0].push({
                    y: countFieldAmount[0][field],
                    amount: countField[0][field],
                })
                dataForStatus[1].push({
                    y: countFieldAmount[1][field],
                    amount: countField[1][field],
                })
                dataForStatus[2].push({
                    y: countFieldAmount[2][field],
                    amount: countField[2][field],
                })
                dataForStatus[3].push({
                    y: countFieldAmount[3][field],
                    amount: countField[3][field],
                })
                dataForStatus[4].push({
                    y: countFieldAmount[4][field],
                    amount: countField[4][field],
                })
                dataForStatus[5].push({
                    y: countFieldAmount[5][field],
                    amount: countField[5][field],
                })
                dataForStatus[6].push({
                    y: countFieldAmount[6][field],
                    amount: countField[6][field],
                })
            
            }
            
            
            var data = [
                {
                    name: 'OBRAS RESTRINGIDAS',
                    data: dataForStatus[6],
                    color: colorStatus[ 7 ]
                },{
                    name: 'CON AVANCE FINANCIERO MAYOR AL FÍSICO',
                    data: dataForStatus[5],
                    color: colorStatus[ 6 ]
                },{
                    name: 'NO INICIADAS',
                    data: dataForStatus[4],
                    color: colorStatus[ 5 ]
                },{
                    name: 'RESCINDIDAS',
                    data: dataForStatus[3],
                    color: colorStatus[ 4 ]
                },{
                    name: 'CON RETRASO',
                    data: dataForStatus[2],
                    color: colorStatus[ 3 ]
                },{
                    name: 'EN TIEMPO',
                    data: dataForStatus[1],
                    color: colorStatus[ 2 ]
                },{
                    name: 'TERMINADAS',
                    data: dataForStatus[0],
                    color: colorStatus[ 1 ]
                }
            ];
            
            plotsChart.chartTitle.obras = jsonResponse.length;
            plotsChart.chartTitle.amount = finalContractedAmountTotal;
            
            return [data, categories, countFieldAmountByCity];
        }
    },
    departments: {
        byProjects: function( jsonResponse ){
        
            //[Estatus][Dependencia]  
            var countField = [
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
            ];
            
            var countFieldAmount = [
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
            ];
            
            var countFieldAmountByCity = [0,0,0,0,0,0,0,0,0,0,0,0,0] ;  
            
            var categories        = departmentsObras.slice(1);
            
            //Por cada obra aumenta en 1 el elemento countField[estatus][ciudad]
            for(var i in jsonResponse){
                var obra = jsonResponse[i];
                countField[obra.check_stage - 1][obra['department_id'] - 1]++;
                countFieldAmount[obra.check_stage - 1][obra['department_id'] - 1] += obra.final_contracted_amount;
                countFieldAmountByCity[obra['department_id'] - 1] += obra.final_contracted_amount;
            }
            
            var finalContractedAmountTotal =  countFieldAmountByCity.reduce(function(total, sum){return total + sum;}) ;
            
            
            var dataForStatus = [[],[],[],[],[],[],[]];
            for( var field in countField[0] ){
            
                dataForStatus[0].push({
                    y: countField[0][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[0][field]
                })
                dataForStatus[1].push({
                    y: countField[1][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[1][field]
                })
                dataForStatus[2].push({
                    y: countField[2][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[2][field]
                })
                dataForStatus[3].push({
                    y: countField[3][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[3][field]
                })
                dataForStatus[4].push({
                    y: countField[4][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[4][field]
                })
                dataForStatus[5].push({
                    y: countField[5][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[5][field]
                })
                dataForStatus[6].push({
                    y: countField[6][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[6][field]
                })
            
            }
            
            
            var data = [
                {
                    name: 'OBRAS RESTRINGIDAS',
                    data: dataForStatus[6],
                    color: colorStatus[ 7 ]
                },{
                    name: 'CON AVANCE FINANCIERO MAYOR AL FÍSICO',
                    data: dataForStatus[5],
                    color: colorStatus[ 6 ]
                },{
                    name: 'NO INICIADAS',
                    data: dataForStatus[4],
                    color: colorStatus[ 5 ]
                },{
                    name: 'RESCINDIDAS',
                    data: dataForStatus[3],
                    color: colorStatus[ 4 ]
                },{
                    name: 'CON RETRASO',
                    data: dataForStatus[2],
                    color: colorStatus[ 3 ]
                },{
                    name: 'EN TIEMPO',
                    data: dataForStatus[1],
                    color: colorStatus[ 2 ]
                },{
                    name: 'TERMINADAS',
                    data: dataForStatus[0],
                    color: colorStatus[ 1 ]
                }
            ];
            
            plotsChart.chartTitle.obras = jsonResponse.length;
            plotsChart.chartTitle.amount = finalContractedAmountTotal;
            
            return [data, categories, countFieldAmountByCity];
        },
        byAmount: function( jsonResponse ){
        
            //[Estatus][Dependencia]  
            var countField = [
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
            ];
            
            var countFieldAmount = [
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0],
            ];
            
            var countFieldAmountByCity = [0,0,0,0,0,0,0,0,0,0,0,0,0] ;  
            
            var categories        = departmentsObras.slice(1);
            
            //Por cada obra aumenta en 1 el elemento countField[estatus][ciudad]
            for(var i in jsonResponse){
                var obra = jsonResponse[i];
                countField[obra.check_stage - 1][obra['department_id'] - 1]++;
                countFieldAmount[obra.check_stage - 1][obra['department_id'] - 1] += obra.final_contracted_amount;
                countFieldAmountByCity[obra['department_id'] - 1] += obra.final_contracted_amount;
            }
            
            var finalContractedAmountTotal =  countFieldAmountByCity.reduce(function(total, sum){return total + sum;}) ;
            
            
            var dataForStatus = [[],[],[],[],[],[],[]];
            for( var field in countField[0] ){
            
                dataForStatus[0].push({
                    y: countFieldAmount[0][field],
                    amount: countField[0][field],
                    idFieldDB: parseInt(field)+1,
                })
                dataForStatus[1].push({
                    y: countFieldAmount[1][field],
                    amount: countField[1][field],
                    idFieldDB: parseInt(field)+1,
                })
                dataForStatus[2].push({
                    y: countFieldAmount[2][field],
                    amount: countField[2][field],
                    idFieldDB: parseInt(field)+1,
                })
                dataForStatus[3].push({
                    y: countFieldAmount[3][field],
                    amount: countField[3][field],
                    idFieldDB: parseInt(field)+1,
                })
                dataForStatus[4].push({
                    y: countFieldAmount[4][field],
                    amount: countField[4][field],
                    idFieldDB: parseInt(field)+1,
                })
                dataForStatus[5].push({
                    y: countFieldAmount[5][field],
                    amount: countField[5][field],
                    idFieldDB: parseInt(field)+1,
                })
                dataForStatus[6].push({
                    y: countFieldAmount[6][field],
                    amount: countField[6][field],
                    idFieldDB: parseInt(field)+1,
                })
            
            }
            
            
            var data = [
                {
                    name: 'OBRAS RESTRINGIDAS',
                    data: dataForStatus[6],
                    color: colorStatus[ 7 ]
                },{
                    name: 'CON AVANCE FINANCIERO MAYOR AL FÍSICO',
                    data: dataForStatus[5],
                    color: colorStatus[ 6 ]
                },{
                    name: 'NO INICIADAS',
                    data: dataForStatus[4],
                    color: colorStatus[ 5 ]
                },{
                    name: 'RESCINDIDAS',
                    data: dataForStatus[3],
                    color: colorStatus[ 4 ]
                },{
                    name: 'CON RETRASO',
                    data: dataForStatus[2],
                    color: colorStatus[ 3 ]
                },{
                    name: 'EN TIEMPO',
                    data: dataForStatus[1],
                    color: colorStatus[ 2 ]
                },{
                    name: 'TERMINADAS',
                    data: dataForStatus[0],
                    color: colorStatus[ 1 ]
                }
            ];
            
            plotsChart.chartTitle.obras = jsonResponse.length;
            plotsChart.chartTitle.amount = finalContractedAmountTotal;
            
            return [data, categories, countFieldAmountByCity];
        }
    },
    funding: {
        byAmount: function( jsonResponse ){
        
            //[Estatus][Fondo]  
            var countField       = [ [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0] ];
            var countFieldAmount = [ [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0] ];
            
            var countFieldAmountByFunding = [0,0] ;  
            
            var categories        = ['Federal','Estatal'];

            aa = '['
            
            //Por cada obra aumenta en 1 el elemento countField[estatus][fondo]
            for(var i in jsonResponse){
                var obra = jsonResponse[i];
                if(obra.funding_id){
                    countField[obra.check_stage - 1][obra['funding_id'] - 1]++;
                    countFieldAmount[obra.check_stage - 1][obra['funding_id'] - 1] += obra.final_contracted_amount;
                    countFieldAmountByFunding[obra['funding_id'] - 1] += obra.final_contracted_amount;
                }else{
                    aa += '\n{Obra:"'+ obra.project_title +'", Contrato: "'+ obra.contract_title +'", Numero_de_Contrato: "'+ obra.contract_number +'"},'
                    console.log(obra);
                }
            }
            aa += '\n]'
            var finalContractedAmountTotal =  countFieldAmountByFunding.reduce(function(total, sum){return total + sum;}) ;
            
            
            var dataForStatus = [[],[],[],[],[],[],[]];
            for( var field in countField[0] ){
            
                dataForStatus[0].push({
                    amount: countField[0][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[0][field]
                })
                dataForStatus[1].push({
                    amount: countField[1][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[1][field]
                })
                dataForStatus[2].push({
                    amount: countField[2][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[2][field]
                })
                dataForStatus[3].push({
                    amount: countField[3][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[3][field]
                })
                dataForStatus[4].push({
                    amount: countField[4][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[4][field]
                })
                dataForStatus[5].push({
                    amount: countField[5][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[5][field]
                })
                dataForStatus[6].push({
                    amount: countField[6][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[6][field]
                })
            
            }
            
            
            var data = [
                {
                    name: 'OBRAS RESTRINGIDAS',
                    data: dataForStatus[6],
                    color: colorStatus[ 7 ]
                },{
                    name: 'CON AVANCE FINANCIERO MAYOR AL FÍSICO',
                    data: dataForStatus[5],
                    color: colorStatus[ 6 ]
                },{
                    name: 'NO INICIADAS',
                    data: dataForStatus[4],
                    color: colorStatus[ 5 ]
                },{
                    name: 'RESCINDIDAS',
                    data: dataForStatus[3],
                    color: colorStatus[ 4 ]
                },{
                    name: 'CON RETRASO',
                    data: dataForStatus[2],
                    color: colorStatus[ 3 ]
                },{
                    name: 'EN TIEMPO',
                    data: dataForStatus[1],
                    color: colorStatus[ 2 ]
                },{
                    name: 'TERMINADAS',
                    data: dataForStatus[0],
                    color: colorStatus[ 1 ]
                }
            ];
            
            plotsChart.chartTitle.obras = jsonResponse.length;
            plotsChart.chartTitle.amount = finalContractedAmountTotal;
            
            return [data, categories, countFieldAmountByFunding];
       },
       byProjects: function( jsonResponse ){
        
            //[Estatus][Fondo]  
            var countField       = [ [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0] ];
            var countFieldAmount = [ [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0] ];
            
            var countFieldAmountByFunding = [0,0] ;  
            
            var categories        = ['Federal','Estatal'];
            
            //Por cada obra aumenta en 1 el elemento countField[estatus][fondo]
            for(var i in jsonResponse){
                var obra = jsonResponse[i];
                if(obra.funding_id){
                    countField[obra.check_stage - 1][obra['funding_id'] - 1]++;
                    countFieldAmount[obra.check_stage - 1][obra['funding_id'] - 1] += obra.final_contracted_amount;
                    countFieldAmountByFunding[obra['funding_id'] - 1] += obra.final_contracted_amount;
                }
            }
            
            var finalContractedAmountTotal =  countFieldAmountByFunding.reduce(function(total, sum){return total + sum;}) ;
            
            
            var dataForStatus = [[],[],[],[],[],[],[]];
            for( var field in countField[0] ){
            
                dataForStatus[0].push({
                    y: countField[0][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[0][field]
                })
                dataForStatus[1].push({
                    y: countField[1][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[1][field]
                })
                dataForStatus[2].push({
                    y: countField[2][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[2][field]
                })
                dataForStatus[3].push({
                    y: countField[3][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[3][field]
                })
                dataForStatus[4].push({
                    y: countField[4][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[4][field]
                })
                dataForStatus[5].push({
                    y: countField[5][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[5][field]
                })
                dataForStatus[6].push({
                    y: countField[6][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[6][field]
                })
            
            }
            
            
            var data = [
                {
                    name: 'OBRAS RESTRINGIDAS',
                    data: dataForStatus[6],
                    color: colorStatus[ 7 ]
                },{
                    name: 'CON AVANCE FINANCIERO MAYOR AL FÍSICO',
                    data: dataForStatus[5],
                    color: colorStatus[ 6 ]
                },{
                    name: 'NO INICIADAS',
                    data: dataForStatus[4],
                    color: colorStatus[ 5 ]
                },{
                    name: 'RESCINDIDAS',
                    data: dataForStatus[3],
                    color: colorStatus[ 4 ]
                },{
                    name: 'CON RETRASO',
                    data: dataForStatus[2],
                    color: colorStatus[ 3 ]
                },{
                    name: 'EN TIEMPO',
                    data: dataForStatus[1],
                    color: colorStatus[ 2 ]
                },{
                    name: 'TERMINADAS',
                    data: dataForStatus[0],
                    color: colorStatus[ 1 ]
                }
            ];
            
            plotsChart.chartTitle.obras = jsonResponse.length;
            plotsChart.chartTitle.amount = finalContractedAmountTotal;
            
            return [data, categories, countFieldAmountByFunding];
       }
    },
    adjudication: { 
        byProjects: function( jsonResponse ){
            //[Estatus][Adjudicacion]  
            var countField       = [ [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0] ];
            var countFieldAmount = [ [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0] ];

            var countFieldAmountByAdjudication = [0,0,0] ;  

            var categories        = ['Licitación Pública','Adjudicación Directa','Invitación Restringida'];

            //Por cada obra aumenta en 1 el elemento countField[estatus][Adjudication]
            for(var i in jsonResponse){
                var obra = jsonResponse[i];
                if(obra.adjudication_id){
                    countField[obra.check_stage - 1][obra['adjudication_id'] - 1]++;
                    countFieldAmount[obra.check_stage - 1][obra['adjudication_id'] - 1] += obra.final_contracted_amount;
                    countFieldAmountByAdjudication[obra['adjudication_id'] - 1] += obra.final_contracted_amount;
                }
            }

            var finalContractedAmountTotal =  countFieldAmountByAdjudication.reduce(function(total, sum){return total + sum;}) ;

            
            var dataForStatus = [[],[],[],[],[],[],[]];
            for( var field in countField[0] ){

                dataForStatus[0].push({
                    y: countField[0][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[0][field]
                })
                dataForStatus[1].push({
                    y: countField[1][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[1][field]
                })
                dataForStatus[2].push({
                    y: countField[2][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[2][field]
                })
                dataForStatus[3].push({
                    y: countField[3][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[3][field]
                })
                dataForStatus[4].push({
                    y: countField[4][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[4][field]
                })
                dataForStatus[5].push({
                    y: countField[5][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[5][field]
                })
                dataForStatus[6].push({
                    y: countField[6][field],
                    idFieldDB: parseInt(field)+1,
                    amount: countFieldAmount[6][field]
                })

            }
            

            var data = [
                {
                    name: 'OBRAS RESTRINGIDAS',
                    data: dataForStatus[6],
                    color: colorStatus[ 7 ]
                },{
                    name: 'CON AVANCE FINANCIERO MAYOR AL FÍSICO',
                    data: dataForStatus[5],
                    color: colorStatus[ 6 ]
                },{
                    name: 'NO INICIADAS',
                    data: dataForStatus[4],
                    color: colorStatus[ 5 ]
                },{
                    name: 'RESCINDIDAS',
                    data: dataForStatus[3],
                    color: colorStatus[ 4 ]
                },{
                    name: 'CON RETRASO',
                    data: dataForStatus[2],
                    color: colorStatus[ 3 ]
                },{
                    name: 'EN TIEMPO',
                    data: dataForStatus[1],
                    color: colorStatus[ 2 ]
                },{
                    name: 'TERMINADAS',
                    data: dataForStatus[0],
                    color: colorStatus[ 1 ]
                }
            ];
            
            plotsChart.chartTitle.obras = jsonResponse.length;
            plotsChart.chartTitle.amount = finalContractedAmountTotal;

            return [data, categories, countFieldAmountByAdjudication];
        },
        byAmount: function( jsonResponse ){
            //[Estatus][Adjudicacion]  
            var countField       = [ [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0] ];
            var countFieldAmount = [ [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0] ];

            var countFieldAmountByAdjudication = [0,0,0] ;  

            var categories        = ['Licitación Pública','Adjudicación Directa','Invitación Restringida'];
            aa = '['
            //Por cada obra aumenta en 1 el elemento countField[estatus][Adjudication]
            for(var i in jsonResponse){
                var obra = jsonResponse[i];
                if(obra.adjudication_id){
                    countField[obra.check_stage - 1][obra['adjudication_id'] - 1]++;
                    countFieldAmount[obra.check_stage - 1][obra['adjudication_id'] - 1] += obra.final_contracted_amount;
                    countFieldAmountByAdjudication[obra['adjudication_id'] - 1] += obra.final_contracted_amount;
                }else{
                    aa += '\n{Obra:"'+ obra.project_title +'", Contrato: "'+ obra.contract_title +'", Numero_de_Contrato: "'+ obra.contract_number +'"},'
                    console.log(obra.contract_id);
                }
            }
            aa += '\n]'
            var finalContractedAmountTotal =  countFieldAmountByAdjudication.reduce(function(total, sum){return total + sum;}) ;

            
            var dataForStatus = [[],[],[],[],[],[],[]];
            for( var field in countField[0] ){

                dataForStatus[0].push({
                    amount: countField[0][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[0][field]
                })
                dataForStatus[1].push({
                    amount: countField[1][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[1][field]
                })
                dataForStatus[2].push({
                    amount: countField[2][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[2][field]
                })
                dataForStatus[3].push({
                    amount: countField[3][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[3][field]
                })
                dataForStatus[4].push({
                    amount: countField[4][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[4][field]
                })
                dataForStatus[5].push({
                    amount: countField[5][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[5][field]
                })
                dataForStatus[6].push({
                    amount: countField[6][field],
                    idFieldDB: parseInt(field)+1,
                    y: countFieldAmount[6][field]
                })

            }
            

            var data = [
                {
                    name: 'OBRAS RESTRINGIDAS',
                    data: dataForStatus[6],
                    color: colorStatus[ 7 ]
                },{
                    name: 'CON AVANCE FINANCIERO MAYOR AL FÍSICO',
                    data: dataForStatus[5],
                    color: colorStatus[ 6 ]
                },{
                    name: 'NO INICIADAS',
                    data: dataForStatus[4],
                    color: colorStatus[ 5 ]
                },{
                    name: 'RESCINDIDAS',
                    data: dataForStatus[3],
                    color: colorStatus[ 4 ]
                },{
                    name: 'CON RETRASO',
                    data: dataForStatus[2],
                    color: colorStatus[ 3 ]
                },{
                    name: 'EN TIEMPO',
                    data: dataForStatus[1],
                    color: colorStatus[ 2 ]
                },{
                    name: 'TERMINADAS',
                    data: dataForStatus[0],
                    color: colorStatus[ 1 ]
                }
            ];
            
            plotsChart.chartTitle.obras = jsonResponse.length;
            plotsChart.chartTitle.amount = finalContractedAmountTotal;

            return [data, categories, countFieldAmountByAdjudication];
        }
    },
    providers: {
        byProjects: function( jsonResponse ){

            var providersObj = [];
            
            var countFieldAmountTotal = 0 ;  
        
            //Crea el arreglo de objetos de Provider, con indices provider_NumeroIdProviderBD 
            for(var i in jsonResponse){
                var obra = jsonResponse[i];
                if( providersObj['provider_' + obra.provider_id] ){
                    providersObj['provider_' + obra.provider_id].y += 1;
                    providersObj['provider_' + obra.provider_id].amount[obra.check_stage - 1] += obra.final_contracted_amount;
                    providersObj['provider_' + obra.provider_id].stages[obra.check_stage - 1] += 1;
                    providersObj['provider_' + obra.provider_id].total_amount = parseInt(providersObj['provider_' + obra.provider_id].amount.reduce(function(total, sum){return total + sum;}) ) ;
                }else{
                    var check_stages = [0,0,0,0,0,0,0];
                    check_stages[ obra.check_stage - 1 ] = 1;
        
                    var check_stages_amounts = [0,0,0,0,0,0,0];
                    check_stages_amounts[ obra.check_stage - 1 ] = obra.final_contracted_amount;
                    
                    providersObj['provider_' + obra.provider_id] = {
                        y      : 1,
                        id     : obra.provider_id,
                        name   : obra.provider,
                        amount : check_stages_amounts,
                        stages : check_stages,
                        total_amount  : check_stages_amounts.reduce(function(total, sum){return total + sum;})
                    };
                }
                
                countFieldAmountTotal += obra.final_contracted_amount;
            }
        
            var providersObjSort = []
            for(var a in providersObj){ 
                providersObjSort.push( providersObj[a] );  
            }
            providersObjSort.sort(function(a, b){return b.total_amount - a.total_amount});
        
            var countField = [[],[],[],[],[],[],[]];
            var countFieldAmount = [[],[],[],[],[],[],[]];
            var categories = [];
            var idsProviders = [];
        
            //Pasa de arreglo asosiativo a arreglo como los otros stackbar
            for(var p in providersObjSort){
                var proveedor = providersObjSort[p];
                countField[0].push( proveedor.stages[0] )
                countField[1].push( proveedor.stages[1] )
                countField[2].push( proveedor.stages[2] )
                countField[3].push( proveedor.stages[3] )
                countField[4].push( proveedor.stages[4] )
                countField[5].push( proveedor.stages[5] )
                countField[6].push( proveedor.stages[6] )
        
                countFieldAmount[0].push( proveedor.amount[0] )
                countFieldAmount[1].push( proveedor.amount[1] )
                countFieldAmount[2].push( proveedor.amount[2] )
                countFieldAmount[3].push( proveedor.amount[3] )
                countFieldAmount[4].push( proveedor.amount[4] )
                countFieldAmount[5].push( proveedor.amount[5] )
                countFieldAmount[6].push( proveedor.amount[6] )
        
                categories.push( proveedor.name );
                idsProviders.push( proveedor.id );
            }
        
        
        
            var dataForStatus = [[],[],[],[],[],[],[]];
            for( var field in countField[0] ){
                dataForStatus[0].push({
                    y: countField[0][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[0][field],
                })
                dataForStatus[1].push({
                    y: countField[1][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[1][field]
                })
                dataForStatus[2].push({
                    y: countField[2][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[2][field]
                })
                dataForStatus[3].push({
                    y: countField[3][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[3][field]
                })
                dataForStatus[4].push({
                    y: countField[4][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[4][field]
                })
                dataForStatus[5].push({
                    y: countField[5][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[5][field]
                })
                dataForStatus[6].push({
                    y: countField[6][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[6][field]
                })
        
            }
            
        
            var data = [
                {
                    name: 'OBRAS RESTRINGIDAS',
                    data: dataForStatus[6],
                    color: colorStatus[ 7 ]
                },{
                    name: 'CON AVANCE FINANCIERO MAYOR AL FÍSICO',
                    data: dataForStatus[5],
                    color: colorStatus[ 6 ]
                },{
                    name: 'NO INICIADAS',
                    data: dataForStatus[4],
                    color: colorStatus[ 5 ]
                },{
                    name: 'RESCINDIDAS',
                    data: dataForStatus[3],
                    color: colorStatus[ 4 ]
                },{
                    name: 'CON RETRASO',
                    data: dataForStatus[2],
                    color: colorStatus[ 3 ]
                },{
                    name: 'EN TIEMPO',
                    data: dataForStatus[1],
                    color: colorStatus[ 2 ]
                },{
                    name: 'TERMINADAS',
                    data: dataForStatus[0],
                    color: colorStatus[ 1 ]
                }
            ];
            
            plotsChart.chartTitle.obras = jsonResponse.length;
            plotsChart.chartTitle.amount = countFieldAmountTotal;
        
            return [data, categories, countFieldAmountTotal];
        },
        byAmount: function( jsonResponse ){
            
            var providersObj = [];
            
            var countFieldAmountTotal = 0 ;  
        
            //Crea el arreglo de objetos de Provider, con indices provider_NumeroIdProviderBD 
            for(var i in jsonResponse){
                var obra = jsonResponse[i];
                if( providersObj['provider_' + obra.provider_id] ){
                    providersObj['provider_' + obra.provider_id].y += 1;
                    providersObj['provider_' + obra.provider_id].amount[obra.check_stage - 1] += obra.final_contracted_amount;
                    providersObj['provider_' + obra.provider_id].stages[obra.check_stage - 1] += 1;
                    providersObj['provider_' + obra.provider_id].total_amount = parseInt(providersObj['provider_' + obra.provider_id].amount.reduce(function(total, sum){return total + sum;}) ) ;
                }else{
                    var check_stages = [0,0,0,0,0,0,0];
                    check_stages[ obra.check_stage - 1 ] = 1;
        
                    var check_stages_amounts = [0,0,0,0,0,0,0];
                    check_stages_amounts[ obra.check_stage - 1 ] = obra.final_contracted_amount;
                    
                    providersObj['provider_' + obra.provider_id] = {
                        y      : 1,
                        id     : obra.provider_id,
                        name   : obra.provider,
                        amount : check_stages_amounts,
                        stages : check_stages,
                        total_amount  : check_stages_amounts.reduce(function(total, sum){return total + sum;})
                    };
                }
                
                countFieldAmountTotal += obra.final_contracted_amount;
            }
        
            var providersObjSort = []
            for(var a in providersObj){ 
                providersObjSort.push( providersObj[a] );  
            }
            providersObjSort.sort(function(a, b){return b.total_amount - a.total_amount});
        
            var countField = [[],[],[],[],[],[],[]];
            var countFieldAmount = [[],[],[],[],[],[],[]];
            var categories = [];
            var idsProviders = [];
        
            //Pasa de arreglo asosiativo a arreglo como los otros stackbar
            for(var p in providersObjSort){
                var proveedor = providersObjSort[p];
                countField[0].push( proveedor.stages[0] )
                countField[1].push( proveedor.stages[1] )
                countField[2].push( proveedor.stages[2] )
                countField[3].push( proveedor.stages[3] )
                countField[4].push( proveedor.stages[4] )
                countField[5].push( proveedor.stages[5] )
                countField[6].push( proveedor.stages[6] )
        
                countFieldAmount[0].push( proveedor.amount[0] )
                countFieldAmount[1].push( proveedor.amount[1] )
                countFieldAmount[2].push( proveedor.amount[2] )
                countFieldAmount[3].push( proveedor.amount[3] )
                countFieldAmount[4].push( proveedor.amount[4] )
                countFieldAmount[5].push( proveedor.amount[5] )
                countFieldAmount[6].push( proveedor.amount[6] )
        
                categories.push( proveedor.name );
                idsProviders.push( proveedor.id );
            }
        
        
        
            var dataForStatus = [[],[],[],[],[],[],[]];
            for( var field in countField[0] ){
                dataForStatus[0].push({
                    y: countFieldAmount[0][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countField[0][field]
                })
                dataForStatus[1].push({
                    amount: countField[1][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    y: countFieldAmount[1][field]
                })
                dataForStatus[2].push({
                    amount: countField[2][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    y: countFieldAmount[2][field]
                })
                dataForStatus[3].push({
                    amount: countField[3][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    y: countFieldAmount[3][field]
                })
                dataForStatus[4].push({
                    amount: countField[4][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    y: countFieldAmount[4][field]
                })
                dataForStatus[5].push({
                    amount: countField[5][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    y: countFieldAmount[5][field]
                })
                dataForStatus[6].push({
                    amount: countField[6][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    y: countFieldAmount[6][field]
                })
        
            }
            
        
            var data = [
                {
                    name: 'OBRAS RESTRINGIDAS',
                    data: dataForStatus[6],
                    color: colorStatus[ 7 ]
                },{
                    name: 'CON AVANCE FINANCIERO MAYOR AL FÍSICO',
                    data: dataForStatus[5],
                    color: colorStatus[ 6 ]
                },{
                    name: 'NO INICIADAS',
                    data: dataForStatus[4],
                    color: colorStatus[ 5 ]
                },{
                    name: 'RESCINDIDAS',
                    data: dataForStatus[3],
                    color: colorStatus[ 4 ]
                },{
                    name: 'CON RETRASO',
                    data: dataForStatus[2],
                    color: colorStatus[ 3 ]
                },{
                    name: 'EN TIEMPO',
                    data: dataForStatus[1],
                    color: colorStatus[ 2 ]
                },{
                    name: 'TERMINADAS',
                    data: dataForStatus[0],
                    color: colorStatus[ 1 ]
                }
            ];
            
            plotsChart.chartTitle.obras = jsonResponse.length;
            plotsChart.chartTitle.amount = countFieldAmountTotal;
        
            return [data, categories, countFieldAmountTotal];
        },
        byTable: function( thisObj ){
        
            if($(thisObj).attr('isShowIn') == 'plot'){
                $(thisObj).attr('isShowIn', 'table');
                $(thisObj).html(' <i class="fas fa-chart-bar"></i> Mostrar en Gráfica ');
            }else{
                $(thisObj).attr('isShowIn', 'plot');
                $('#tableOfProviders').css('display','none') ;
                $('#genl-pie-chart').css('display','block') ;
                $(thisObj).html(' <i class="fas fa-table"></i> Mostrar en Tabla ');
                return 0;
            }

            var jsonResponse = plotsChart.data;
            
            if( jsonResponse ){;}else{return 0;}

            var providersObj = [];
            var countFieldAmountTotal = 0 ;  

            //Crea el arreglo de objetos de Provider, con indices provider_NumeroIdProviderBD 
            for(var i in jsonResponse){
                var obra = jsonResponse[i];
                if( providersObj['provider_' + obra.provider_id] ){
                    providersObj['provider_' + obra.provider_id].y += 1;
                    providersObj['provider_' + obra.provider_id].amount[obra.check_stage - 1] += obra.final_contracted_amount;
                    providersObj['provider_' + obra.provider_id].stages[obra.check_stage - 1] += 1;
                    providersObj['provider_' + obra.provider_id].obras.push(  obra.project_title  );
                    providersObj['provider_' + obra.provider_id].total_amount = parseInt(providersObj['provider_' + obra.provider_id].amount.reduce(function(total, sum){return total + sum;}) ) ;
                }else{
                    var check_stages = [0,0,0,0,0,0,0];
                    check_stages[ obra.check_stage - 1 ] = 1;

                    var check_stages_amounts = [0,0,0,0,0,0,0];
                    check_stages_amounts[ obra.check_stage - 1 ] = obra.final_contracted_amount;
                    
                    providersObj['provider_' + obra.provider_id] = {
                        y      : 1,
                        id     : obra.provider_id,
                        name   : obra.provider,
                        amount : check_stages_amounts,
                        stages : check_stages,
                        total_amount  : check_stages_amounts.reduce(function(total, sum){return total + sum;}),
                        obras  : [ obra.project_title ]
                    };
                }
                
                countFieldAmountTotal += obra.final_contracted_amount;
            }

            var providersObjSort = []
            for(var a in providersObj){ 
                providersObjSort.push( providersObj[a] );  
            }
            providersObjSort.sort(function(a, b){return b.total_amount - a.total_amount});
            
            
            var strTable = `
                <div class="container" style="font-size: 0.8em;">
                  <div class="row" style="border-bottom:1px solid #ddd;" >
                    <div class="col-md-4" style="font-weight:bold; color:#222;">Contratista</div>
                    <div class="col-md-2" style="font-weight:bold; color:#222;">Monto</div>
                    <div class="col-md-6" style="font-weight:bold; color:#222;">Obras</div>
                  </div>`;
            
            for(var p in providersObjSort ){
                var cantidad = providersObjSort[p].total_amount.toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                strTable += `
                  <div class="row" style="border-bottom:1px solid #ddd;" >
                    <div class="col-md-4"  style="color:#666;">`+ providersObjSort[p].name +`</div>
                    <div class="col-md-2"  style="color:#666;"> $`+ cantidad +`</div>
                    <div class="col-md-6"  style="color:#666;"><ul>`
                    
                    for( var o in providersObjSort[p].obras ){
                        strTable += '<li>' + providersObjSort[p].obras[o] + '</li>';
                    }
                    
                 strTable += `</ul></div>
                  </div> `; 
            }

            strTable += `
                </div>       
            `;               
                             
            $('#tableOfProviders').html(strTable) ;
            $('#tableOfProviders').css('display','block') ;
            $('#genl-pie-chart').css('display','none') ;

            return  0 ;      
        },
        byProjectsOld: function( jsonResponse ){

            var providersObj = [];
            
            var countFieldAmountTotal = 0 ;  

            //Crea el arreglo de objetos de Provider, con indices provider_NumeroIdProviderBD 
            for(var i in jsonResponse){
                var obra = jsonResponse[i];
                if( providersObj['provider_' + obra.provider_id] ){
                    providersObj['provider_' + obra.provider_id].y += 1;
                    providersObj['provider_' + obra.provider_id].amount[obra.check_stage - 1] += obra.final_contracted_amount;
                    providersObj['provider_' + obra.provider_id].stages[obra.check_stage - 1] += 1;
                }else{
                    var check_stages = [0,0,0,0,0,0,0];
                    check_stages[ obra.check_stage - 1 ] = 1;

                    var check_stages_amounts = [0,0,0,0,0,0,0];
                    check_stages_amounts[ obra.check_stage - 1 ] = obra.final_contracted_amount;
                    
                    providersObj['provider_' + obra.provider_id] = {
                        y      : 1,
                        id     : obra.provider_id,
                        name   : obra.provider,
                        amount : check_stages_amounts,
                        stages : check_stages                
                    };
                }
                
                countFieldAmountTotal += obra.final_contracted_amount;
            }

            
            var countField = [[],[],[],[],[],[],[]];
            var countFieldAmount = [[],[],[],[],[],[],[]];
            var categories = [];
            var idsProviders = [];

            //Pasa de arreglo asosiativo a arreglo como los otros stackbar
            for(var p in providersObj){
                var proveedor = providersObj[p];
                countField[0].push( proveedor.stages[0] )
                countField[1].push( proveedor.stages[1] )
                countField[2].push( proveedor.stages[2] )
                countField[3].push( proveedor.stages[3] )
                countField[4].push( proveedor.stages[4] )
                countField[5].push( proveedor.stages[5] )
                countField[6].push( proveedor.stages[6] )

                countFieldAmount[0].push( proveedor.amount[0] )
                countFieldAmount[1].push( proveedor.amount[1] )
                countFieldAmount[2].push( proveedor.amount[2] )
                countFieldAmount[3].push( proveedor.amount[3] )
                countFieldAmount[4].push( proveedor.amount[4] )
                countFieldAmount[5].push( proveedor.amount[5] )
                countFieldAmount[6].push( proveedor.amount[6] )

                categories.push( proveedor.name );
                idsProviders.push( proveedor.id );
            }



            var dataForStatus = [[],[],[],[],[],[],[]];
            for( var field in countField[0] ){
                dataForStatus[0].push({
                    y: countField[0][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[0][field]
                })
                dataForStatus[1].push({
                    y: countField[1][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[1][field]
                })
                dataForStatus[2].push({
                    y: countField[2][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[2][field]
                })
                dataForStatus[3].push({
                    y: countField[3][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[3][field]
                })
                dataForStatus[4].push({
                    y: countField[4][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[4][field]
                })
                dataForStatus[5].push({
                    y: countField[5][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[5][field]
                })
                dataForStatus[6].push({
                    y: countField[6][field],
                    city: parseInt(field)+1,
                    idFieldDB: idsProviders[field],
                    amount: countFieldAmount[6][field]
                })

            }
            

            var data = [
                {
                    name: 'OBRAS RESTRINGIDAS',
                    data: dataForStatus[6],
                    color: colorStatus[ 7 ]
                },{
                    name: 'CON AVANCE FINANCIERO MAYOR AL FÍSICO',
                    data: dataForStatus[5],
                    color: colorStatus[ 6 ]
                },{
                    name: 'NO INICIADAS',
                    data: dataForStatus[4],
                    color: colorStatus[ 5 ]
                },{
                    name: 'RESCINDIDAS',
                    data: dataForStatus[3],
                    color: colorStatus[ 4 ]
                },{
                    name: 'CON RETRASO',
                    data: dataForStatus[2],
                    color: colorStatus[ 3 ]
                },{
                    name: 'EN TIEMPO',
                    data: dataForStatus[1],
                    color: colorStatus[ 2 ]
                },{
                    name: 'TERMINADAS',
                    data: dataForStatus[0],
                    color: colorStatus[ 1 ]
                }
            ];
            
            plotsChart.chartTitle.obras = jsonResponse.length;
            plotsChart.chartTitle.amount = countFieldAmountTotal;

            return [data, categories, countFieldAmountTotal];
        }
    },
    cities: {
        byProjects: function( jsonResponse ){
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
            
            var countCitiesAmount = [
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            ];

            var countCitiesAmountByCity = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] ;  

            var categories        = citiesNL.slice(1);

            //Por cada obra aumenta en 1 el elemento countCities[estatus][ciudad]
            for(var i in jsonResponse){
                var obra = jsonResponse[i];
                countCities[obra.check_stage - 1][obra.city_id - 1]++;
                countCitiesAmount[obra.check_stage - 1][obra.city_id - 1] += obra.final_contracted_amount;
                countCitiesAmountByCity[obra.city_id - 1] += obra.final_contracted_amount;
            }

            var finalContractedAmountTotal =  countCitiesAmountByCity.reduce(function(total, sum){return total + sum;}) ;

            
            var dataForStatus = [[],[],[],[],[],[],[]];
            for( var ciudad in countCities[0] ){

                dataForStatus[0].push({
                    y: countCities[0][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                    amount: countCitiesAmount[0][ciudad]
                })
                dataForStatus[1].push({
                    y: countCities[1][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                    amount: countCitiesAmount[1][ciudad]
                })
                dataForStatus[2].push({
                    y: countCities[2][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                    amount: countCitiesAmount[2][ciudad]
                })
                dataForStatus[3].push({
                    y: countCities[3][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                    amount: countCitiesAmount[3][ciudad]
                })
                dataForStatus[4].push({
                    y: countCities[4][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                    amount: countCitiesAmount[4][ciudad]
                })
                dataForStatus[5].push({
                    y: countCities[5][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                    amount: countCitiesAmount[5][ciudad]
                })
                dataForStatus[6].push({
                    y: countCities[6][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                    amount: countCitiesAmount[6][ciudad]
                })

            }
            

            var data = [
                {
                    name: 'OBRAS RESTRINGIDAS',
                    data: dataForStatus[6],
                    color: colorStatus[ 7 ]
                },{
                    name: 'CON AVANCE FINANCIERO MAYOR AL FÍSICO',
                    data: dataForStatus[5],
                    color: colorStatus[ 6 ]
                },{
                    name: 'NO INICIADAS',
                    data: dataForStatus[4],
                    color: colorStatus[ 5 ]
                },{
                    name: 'RESCINDIDAS',
                    data: dataForStatus[3],
                    color: colorStatus[ 4 ]
                },{
                    name: 'CON RETRASO',
                    data: dataForStatus[2],
                    color: colorStatus[ 3 ]
                },{
                    name: 'EN TIEMPO',
                    data: dataForStatus[1],
                    color: colorStatus[ 2 ]
                },{
                    name: 'TERMINADAS',
                    data: dataForStatus[0],
                    color: colorStatus[ 1 ]
                }
            ];
            
            plotsChart.chartTitle.obras = jsonResponse.length;
            plotsChart.chartTitle.amount = finalContractedAmountTotal;

            return [data, categories, countCitiesAmountByCity];
        },
        byAmount:  function( jsonResponse ){
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
            
            var countCitiesAmount = [
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            ];

            var countCitiesAmountByCity = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] ;  

            var categories        = citiesNL.slice(1);

            //Por cada obra aumenta en 1 el elemento countCities[estatus][ciudad]
            for(var i in jsonResponse){
                var obra = jsonResponse[i];
                countCities[obra.check_stage - 1][obra.city_id - 1]++;
                countCitiesAmount[obra.check_stage - 1][obra.city_id - 1] += obra.final_contracted_amount;
                countCitiesAmountByCity[obra.city_id - 1] += obra.final_contracted_amount;
            }

            var finalContractedAmountTotal =  countCitiesAmountByCity.reduce(function(total, sum){return total + sum;}) ;

            
            var dataForStatus = [[],[],[],[],[],[],[]];
            for( var ciudad in countCities[0] ){

                dataForStatus[0].push({
                    y: countCitiesAmount[0][ciudad],
                    amount: countCities[0][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                })
                dataForStatus[1].push({
                    y: countCitiesAmount[1][ciudad],
                    amount: countCities[1][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                })
                dataForStatus[2].push({
                    y: countCitiesAmount[2][ciudad],
                    amount: countCities[2][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                })
                dataForStatus[3].push({
                    y: countCitiesAmount[3][ciudad],
                    amount: countCities[3][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                })
                dataForStatus[4].push({
                    y: countCitiesAmount[4][ciudad],
                    amount: countCities[4][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                })
                dataForStatus[5].push({
                    y: countCitiesAmount[5][ciudad],
                    amount: countCities[5][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                })
                dataForStatus[6].push({
                    y: countCitiesAmount[6][ciudad],
                    amount: countCities[6][ciudad],
                    idFieldDB: parseInt(ciudad)+1,
                })

            }
            

            var data = [
                {
                    name: 'OBRAS RESTRINGIDAS',
                    data: dataForStatus[6],
                    color: colorStatus[ 7 ]
                },{
                    name: 'CON AVANCE FINANCIERO MAYOR AL FÍSICO',
                    data: dataForStatus[5],
                    color: colorStatus[ 6 ]
                },{
                    name: 'NO INICIADAS',
                    data: dataForStatus[4],
                    color: colorStatus[ 5 ]
                },{
                    name: 'RESCINDIDAS',
                    data: dataForStatus[3],
                    color: colorStatus[ 4 ]
                },{
                    name: 'CON RETRASO',
                    data: dataForStatus[2],
                    color: colorStatus[ 3 ]
                },{
                    name: 'EN TIEMPO',
                    data: dataForStatus[1],
                    color: colorStatus[ 2 ]
                },{
                    name: 'TERMINADAS',
                    data: dataForStatus[0],
                    color: colorStatus[ 1 ]
                }
            ];
            
            plotsChart.chartTitle.obras = jsonResponse.length;
            plotsChart.chartTitle.amount = finalContractedAmountTotal;

            return [data, categories, countCitiesAmountByCity];
        }
    }
}

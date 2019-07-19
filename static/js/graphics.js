
var plotsChart = {
    department    : '',
    check_stage   : '',
    city          : '',
    startDate     : '',
    endDate       : '',
    provider      : '',
    funding       : '',
    program       : '',
    adjudication  : '',
    chartType     : '',
    allowGetData  : true,
    functionClick : function(){;},
    functionAfterClickChart : '',
    chartTitle    : {
        obras: 0,
        amount: 0,
        titleGral : '',
        setTitle: function(){
            var amount = this.amount.toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            var city = this.titleGral;
            $('#titleChartGral').html(city);
            return 'TOTAL DE OBRAS ' + this.obras + '<br>$' + amount; 
        }
    },
    initStatusPie : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'pieStatus';
        plotsChart.functionAfterClickChart   = '';
        plotsChart.functionClick = function(){console.log("callback");};
        plotsChart.getData();
        
        //$('.linkPlots').removeAttr("active"); $( '#plotTotal2' ).attr('active','');
    },
    initStackCities : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'barCities';
        plotsChart.functionAfterClickChart   = 'chartAfterCitiesBar';
        plotsChart.functionClick = plotsChart.openUrlChart;
        plotsChart.getData(  );

        $('.linkPlots').removeAttr("active"); $( '#plotTotal2' ).attr('active','');
    },
    initDepartmentsPie : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'stackedBarDepartment';
        plotsChart.functionAfterClickChart   = 'chartAfterDepartmentsPie';
        plotsChart.functionClick = plotsChart.openUrlChart;
        plotsChart.getData(  );

        $('.linkPlots').removeAttr("active"); $( '#plotTotal3' ).attr('active','');
    },
    initAdjudicationChart: function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'stackedBarAdjudication';
        plotsChart.functionAfterClickChart   = '';
        plotsChart.functionClick = function(s){console.log(s);} //function(s){plotsChart.adjudication = s; plotsChart.openUrl();} ;
        plotsChart.getData(  );

        $('.linkPlots').removeAttr("active"); $( '#plotTotal4' ).attr('active','');
    },
    initFundingChart : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'stackedBarFunding';
        plotsChart.functionAfterClickChart   = '';
        plotsChart.functionClick = function(s){console.log(s);} //plotsChart.chartAfterDepartmentsPie.init;
        plotsChart.getData(  );

        $('.linkPlots').removeAttr("active"); $( '#plotTotal5' ).attr('active','');
    },
    initProvidersChart : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'stackedBarProvidersByAmount';
        plotsChart.functionAfterClickChart = '';
        plotsChart.functionClick = function(s){plotsChart.provider = s; plotsChart.openUrl();};
        plotsChart.getData();


        $('#buttonShowProviderTable').css('display','block')
        $('.linkPlots').removeAttr("active"); $( '#plotTotal6' ).attr('active','');
    },
    chartAfterCitiesBar: {
        init: function( cityIdDB ){
            if( !plotsChart.allowGetData ){ return; }
            plotsChart.city = cityIdDB;
            plotsChart.chartTitle.titleGral = citiesNL[cityIdDB];
            plotsChart.chartAfterCitiesBar.statusPie();
            
            var strOptions = `
                <span class="linkPlots" id="plotTotal1" active onclick="plotsChart.chartAfterCitiesBar.statusPie();">
                    <i class="fas fa-chart-line" style="margin-right:10px;"></i> Estatus
                </span>
                <span class="linkPlots" id="plotTotal2" onclick="plotsChart.chartAfterCitiesBar.stackedBarDepartment();">
                    <i class="fas fa-building" style="margin-right:10px;"></i> Dependencias
                </span>
                <span class="linkPlots" id="plotTotal3" onclick="plotsChart.chartAfterCitiesBar.stackedBarProvider();">
                    <i class="fas fa-user-tie" style="margin-right:10px;"></i> Contratistas
                </span>
            `;
            
            $('#radioSelects').html(strOptions);
        },
        statusPie : function(){
            if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'pieStatus';
            plotsChart.functionClick = function(s){plotsChart.check_stage = s; plotsChart.openUrl();};
            plotsChart.getData(  );
            $('.linkPlots').removeAttr("active");$('#plotTotal1').attr('active','');
        },
        stackedBarDepartment : function(){
            if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'stackedBarDepartment';
            plotsChart.functionClick = function(s){plotsChart.department = s; plotsChart.openUrl();};
            plotsChart.getData(  );
            $('.linkPlots').removeAttr("active");$('#plotTotal2').attr('active','');
        },
        stackedBarProvider : function(){
            if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'stackedBarProvidersByAmount';
            plotsChart.functionClick = function(s){plotsChart.provider = s; plotsChart.openUrl();};
            plotsChart.getData(  );
            
            $('#buttonShowProviderTable').css('display','block')
            $('.linkPlots').removeAttr("active");$('#plotTotal3').attr('active','');
        }
    },
    chartAfterDepartmentsPie: {
        init: function( departmentIdDB ){
            if( !plotsChart.allowGetData ){ return; }
            plotsChart.department = departmentIdDB;
            plotsChart.chartTitle.titleGral = departmentsObras[departmentIdDB];
            plotsChart.chartAfterDepartmentsPie.statusPie();
            var strOptions = `
                <span class="linkPlots" id="plotTotal1" active onclick="plotsChart.chartAfterDepartmentsPie.statusPie();">
                    <i class="fas fa-chart-line" style="margin-right:10px;"></i> Estatus
                </span>
                <span class="linkPlots" id="plotTotal2" onclick="plotsChart.chartAfterDepartmentsPie.stackCities();">
                    <i class="fas fa-map" style="margin-right:10px;"></i> Municipios
                </span>
                <span class="linkPlots" id="plotTotal3" onclick="plotsChart.chartAfterDepartmentsPie.stackedBarProvider();">
                    <i class="fas fa-user-tie" style="margin-right:10px;"></i> Contratistas
                </span>
            `;
            
            $('#radioSelects').html(strOptions);
        },
        statusPie : function(){
            if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'pieStatus';
            plotsChart.functionClick = function(s){plotsChart.check_stage = s; plotsChart.openUrl();};
            plotsChart.getData( );
            $('.linkPlots').removeAttr("active");$('#plotTotal1').attr('active','');
        },
        stackCities : function(){ 
            if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'barCities';
            plotsChart.functionClick = function(s){plotsChart.city = s; plotsChart.openUrl();} ;
            plotsChart.getData( );
            $('.linkPlots').removeAttr("active");$('#plotTotal2').attr('active','');
        },
        stackedBarProvider : function(){
            if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'stackedBarProvidersByAmount';
            plotsChart.functionClick = function(s){plotsChart.provider = s; plotsChart.openUrl();} ;
            plotsChart.getData( );
            
            $('#buttonShowProviderTable').css('display','block')
            $('.linkPlots').removeAttr("active");$('#plotTotal3').attr('active','');
        }
    },
    chartAfterFundingChart: {
        init: function( departmentIdDB ){
            if( !plotsChart.allowGetData ){ return; }
            plotsChart.department = departmentIdDB;
            plotsChart.chartTitle.titleGral = departmentsObras[departmentIdDB];
            plotsChart.chartAfterDepartmentsPie.statusPie();
            var strOptions = `
                <span class="linkPlots" id="plotTotal1" active onclick="plotsChart.chartAfterDepartmentsPie.statusPie();">
                    <i class="fas fa-chart-line" style="margin-right:10px;"></i> Estatus
                </span>
                <span class="linkPlots" id="plotTotal2" onclick="plotsChart.chartAfterDepartmentsPie.stackCities();">
                    <i class="fas fa-map" style="margin-right:10px;"></i> Municipios
                </span>
                <span class="linkPlots" id="plotTotal3" onclick="plotsChart.chartAfterDepartmentsPie.stackedBarProvider();">
                    <i class="fas fa-user-tie" style="margin-right:10px;"></i> Contratistas
                </span>
            `;
            
            $('#radioSelects').html(strOptions);
        },
        statusPie : function(){
            if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'pieStatus';
            plotsChart.functionClick = function(s){plotsChart.check_stage = s; plotsChart.openUrl();};
            plotsChart.getData( );
            $('.linkPlots').removeAttr("active");$('#plotTotal1').attr('active','');
        },
        stackCities : function(){ 
            if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'barCities';
            plotsChart.functionClick = function(s){plotsChart.city = s; plotsChart.openUrl();} ;
            plotsChart.getData( );
            $('.linkPlots').removeAttr("active");$('#plotTotal2').attr('active','');
        },
        stackedBarProvider : function(){
            if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'stackedBarProvider';
            plotsChart.functionClick = function(s){plotsChart.provider = s; plotsChart.openUrl();} ;
            plotsChart.getData( );
            $('.linkPlots').removeAttr("active");$('#plotTotal3').attr('active','');
        }
    },
    openUrlChart: function( idFieldInDB ){
        var functionAfterClickChart  = this.functionAfterClickChart;
        var value    = idFieldInDB;
        var url      = 'graphics?chart='+functionAfterClickChart + '&value=' + value;
        window.open( url ,"_self");
    },
    openUrl: function(){
        var urlLink = $('#urlLink').val();

        var department  = plotsChart.department;
        var statusIdNum = plotsChart.check_stage;
        var city        = plotsChart.city ;

        var queryString = '?department=' + department;
        queryString += '&status=' + statusIdNum;
        queryString += '&city=' + city;

        queryString += '&startDate='    + plotsChart.startDate;
        queryString += '&endDate='      + plotsChart.endDate;
        queryString += '&provider='     + plotsChart.provider;
        queryString += '&funding='      + plotsChart.funding;
        queryString += '&program='      + plotsChart.program;
        queryString += '&adjudication=' + plotsChart.adjudication;
        var url = urlLink + queryString ;
        window.open( url ,"_self");
    },
    chart : '',
    data  : undefined,
    getData : function ( ){
        
        document.getElementById('waintingAnimation').style.display = "block";

        $.ajax({
            url: '/graphics',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                
                plotsChart.data = res.data;
                if( plotsChart.chartType == 'pieStatus' ){
                    var values = plotsChart.setJsonChart(res.data);
                    var options = plotsChart.optionsChart(values)
                    $('#genl-pie-chart').css('height','400px');
                    plotsChart.chart = Highcharts.chart('genl-pie-chart', options);
                }else if( plotsChart.chartType == 'barCities' ){
                    var values = plotsChart.setJsonStackedBar(res.data);
                    var optionsHighChart = plotsChart.optionsStackedBar(values[0], values[1], values[2]);
                    var heightChart = values[0][0].data.length*30 + 200;
                    $('#genl-pie-chart').css('height', heightChart + 'px');
                    plotsChart.chart = Highcharts.chart('genl-pie-chart', optionsHighChart);
                    plotsChart.chart.render();  //Renderiza para mostrar los labels que se generan despues de crearse la grafica
                }else if( plotsChart.chartType == 'stackedBarDepartment' ){
                    var values = plotsChart.setJsonDepartmentsStackedBar(res.data);
                    var optionsHighChart = plotsChart.optionsStackedBar(values[0], values[1], values[2]);
                    var heightChart = values[0][0].data.length*30 + 200;
                    $('#genl-pie-chart').css('height', heightChart + 'px');
                    plotsChart.chart = Highcharts.chart('genl-pie-chart', optionsHighChart);
                    plotsChart.chart.render();  //Renderiza para mostrar los labels que se generan despues de crearse la grafica
                }else if( plotsChart.chartType == 'stackedBarProvider' ){
                    var values = plotsChart.setJsonProvidersStackedBar(res.data);
                    var optionsHighChart = plotsChart.optionsStackedBar(values[0], values[1], values[2]);
                    var heightChart = values[0][0].data.length*30 + 200;
                    $('#genl-pie-chart').css('height', heightChart + 'px');
                    plotsChart.chart = Highcharts.chart('genl-pie-chart', optionsHighChart);
                    plotsChart.chart.render();  //Renderiza para mostrar los labels que se generan despues de crearse la grafica
                }else if( plotsChart.chartType == 'stackedBarProvidersByAmount' ){
                    var values = plotsChart.setJsonProvidersStackedBarByAmount(res.data);
                    var optionsHighChart = plotsChart.optionsStackedBar(values[0], values[1], values[2]);
                    var heightChart = values[0][0].data.length*30 + 200;
                    $('#genl-pie-chart').css('height', heightChart + 'px');
                    plotsChart.chart = Highcharts.chart('genl-pie-chart', optionsHighChart);
                    plotsChart.chart.render();  //Renderiza para mostrar los labels que se generan despues de crearse la grafica
                }else if( plotsChart.chartType == 'stackedBarAdjudication' ){
                    var values = plotsChart.setJsonAdjudicationStackedBar(res.data);
                    var optionsHighChart = plotsChart.optionsStackedBar(values[0], values[1], values[2]);
                    var heightChart = values[0][0].data.length*30 + 200;
                    $('#genl-pie-chart').css('height', heightChart + 'px');
                    plotsChart.chart = Highcharts.chart('genl-pie-chart', optionsHighChart);
                    plotsChart.chart.render();  //Renderiza para mostrar los labels que se generan despues de crearse la grafica
                }else if( plotsChart.chartType == 'stackedBarFunding' ){
                    var values = plotsChart.setJsonFundingStackedBar(res.data);
                    var optionsHighChart = plotsChart.optionsStackedBar(values[0], values[1], values[2]);
                    var heightChart = values[0][0].data.length*30 + 200;
                    $('#genl-pie-chart').css('height', heightChart + 'px');
                    plotsChart.chart = Highcharts.chart('genl-pie-chart', optionsHighChart);
                    plotsChart.chart.render();  //Renderiza para mostrar los labels que se generan despues de crearse la grafica
                }

                
                plotsChart.allowGetData = true; $('.linkPlots').css('cursor','pointer'); $('#waintingAnimation').css('display','none');

            },

            data:  JSON.stringify ({'department'    : plotsChart.department.toString(),
                                    'city'          : plotsChart.city.toString(),
                                    'check_stage'   : plotsChart.check_stage.toString(),
                                    'startDate'     : plotsChart.startDate.toString(),
                                    'endDate'       : plotsChart.endDate.toString(),
                                    'provider'      : plotsChart.provider.toString(),
                                    'adjudication'  : plotsChart.adjudication.toString(),
                                    'funding'       : plotsChart.funding.toString(),
                                    'program'       : plotsChart.program.toString(),
                                   })

        }).done(function() { plotsChart.allowGetData = true; $('.linkPlots').css('cursor','pointer'); $('#waintingAnimation').css('display','none');
        }).fail(function() { plotsChart.allowGetData = true; $('.linkPlots').css('cursor','pointer'); $('#waintingAnimation').css('display','none');
        }).always(function() { plotsChart.allowGetData = true; $('.linkPlots').css('cursor','pointer'); $('#waintingAnimation').css('display','none');
        });

    },
    setJsonChart : function( resp ){
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
        
        
        this.chartTitle.obras = resp.length;
        this.chartTitle.amount = finalContractedAmountTotal;
        
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
        
        this.chartTitle.obras = jsonResponse.length;
        this.chartTitle.amount = finalContractedAmountTotal;

        return [data, categories, countCitiesAmountByCity];
    },
    setJsonDepartmentsStackedBar: function( jsonResponse ){
        
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
        
        this.chartTitle.obras = jsonResponse.length;
        this.chartTitle.amount = finalContractedAmountTotal;

        return [data, categories, countFieldAmountByCity];
    },
    setJsonFundingStackedBar: function( jsonResponse ){
        
        //[Estatus][Fondo]  
        var countField       = [ [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0] ];
        var countFieldAmount = [ [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0] ];

        var countFieldAmountByFunding = [0,0] ;  

        var categories        = ['Federal','Estatal'];

        //Por cada obra aumenta en 1 el elemento countField[estatus][fondo]
        for(var i in jsonResponse){
            var obra = jsonResponse[i];
            countField[obra.check_stage - 1][obra['funding_id'] - 1]++;
            countFieldAmount[obra.check_stage - 1][obra['funding_id'] - 1] += obra.final_contracted_amount;
            countFieldAmountByFunding[obra['funding_id'] - 1] += obra.final_contracted_amount;
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
        
        this.chartTitle.obras = jsonResponse.length;
        this.chartTitle.amount = finalContractedAmountTotal;

        return [data, categories, countFieldAmountByFunding];
    },
    setJsonAdjudicationStackedBar: function( jsonResponse ){
        
        //[Estatus][Adjudicacion]  
        var countField       = [ [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0] ];
        var countFieldAmount = [ [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0] ];

        var countFieldAmountByAdjudication = [0,0,0] ;  

        var categories        = ['Licitación Pública','Adjudicación Directa','Invitación Restringida'];

        //Por cada obra aumenta en 1 el elemento countField[estatus][Adjudication]
        for(var i in jsonResponse){
            var obra = jsonResponse[i];
            countField[obra.check_stage - 1][obra['adjudication_id'] - 1]++;
            countFieldAmount[obra.check_stage - 1][obra['adjudication_id'] - 1] += obra.final_contracted_amount;
            countFieldAmountByAdjudication[obra['adjudication_id'] - 1] += obra.final_contracted_amount;
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
        
        this.chartTitle.obras = jsonResponse.length;
        this.chartTitle.amount = finalContractedAmountTotal;

        return [data, categories, countFieldAmountByAdjudication];
    },
    setJsonProvidersStackedBar: function( jsonResponse ){
        

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
        
        this.chartTitle.obras = jsonResponse.length;
        this.chartTitle.amount = countFieldAmountTotal;

        return [data, categories, countFieldAmountTotal];
    },
    setJsonProvidersStackedBarByAmount: function( jsonResponse ){
        
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
        
        this.chartTitle.obras = jsonResponse.length;
        this.chartTitle.amount = countFieldAmountTotal;

        return [data, categories, countFieldAmountTotal];
    },
    showInTable: function(  ){

        var jsonResponse = plotsChart.data;
        
        if( jsonResponse ){;}else{return 0;}

        var providersObj = [];
        console.log(jsonResponse);
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
        $('#genl-pie-chart').css('display','none') ;
        return  0 ;      
    },                   
    optionsChart : function(data){

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
                                var allStatus = plotsChart.chart.series[0].data;
                                var countAmount = 0;
                                for( var s in allStatus ){
                                    if( allStatus[s].visible ){
                                        countAmount += allStatus[s].amount;
                                    }
                                }
                                var totalProjectsVisible = plotsChart.chart.series[0].total;
                                plotsChart.chartTitle.obras  = totalProjectsVisible;
                                plotsChart.chartTitle.amount = countAmount;
                                plotsChart.chart.setTitle({ text: plotsChart.chartTitle.setTitle() } )
                            }
                        }
                        catch(e){
                            ;
                        }
                    }
                }
   	    	},
   	    	title: {
   	            text: plotsChart.chartTitle.setTitle(),
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
                                plotsChart.functionClick( this.x );
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
   	    		        //format: 
                        formatter: function(){
                            var point = this.point;
                            var amount = this.point.amount;
                            
                            var sfcat = amount.toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                            return '<b>' + point.y + ' ' + point.name + ' <span style="color:#446;">$' + sfcat + '</span>';
                        }
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
    optionsStackedBar: function(data, categories, amountsByCity ) {

        var options = {
            chart: {
                type: 'bar',
                events: {
                    render: function () {    //Cuando se ocultan una rebanada o barra se actualizan las cantidades del titulo
                        try{
                            if( plotsChart.chart ){
                                var series = this.series;
                                
                                var countAmount = 0;
                                var countObras  = 0;
                                
                                for( var s in series ){
                                    var serie = series[s];
                                    if( serie.visible ){
                                        var cities = serie.data;
                                        for( var c in cities ){
                                            countAmount += cities[c].amount;
                                            countObras += cities[c].y;
                                        }
                                    }
                                }
                                
                                var totalProjectsVisible = countObras;
                                plotsChart.chartTitle.obras  = totalProjectsVisible;
                                plotsChart.chartTitle.amount = countAmount;
                                plotsChart.chart.setTitle({ text: plotsChart.chartTitle.setTitle() } )
                            }
                        }
                        catch(e){
                            ;
                        }
                    }
                }
            },
            title: {
                text: plotsChart.chartTitle.setTitle()
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
                    y: 10,
                    verticalAlign: 'top',
                    amountsByCity : amountsByCity,
                    formatter: function () {
                        var series = this.axis.series; //status
                        var thisCity = this.x;
                        var sumAmountThisCity = 0;
                        for( var s in series ){ //Son 7
                            if(series[s].data.length){
                                if(series[s].visible){
                                    sumAmountThisCity += series[s].data[thisCity].amount;
                                }
                            }
                        }
                        if(sumAmountThisCity == 0){return '';}
                        
                        if( plotsChart.chartType == 'stackedBarProvidersByAmount' ){
                            var totalY = parseInt(this.total/1000).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            totalY = '$' + totalY + ' K';
                            var amount = sumAmountThisCity;
                            amount = amount + ' Obras '
                        }else{
                            var totalY = this.total ;
                            totalY = totalY + ' Obras ' ;
                            var amount = parseInt(sumAmountThisCity/1000).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            amount = '$' + amount + ' K';
                        }

                        return '<span style="color:#000;font-weight:100;">'+ totalY + '</span><br><span style="color:#336;margin-left:13px;font-weight:100;">'+ amount +'</span>';
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
                                plotsChart.functionClick( this.idFieldDB );
   	                        }
   	                    }
   	                }
                }
            },
            series: data
        }
        
        return options;
    },
    search: function(){
        this.department   = $('#departmentSearch').val();
        this.check_stage  = $('#check_stage').val();
        this.city         = $('#city').val();
        this.startDate    = $('#startDate').val();
        this.endDate      = $('#endDate').val();
        this.provider     = $('#provider').val();
        this.funding      = $('#funding').val();
        this.program      = $('#program').val();
        this.adjudication = $('#adjudication').val();

        $('#modalSearch').modal('hide');

        plotsChart.getData();

    }
}



function setState( chartType ){
    var state = {
        department   : plotsChart.department   ,
        check_stage  : plotsChart.check_stage  ,
        city         : plotsChart.city         ,
        startDate    : plotsChart.startDate    ,
        endDate      : plotsChart.endDate      ,
        provider     : plotsChart.provider     ,
        funding      : plotsChart.funding      ,
        program      : plotsChart.program      ,
        adjudication : plotsChart.adjudication ,
        chartType    : plotsChart.chartType    ,
    }

    window.history.pushState({ chartType: chartType, state}, null, '');
}


function navBarCharts( thisButton ){
}

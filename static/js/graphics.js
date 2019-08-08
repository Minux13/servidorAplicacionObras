
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
    groupChartBy  : '',
    domainChart   : '',
    countProjClick: 0,
    typeHighChart : '',
    allowGetData  : true,
    functionClick : function(){;},
    functionAfterClickChart : '',
    chartTitle    : {
        obras: 0,
        amount: 0,
        titleGral : '',
        setTitle: function(){
            var amount = parseInt(this.amount/1000).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            var city = this.titleGral;
            var period = document.getElementById('periodDateChart');
            var pp = period.options[period.selectedIndex].innerHTML
            $('#titleChartGral').html(city);
            return 'TOTAL DE OBRAS ' + this.obras + '<br>$' + amount + ' K <br> <span style="color:#335;font-size:0.85em;">' + pp + '</span>'; 
        }
    },
    initStatusPie : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'pieStatus';
        plotsChart.typeHighChart = 'pie';
        plotsChart.functionAfterClickChart   = '';
        plotsChart.functionClick = function(s){plotsChart.check_stage = s; plotsChart.openUrl();};
        plotsChart.getData();
        
        //$('.linkPlots').removeAttr("active"); $( '#plotTotal2' ).attr('active','');
    },
    initDates : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'barDates';
        plotsChart.typeHighChart = 'column';
        plotsChart.groupChartBy = 'byAmount';
        plotsChart.domainChart  = 'dates';
        plotsChart.functionAfterClickChart   = '';
        plotsChart.functionClick = function(s){ plotsChart.startDate = s+'-01-01'; plotsChart.endDate = s+'-12-31'; plotsChart.openUrl(); };
        plotsChart.getData();
        
        $('#buttonShowProviderTable').css('display','block');
        $('#botonShowInTable').css('display','none');
        $('#botonShowChartBy').css('display','none');
        $('#botonOnlyShowInProcess').css('display','block');

        $('.linkPlots').removeAttr("active"); $( '#plotTotal1' ).attr('active','');    
    },
    initStackCities : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'barCities';
        plotsChart.typeHighChart = 'bar';
        plotsChart.groupChartBy = 'byAmount';
        plotsChart.domainChart  = 'cities';
        plotsChart.functionAfterClickChart   = 'cities';
        plotsChart.functionClick = plotsChart.openUrlChart;
        plotsChart.getData(  );
        
        $('#buttonShowProviderTable').css('display','block');
        $('#botonShowInTable').css('display','none');

        $('.linkPlots').removeAttr("active"); $( '#plotTotal2' ).attr('active','');
    },
    initDepartmentsPie : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'stackedBarDepartment';
        plotsChart.typeHighChart = 'bar';
        plotsChart.groupChartBy = 'byAmount';
        plotsChart.domainChart  = 'departments';
        plotsChart.functionAfterClickChart   = 'departments';
        plotsChart.functionClick = plotsChart.openUrlChart;
        plotsChart.getData(  );
        
        $('#buttonShowProviderTable').css('display','block');
        $('#botonShowInTable').css('display','none');

        $('.linkPlots').removeAttr("active"); $( '#plotTotal3' ).attr('active','');
    },
    initAdjudicationChart: function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'stackedBarAdjudication';
        plotsChart.typeHighChart = 'bar';
        plotsChart.groupChartBy = 'byAmount';
        plotsChart.domainChart  = 'adjudication';
        plotsChart.functionAfterClickChart   = '';
        plotsChart.functionClick = function(s){console.log(s);} //function(s){plotsChart.adjudication = s; plotsChart.openUrl();} ;
        plotsChart.getData(  );

        $('#buttonShowProviderTable').css('display','block');
        $('#botonShowInTable').css('display','none');

        $('.linkPlots').removeAttr("active"); $( '#plotTotal4' ).attr('active','');
    },
    initFundingChart : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'stackedBarFunding';
        plotsChart.typeHighChart = 'bar';
        plotsChart.groupChartBy = 'byAmount';
        plotsChart.domainChart  = 'funding';
        plotsChart.functionAfterClickChart   = '';
        plotsChart.functionClick = function(s){console.log(s);} //plotsChart.chartAfterDepartmentsPie.init;
        plotsChart.getData(  );

        $('#buttonShowProviderTable').css('display','block');
        $('#botonShowInTable').css('display','none');

        $('.linkPlots').removeAttr("active"); $( '#plotTotal5' ).attr('active','');
    },
    initProvidersChart : function(){
        if( !plotsChart.allowGetData ){ return; }
        $('#waintingAnimation').css('display','block'); 
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'stackedBarProvidersByAmount';
        plotsChart.typeHighChart = 'bar';
        plotsChart.groupChartBy = 'byAmount';
        plotsChart.domainChart  = 'providers';
        plotsChart.functionAfterClickChart = '';
        plotsChart.functionClick = function(s){plotsChart.provider = s; plotsChart.openUrl();};
        plotsChart.getData();
 
        $('#buttonShowProviderTable').css('display','block');
        //$('#botonShowChartBy').css('display','none');
        
        $('.linkPlots').removeAttr("active"); $( '#plotTotal6' ).attr('active','');
    },
    citiesAfterClick: {
        init: function( cityIdDB, typeChart ){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.city = cityIdDB;
            plotsChart.chartTitle.titleGral = citiesNL[cityIdDB];
            
            var strOptions = `
                <span class="linkPlots" id="plotTotal1" active onclick="plotsChart.openChangeChart('stages');">
                    <i class="fas fa-chart-line" style="margin-right:10px;"></i> Estatus
                </span>
                <span class="linkPlots" id="plotTotal2" onclick="plotsChart.openChangeChart('departments');">
                    <i class="fas fa-building" style="margin-right:10px;"></i> Dependencias
                </span>
                <span class="linkPlots" id="plotTotal3" onclick="plotsChart.openChangeChart('providers');">
                    <i class="fas fa-user-tie" style="margin-right:10px;"></i> Contratistas
                </span>
            `;
            
            $('#radioSelects').html(strOptions);
            
            plotsChart.citiesAfterClick[typeChart]();
        },
        stages : function(){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'pieStatus';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byProjects';
            plotsChart.domainChart  = 'stages';
            plotsChart.functionClick = function(s){plotsChart.check_stage = s; plotsChart.openUrl();};
            plotsChart.getData();
            
            $('.linkPlots').removeAttr("active");$('#plotTotal1').attr('active','');
        },
        departments : function(){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'stackedBarDepartment';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byAmount';
            plotsChart.domainChart  = 'departments';
            plotsChart.functionClick = function(s){plotsChart.department = s; plotsChart.openUrl();};
            plotsChart.getData();
            
            $('#buttonShowProviderTable').css('display','block');
            $('#botonShowInTable').css('display','none');

            $('.linkPlots').removeAttr("active");$('#plotTotal2').attr('active','');
        },
        providers : function(){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'stackedBarProvidersByAmount';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byAmount';
            plotsChart.domainChart  = 'providers';
            plotsChart.functionClick = function(s){plotsChart.provider = s; plotsChart.openUrl();};
            plotsChart.getData(  );
            
            $('#buttonShowProviderTable').css('display','block');
            //$('#botonShowInTable').css('display','none');

            $('.linkPlots').removeAttr("active");$('#plotTotal3').attr('active','');
        }
    },
    departmentsAfterClick: {
        init: function( departmentIdDB, typeChart ){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.department = departmentIdDB;
            plotsChart.chartTitle.titleGral = departmentsObras[departmentIdDB];

            var strOptions = `
                <span class="linkPlots" id="plotTotal1" active onclick="plotsChart.openChangeChart('stages');">
                    <i class="fas fa-chart-line" style="margin-right:10px;"></i> Estatus
                </span>
                <span class="linkPlots" id="plotTotal2" onclick="plotsChart.openChangeChart('cities');">
                    <i class="fas fa-map" style="margin-right:10px;"></i> Municipios
                </span>
                <span class="linkPlots" id="plotTotal3" onclick="plotsChart.openChangeChart('providers');">
                    <i class="fas fa-user-tie" style="margin-right:10px;"></i> Contratistas
                </span>
            `;
            
            $('#radioSelects').html(strOptions);
            
            plotsChart.departmentsAfterClick[typeChart]();
        },
        stages : function(){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'pieStatus';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byProjects';
            plotsChart.domainChart  = 'stages';
            plotsChart.functionClick = function(s){plotsChart.check_stage = s; plotsChart.openUrl();};
            plotsChart.getData();

            $('.linkPlots').removeAttr("active");$('#plotTotal1').attr('active','');
        },
        cities : function(){ 
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'barCities';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byAmount';
            plotsChart.domainChart  = 'cities';
            plotsChart.functionClick = function(s){plotsChart.city = s; plotsChart.openUrl();} ;
            plotsChart.getData();

            $('#buttonShowProviderTable').css('display','block');
            $('#botonShowInTable').css('display','none');
            
            $('.linkPlots').removeAttr("active");$('#plotTotal2').attr('active','');
        },
        providers : function(){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'stackedBarProvidersByAmount';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byAmount';
            plotsChart.domainChart  = 'providers';
            plotsChart.functionClick = function(s){plotsChart.provider = s; plotsChart.openUrl();} ;
            plotsChart.getData( );
            
            $('#buttonShowProviderTable').css('display','block');
            //$('#botonShowChartBy').css('display','none');
        
            //$('#buttonShowProviderTable').css('display','block')
            $('.linkPlots').removeAttr("active");$('#plotTotal3').attr('active','');
        }
    },
    openUrlChart: function( idFieldInDB ){
        var functionAfterClickChart  = this.functionAfterClickChart;
        var value    = idFieldInDB;
        var domain   = '&domain=stages';
        var url      = 'graphics?chart='+functionAfterClickChart + '&value=' + value + domain;
        window.open( url ,"_self");
    },
    openChangeChart: function( typeDomain ){
        var queryStringParams = new URLSearchParams(window.location.search);
        var value         = urlParams.get('value');
        var chart        = urlParams.get('chart');
        var url      = 'graphics?chart='+ chart + '&value=' + value + '&domain=' + typeDomain;
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
        queryString += '&countProjects=' + plotsChart.countProjClick;
        var url = urlLink + queryString ;
        window.open( url ,"_self");
    },
    showByProjectsOrAmount: function(thisSelect){
        
        $('#tableOfProviders').css('display','none') ;
        $('#genl-pie-chart').css('display','block') ;
        document.getElementById('waintingAnimation').style.display = 'block';


        
        var thisObjetSelect = $(thisSelect);
        var graphicIsShowBy = plotsChart.groupChartBy ;

        if( graphicIsShowBy == 'byAmount' ){
            plotsChart.chartType = 'stackedBarProvider';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byProjects';
            var values = setJsonsHC[plotsChart.domainChart]['byProjects']( plotsChart.data );
            thisObjetSelect.html('<i class="fas fa-stream"></i> Graficar por Monto')
        }else{
            var values = setJsonsHC[plotsChart.domainChart]['byAmount']( plotsChart.data );
            plotsChart.groupChartBy = 'byAmount';
            thisObjetSelect.html('<i class="fas fa-stream"></i> Graficar por Obras')
            plotsChart.chartType = 'stackedBarProvidersByAmount';
            plotsChart.typeHighChart = 'bar';
        }


        var optionsHighChart = plotsChart.optionsStackedBar(values[0], values[1], values[2]);
        var extraSpaceWhenWindowSmall = jQuery(window).width() < 600 ? 50 : 0;
        var heightChart = values[0][0].data.length*30 + 200 + extraSpaceWhenWindowSmall;

        setTimeout(function(){  
            $('#genl-pie-chart').css('height', heightChart + 'px');
            plotsChart.chart = Highcharts.chart('genl-pie-chart', optionsHighChart);
            plotsChart.chart.render();  //Renderiza para mostrar los labels que se generan despues de crearse la grafica
            
            plotsChart.allowGetData = true; $('.linkPlots').css('cursor','pointer'); $('#waintingAnimation').css('display','none'); 
        }, 100);
        
 
          
    },
    showOnlyInProcess: function(thisSelect){

        var thisObjetSelect = $(thisSelect);
        var isShowIn = thisObjetSelect.attr('isShowIn');

        if(isShowIn == 'all'){
            plotsChart.chart.series[6].setVisible(false,false);
            thisObjetSelect.attr('isShowIn','process');
            thisObjetSelect.html('Mostrar Todas');
        }else{
            $(plotsChart.chart.series).each(function(){
                this.setVisible(true, false);
            });
            thisObjetSelect.attr('isShowIn','all');
            thisObjetSelect.html('Mostrar en Proceso');
        }
        plotsChart.chart.redraw();
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
                //console.log(res.data);
                if( plotsChart.chartType == 'pieStatus' ){
                    var values = setJsonsHC.Chart(res.data);
                    var options = plotsChart.optionsChart(values)
                    $('#genl-pie-chart').css('height','400px');
                    plotsChart.chart = Highcharts.chart('genl-pie-chart', options);
                    
                    plotsChart.allowGetData = true; $('.linkPlots').css('cursor','pointer'); $('#waintingAnimation').css('display','none');

                    return '';

                }else {
                    var values = setJsonsHC[plotsChart.domainChart][plotsChart.groupChartBy](res.data);
                }
                
                var optionsHighChart = plotsChart.optionsStackedBar(values[0], values[1], values[2]);
                var extraSpaceWhenWindowSmall = jQuery(window).width() < 600 ? 50 : 0;
                var columnHeight = plotsChart.typeHighChart == 'column' ? 130 : 0;
                var heightChart = values[0][0].data.length*30 + 230 + extraSpaceWhenWindowSmall + columnHeight ;
                $('#genl-pie-chart').css('height', heightChart + 'px');
                plotsChart.chart = Highcharts.chart('genl-pie-chart', optionsHighChart);
                plotsChart.chart.render();  //Renderiza para mostrar los labels que se generan despues de crearse la grafica
                
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
                                plotsChart.countProjClick = this.y;
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
                            
                            var sfcat = parseInt(amount/1000).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                            return '<b>' + point.y + ' ' + point.name + ' <span style="color:#446;">$' + sfcat + ' K</span>';
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

        var preffixTooltip = plotsChart.groupChartBy == 'byAmount' ? '$' : '';
        var titleXAxis     = plotsChart.groupChartBy == 'byAmount' ? 'Montos' : 'Número de Obras';
        var labelsPositionsX = plotsChart.typeHighChart == 'bar' ? 5  : undefined;
        var labelsPositionsY = plotsChart.typeHighChart == 'bar' ? 10 : -20;
        var alignLabel       = plotsChart.typeHighChart == 'bar' ? 'right' : 'center';
        var paddingRightChart= plotsChart.typeHighChart == 'bar' ? 68 : 0;
        var groupPaddingColumn = jQuery(window).width() < 600 ? 0.13 : 0.2;

        var options = {
            chart: {
                type: plotsChart.typeHighChart,
                spacingRight: paddingRightChart,
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
                                
                                if( plotsChart.groupChartBy == 'byAmount' ){
                                    plotsChart.chartTitle.obras  = countAmount;
                                    plotsChart.chartTitle.amount = countObras;
                                }else{
                                    plotsChart.chartTitle.obras  = totalProjectsVisible;
                                    plotsChart.chartTitle.amount = countAmount;
                                }

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
   	    	tooltip: {
                valueDecimals: 0,
                valuePrefix: preffixTooltip,
   	    	},
            xAxis: {
                categories: categories,
                labels: {
                    step: 1
                }
            },
            yAxis: {
                maxPadding: 0.1,
                stackLabels: {
                    enabled: true,
                    align: alignLabel,
                    allowOverlap: true,
                    style: {
                        color: '#226',
                        fontWeight: 'bold'
                    },
                    x: labelsPositionsX,
                    y: labelsPositionsY,
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

                        if( plotsChart.groupChartBy == 'byAmount' ){
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
                        return '<span style="color:#000;font-weight:700;">'+ totalY + '</span><br><span style="color:#336;margin-left:13px;font-weight:100;">'+ amount +'</span>';
                    }
                },
                title:{
                    text: '<span style="color:#000; font-weight: 700;">' + titleXAxis + '</span>'
                },
                labels: {
                    rotation: 0,
                    autoRotation: 0,
                    autoRotationLimit: 0,
                    formatter: function () {
                        var val = this.value
                        if( val > 1000000){
                            var newVal = val / 1000000;
                            val = newVal + ' M'
                        }
                        return val;
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
                column: {
                    groupPadding: groupPaddingColumn,
                    point: {
   	                    events: {
   	                        click: function () {
                                if( plotsChart.groupChartBy == 'byAmount' ){
                                    var series = plotsChart.chart.series; //status
                                    var thisX = this.x;
                                    var sumAmounts = 0;
                                    for( var s in series ){ //Son 7
                                        if(series[s].data.length){
                                            if(series[s].visible){
                                                sumAmounts += series[s].data[thisX].amount;
                                            }
                                        }
                                    }
                                }else{
                                    var sumAmounts = this.total;
                                }
                                plotsChart.countProjClick = sumAmounts;
                                plotsChart.functionClick( this.category );
   	                        }
   	                    }
   	                }
                },
                bar: {
                    groupPadding:0,
                    //pointWidth:10
                    point: {
   	                    events: {
   	                        click: function () {
                                if( plotsChart.groupChartBy == 'byAmount' ){
                                    var series = plotsChart.chart.series; //status
                                    var thisX = this.x;
                                    var sumAmounts = 0;
                                    for( var s in series ){ //Son 7
                                        if(series[s].data.length){
                                            if(series[s].visible){
                                                sumAmounts += series[s].data[thisX].amount;
                                            }
                                        }
                                    }
                                }else{
                                    var sumAmounts = this.total;
                                }
                                plotsChart.countProjClick = sumAmounts;
                                plotsChart.functionClick( this.idFieldDB );
   	                        }
   	                    }
   	                }
                }
            },
            credits: {
                enabled: false
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

var recipe = new Array();
var srchRespText;
var repRespText;
var isFirstSearch = true;
//ingMap needs to hold: Key: NDBNO => Vals: Ingredient Name, NDBNO, Measurements[]
var ingMap;

//The params for the Search api
var usdaSearchParams = {
    'api_key': 'eHDUp1GiaXeC0jgCPqJObRZ8UVIHWIIiBd27FKLc',
    'max': 5,
    'ds': 'Standard Reference',
    'format': 'json'
};

//The params for the Food Report api
var usdaReportParams = {
    'api_key': 'eHDUp1GiaXeC0jgCPqJObRZ8UVIHWIIiBd27FKLc',
    'format': 'json',
}

function objectToParams(objToParam){
    var strParams = '';
    for (var prop in objToParam){
        strParams += '&' + prop + '=' + objToParam[prop];
    }
    return strParams;
}

//Get the top 5 search results from the input text
function getTop5Results(inputIngredient, usdaParams){
    var url = 'http://api.nal.usda.gov/ndb/search?';
    var http = new XMLHttpRequest;
    
    http.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            srchRespText = JSON.parse(http.responseText);
            popTop5(srchRespText);
        }
    }
    url += objectToParams(usdaParams) + "&q=" + inputIngredient;
    http.open("GET", url, true);
    http.send();
}

//Get the food reports from the search results
function getTop5FoodReports(usdaParams){
    var url = ' https://api.nal.usda.gov/ndb/reports/V2?';
    var http = new XMLHttpRequest;
    
    http.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            repRespText = JSON.parse(http.responseText);
        }
    }
    url += objectToParams(usdaParams);
    for (var ing in srchRespText.list.item){
        url += '&ndbno=' + ing.ndbno;
    }
    http.open("GET", url, true);
    http.send();
}   

//Populate the select list with the search results
function popTop5(apiResp){
    //Add the top 5 ingredients from the api request
    $('#divTop5Ing').append('<select id="selTop5Ing" />');
    $.each(apiResp.list.item,function(){
        $('#selTop5Ing').append($('<option />').val(this.ndbno).text(this.name));
    });
    //Add the Add Ingredient button
    $('#selTop5Ing').after($('<input />').attr('type', 'button').attr('id', 'addIngredient').attr('value','Add Ingredient'));
}

//Populate the measurement options from the selected ingredient
function popMeasurements(ingredient){
    $('#selTop5Ing').after('<select id="ingMeasurements" />');
    $('#ingMeasurements').append('<option />').attr('')
}
function clickSearch(){
    if (!isFirstSearch){
        $('#divTop5Ing').empty();
    }else{
        isFirstSearch = false;
    }
    getTop5Results($('#srchIngredient').val(), usdaSearchParams;
    getTop5FoodReports(usdaReportParams);
}

function submitIngredient(ndbno){
    var selectList = document.getElementById("selTop5Ing");
    var selItemLabel = selectList.selectedOptions[0].label;
    recipe.push(selItemLabel);
    getFoodReport(ndbno, getUsdaParams());
}

function getFoodReport(ndbno, usdaParams){
    
    var url = 'http://api.nal.usda.gov/ndb/report?'
    var http = new XMLHttpRequest;
    
    http.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            console.log("Response Text: " + http.responseText);
            return JSON.parse(http.responseText);
        }
    }
    url += JSON.stringify(usdaParams) + "&ndbno=" + ndbno;
    http.open("GET", url, true);
    http.send();
}

$(document).ready(function(){
    //get search results
    $('#searchButton').on('click', function(){
        clickSearch();
    });
    $('#selTop5Ing').change(function(){
        popMeasurements(this.val());
    });
});
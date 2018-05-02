
var miMapa;

require(["esri/map",
"esri/geometry/Point",
"esri/tasks/query",
"esri/symbols/SimpleMarkerSymbol",
"esri/symbols/SimpleLineSymbol",
"esri/symbols/SimpleFillSymbol",
"esri/Color",
"esri/tasks/QueryTask",
"esri/layers/GraphicsLayer",
"esri/geometry/Circle",
"esri/graphic",
"esri/units",
"esri/renderers/SimpleRenderer",
"dojo/domReady!"], function(Map,
  Point,
  Query,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  SimpleFillSymbol,
  Color,
  QueryTask,
  GraphicsLayer,
  Circle,
  Graphic,
  units,
  SimpleRenderer) {


miMapa = new Map("mapaCont", {

"basemap": "hybrid",
"center": [-17.93,28.66],
"zoom": 10

});




var gl = new GraphicsLayer();
miMapa.addLayer (gl);


var line = new SimpleLineSymbol();
line.setColor(new Color([230, 0, 0, 1]));
var marker = new SimpleMarkerSymbol();
marker.setColor(new Color([255, 0, 0, 1]));
marker.setOutline(line);
marker.setSize(24);


var render = new SimpleRenderer(marker);

gl.setRenderer(render);



var miQuery = new Query();


miQuery.where = "PLAZAS > 500";
miQuery.outFields = ["*"];
miQuery.outSpatialReference = miMapa.spatialReference;
miQuery.returnGeometry = true;






var urlCiudadesUsa = "https://services.arcgis.com/hkQNLKNeDVYBjvFE/arcgis/rest/services/Alojamientos_turisticos/FeatureServer/0"
var miQueryTask = new QueryTask(urlCiudadesUsa);












miMapa.on ("click", hacerConsulta);

var inputRadio = document.getElementById ("inputRadio");

inputRadio.onchange = actualizaRadio;



function actualizaRadio(){
  var inputRadio2 = document.getElementById("inputRadio");
  var radio = inputRadio2.value;

  var txtRadio = document.getElementById("txtRadio");
  txtRadio.innerHTML = radio;
}


/*Esto hace que cuando hagamos cambios en el span se
vean reflejados en el texto, un onchange que hace que se actualice el cambio,
sin esto sería imposible ya que haría el cambio después de hacer la consulta*/


var rango = document.getElementById ("rango");

rango.onchange = hacerConsulta;




function hacerConsulta (objEvento) {

  var rangoPoblación = document.getElementById("rango");
  var rangoPob =  rangoPoblación.value;
  var txtRango = document.getElementById("txtRango");
  txtRango.innerHTML = rangoPob;


var rangoPoblación2 = document.getElementById("rango");
miQuery.where = "PLAZAS >" + rangoPoblación2.value;
var pt = objEvento.mapPoint;





var rangoCirculo = document.getElementById("inputRadio");
var circulo = new Circle(pt, {
  radius : rangoCirculo.value,
  radiusUnit: units.METERS
});


var fill = new SimpleFillSymbol();




var grCirculo = new Graphic(circulo,fill);
gl.clear();
gl.add (grCirculo);


miQuery.geometry = circulo;
miQuery.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;






miQueryTask.execute(miQuery,miCallback, miErrback);


}


function miCallback (result) {
    /*miMapa.graphics.clear();*/

  var arrayGraficos =  result.features;
  var ciudades = "";


  for (var i = 0; i < arrayGraficos.length; i++) {
    var gr = arrayGraficos[i]
  /*gr.symbol = marker;*/
  var attributes = gr.attributes;
  ciudades = ciudades + attributes.NOMBRE + ",";
  gl.add(gr);


  /*miMapa.graphics.add(gr);*/
  }

var txtCiudades = document.getElementById ("txtCiudades");
txtCiudades.innerHTML = ciudades;

};




function miErrback () {


  alert ("Ha habido un problema , vuelve a ejecutar la consulta.");


}



});

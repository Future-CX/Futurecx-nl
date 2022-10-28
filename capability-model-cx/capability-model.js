let html = "";
let capabilityDescription = "";
let allCapabilitiesAndLayers = [];
let allLevelOneLayers = [];
let allLevelTwoLayers = [];
let allLevelOneCapabilities = [];
let allLevelTwoCapabilities = [];
let enableHover = false;
let enableClick = true;
let showLevel2 = true;

(function() {
  var jsonfile = "capabilities.json";
  $.getJSON( jsonfile)
    .done(function( data ) {
    	allCapabilitiesAndLayers = data;
    	//console.log( "Request Done." );
        //console.log( allCapabilitiesAndLayers );
        console.log( "Number of layers: " + allCapabilitiesAndLayers.layers.length );
        console.log( "Number of capabilities: " + allCapabilitiesAndLayers.capabilities.length );	
        //JSON.parse(allCapabilitiesAndLayers);
    	capabilityModel('initiate');
    })
    .fail(function( jqxhr, textStatus, error ) {
	    var err = textStatus + ", " + error;
	    console.log( "Request Failed: " + err );
	});
})();



document.addEventListener('DOMContentLoaded', function(event) {
	capabilityModel('update');
})





function capabilityModel(method) {
  //console.log("allCapabilitiesAndLayers");
  //console.log(allCapabilitiesAndLayers);
    
  if(method == 'initiate'){
        //console.log( "sortLayers()");
        sortLayers();
        //console.log( "sortLayers() DONE");
        //console.log( "sortCapabilities()");
	    sortCapabilities();
        //console.log( "sortCapabilities() DONE");
	}
	if(method == 'update'){
		enableHover = document.getElementById("switchhover").checked;
		enableClick = document.getElementById("switchclick").checked;
		showLevel2 = document.getElementById("switchlevel2").checked;
	}
    
    //console.log( "createLayers()");
    createLayers();
    //console.log( "createLayers() DONE");
    //createCapabilities();
    //document.addEventListener('DOMContentLoaded', function(event) {
    	document.getElementById("capability-model").innerHTML = html;
    	setClickEvents();
    	addStyling();
    //})
    //if(method == 'update'){
    //	document.getElementById("capability-model").innerHTML = html;
    //	setClickEvents();
    //	addStyling();
    //}
}

function createLayers() {
    //console.log( "createLayers()");

    html = "";
    var stringLayer = '<div id="layer-%layerid%" class="row layer"><div class="name name-layer"><h4>%name%</h4></div><div class="description description-layer"><p>%description%</p></div>';
    var stringSublayer = '<div id="sublayer-%layerid%" class="row col sublayer"><div class="name name-sublayer"><h4>%name%</h4></div><div class="description description-sublayer"><p>%description%</p></div>';

    jQuery.each(allLevelOneLayers, function(i, layer) {
        
        html += stringLayer.replace("%layerid%", layer.id).replace("%name%", layer.name).replace("%description%", layer.description);

        createCapabilities(layer);

        if( hasSubLayers(layer) === true ){
	        jQuery.each(allLevelTwoLayers, function(i, sublayer) {
	            if (sublayer.parent_layer === layer.id) {
	                html += stringSublayer.replace("%layerid%", sublayer.id).replace("%name%", sublayer.name).replace("%description%", sublayer.description);
	            }

	            createCapabilities(sublayer);

	            html += "</div>";

	        });
	      }

        html += "</div>";

    });

}

function createCapabilities(layer) {

    var stringCapabilityL1 = '<div id="capability-l1-%id%" class="col capabilityl1" onmouseover="setDescription(\'%id%\', \'hover\')" onclick="setDescription(\'%id%\', \'click\')"><div class="name name-capabilityl1"><h5>%name%</h5></div><div class="description description-capabilityl1"><p>%description%</p></div>';
    var stringCapabilityL2 = '<div id="capability-l2-%id%" class="row capabilityl2" onmouseover="setDescription(\'%id%\', \'hover\')" onclick="setDescription(\'%id%\', \'click\')"><div class="name name-capabilityl2"><h6>%name%</h6></div><div class="description description-capabilityl2"><p>%description%</p></div></div>';

    var stringCapabilityL1 = '<div id="capability-l1-%id%" class="col capabilityl1" onmouseover="setDescription(\'%id%\', \'hover\')" onclick="setDescription(\'%id%\', \'click\')"><div class="name name-capabilityl1"><h5>%name%</h5></div>';
    var stringCapabilityL2 = '<div id="capability-l2-%id%" class="row capabilityl2" onmouseover="setDescription(\'%id%\', \'hover\')" onclick="setDescription(\'%id%\', \'click\')"><div class="name name-capabilityl2"><h6>%name%</h6></div></div>';

    var stringCapabilityL1 = '<div id="capability-l1-%id%" class="col capability capabilityl1" data-capability="%id%"><div class="name name-capabilityl1"><h5>%name%</h5></div>';
    var stringCapabilityL2 = '<div id="capability-l2-%id%" class="row capability capabilityl2" data-capability="%id%"><div class="name name-capabilityl2"><h6>%name%</h6></div></div>';

    jQuery.each(allLevelOneCapabilities, function(i, capabilityl1) {

        //console.log(capabilityl1.layerid + " - " + layer.id);
        if (capabilityl1.layerid == layer.id) {
            html += stringCapabilityL1.replaceAll("%id%", capabilityl1.id).replaceAll("%name%", capabilityl1.name).replaceAll("%description%", capabilityl1.name);

            if(showLevel2){
	            jQuery.each(allLevelTwoCapabilities, function(i, capabilityl2) {
	                if (capabilityl2.parent_capability == capabilityl1.id) {
	                    html += stringCapabilityL2.replaceAll("%id%", capabilityl2.id).replaceAll("%name%", capabilityl2.name).replaceAll("%description%", capabilityl2.name);
	                }
	            });
	        }

            html += "</div>";
        }

    });
}

function sortLayers() {

    jQuery.each(allCapabilitiesAndLayers.layers, function(i, layer) {
        //console.log(layer.parent_capability);
        if (layer.parent_layer == null || layer.parent_layer == "null") {
            allLevelOneLayers.push(layer);

        } else {
            allLevelTwoLayers.push(layer);

        }
    });

    if(allLevelOneLayers.length === 0){
        console.error("No Level One Layers found");
    }

    //console.log(allCapabilitiesAndLayers);
    //console.log(allLevelOneLayers);
    //console.log(allLevelTwoLayers);
}

function sortCapabilities() {

    jQuery.each(allCapabilitiesAndLayers.capabilities, function(i, capability) {
        //console.log(capability.parent_capability);
        if (capability.parent_capability == null || capability.parent_capability == "null") {
            allLevelOneCapabilities.push(capability);

        } else {
            allLevelTwoCapabilities.push(capability);

        }
    });

    if(allLevelOneCapabilities.length === 0){
        console.error("No Level One Capabilities found");
    }
    //console.log(allCapabilitiesAndLayers);
    //console.log(allLevelOneCapabilities);
    //console.log(allLevelTwoCapabilities);
}

function setDescription(capabilityId, event) {

    if (event == "hover" && enableHover == false) { return; }
    if (event == "click" && enableClick == false) { return; }


    var result = allCapabilitiesAndLayers.capabilities.filter(
        function(data) {
            return data.id == capabilityId
        });

    capabilityName = result[0].name;
    capabilityDescription = result[0].description;

    document.getElementById("capability-description").innerHTML = "<h4>"+capabilityName+"</h4><p>"+capabilityDescription+"</p>";
}

function setClickEvents(){
   var elements = document.getElementsByClassName('capability');
   for(var i = 0; i < elements.length; i++){
      elements[i].onclick = function(event){ 
      	//console.log(this.dataset.capability);
      	event.stopPropagation();
      	setDescription(this.dataset.capability, 'click');
      };
      elements[i].onmouseover = function(event){ 
      	//console.log(this.dataset.capability);
      	event.stopPropagation();
      	setDescription(this.dataset.capability, 'hover');
      };
   }
}

function hasSubLayers(layer){

	var haslayers = false;

	//console.log(layer.id);
	jQuery.each(allLevelTwoLayers, function(i, sublayer) {
		
		//console.log(layer.id + ": " + sublayer.id + " = " + sublayer.parent_layer);

		if(sublayer.parent_layer === layer.id){
			//console.log(true);
			haslayers = true;
		}
	});

	return haslayers;
}

function addStyling(){
	/* EQUAL HEIGHT */
	$(function() {
		$('h5').matchHeight();
	});
}
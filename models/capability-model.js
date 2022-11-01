let html = '';
let capabilityDescription = '';
let allData = [];
let allLevelOneLayers = [];
let allLevelTwoLayers = [];
let allLevelOneDomains = [];
let allLevelTwoDomains = [];
let allLevelOneCapabilities = [];
let allLevelTwoCapabilities = [];
let enableHover = false;
let enableClick = true;
let showLevel2 = true;

(function () {
	var jsonfile = 'capabilities.json';
	$.getJSON(jsonfile)
		.done(function (data) {
			allData = data;
			//console.log( "Request Done." );
			//console.log( allData );
			//console.log( "Number of layers: " + allData.layers.length );
			//console.log( "Number of domains: " + allData.domains.length );
			//console.log( "Number of capabilities: " + allData.capabilities.length );
			//JSON.parse(allData);
			capabilityModel('initiate');
		})
		.fail(function (jqxhr, textStatus, error) {
			var err = textStatus + ', ' + error;
			console.log('Request Failed: ' + err);
		});
})();

document.addEventListener('DOMContentLoaded', function (event) {
	//capabilityModel('update');
});

function capabilityModel(method) {
	//console.log("allData");
	//console.log(allData);

	if (method == 'initiate') {
		//console.log( "sortDomains()");
		sortDomains();
		//console.log( "sortDomains() DONE");
		//console.log( "sortLayers()");
		sortLayers();
		//console.log( "sortLayers() DONE");
		//console.log( "sortCapabilities()");
		sortCapabilities();
		//console.log( "sortCapabilities() DONE");
	}
	//if(method == 'update'){
	enableHover = document.getElementById('switchhover').checked;
	enableClick = document.getElementById('switchclick').checked;
	showLevel2 = document.getElementById('switchlevel2').checked;
	//}

	//console.log( "createContainers()");
	createContainers();
	//console.log( "createContainers() DONE");
	//createCapabilities();
	//document.addEventListener('DOMContentLoaded', function(event) {
	document.getElementById('capability-model').innerHTML = html;
	setClickEvents();
	addStyling();
	//})
	//if(method == 'update'){
	//	document.getElementById("capability-model").innerHTML = html;
	//	setClickEvents();
	//	addStyling();
	//}
}

function createContainers() {
	html = '';
	var stringLayerOrDomain = 'domain';
	var stringRowOrColumn = 'col';
	var stringContainer =
		'<div id="' +
		stringLayerOrDomain +
		'-%containerid%" class="%roworcolumn% ' +
		stringLayerOrDomain +
		'"><div class="name name-container"><h4>%name%</h4></div><div class="description description-container"><p>%description%</p></div>';
	var stringSubContainer =
		'<div id="sub' +
		stringLayerOrDomain +
		'-%containerid%" class="row col sub' +
		stringLayerOrDomain +
		'"><div class="name name-subcontainer"><h4>%name%</h4></div>';

	jQuery.each(allLevelOneDomains, function (i, container) {
		html += stringContainer
			.replace('%roworcolumn%', stringRowOrColumn)
			.replace('%containerid%', container.id)
			.replace('%name%', container.name)
			.replace('%description%', container.description);

		createCapabilities(container);

		if (hasSubs(container) === true) {
			jQuery.each(allLevelTwoDomains, function (i, subcontainer) {
				if (subcontainer.parent === container.id) {
					console.log(container.id + ' / ' + subcontainer.id);
					html += stringSubContainer
						.replace('%containerid%', subcontainer.id)
						.replace('%name%', subcontainer.name)
						.replace('%description%', subcontainer.description);
					createCapabilities(subcontainer);
					html += '</div>';
				}
			});
		}
		html += '</div>';
	});
}

function createCapabilities(container) {
	var stringCapabilityL1 =
		'<div id="capability-l1-%id%" class="row capabilityl1" onmouseover="setDescription(\'%id%\', \'hover\')" onclick="setDescription(\'%id%\', \'click\')"><div class="name name-capabilityl1"><h5>%name%</h5></div><div class="description description-capabilityl1"><p>%description%</p></div>';
	var stringCapabilityL2 =
		'<div id="capability-l2-%id%" class="row capabilityl2" onmouseover="setDescription(\'%id%\', \'hover\')" onclick="setDescription(\'%id%\', \'click\')"><div class="name name-capabilityl2"><h6>%name%</h6></div><div class="description description-capabilityl2"><p>%description%</p></div></div>';

	var stringCapabilityL1 =
		'<div id="capability-l1-%id%" class="row capabilityl1" onmouseover="setDescription(\'%id%\', \'hover\')" onclick="setDescription(\'%id%\', \'click\')"><div class="name name-capabilityl1"><h5>%name%</h5></div>';
	var stringCapabilityL2 =
		'<div id="capability-l2-%id%" class="row capabilityl2" onmouseover="setDescription(\'%id%\', \'hover\')" onclick="setDescription(\'%id%\', \'click\')"><div class="name name-capabilityl2"><h6>%name%</h6></div></div>';

	var stringCapabilityL1 =
		'<div id="capability-l1-%id%" class="row capability capabilityl1 align-middle" data-capability="%id%"><div class="name name-capabilityl1 align-middle"><h5>%name%</h5></div>';
	var stringCapabilityL2 =
		'<div id="capability-l2-%id%" class="row capability capabilityl2 align-middle" data-capability="%id%"><div class="name name-capabilityl2 align-middle"><h6>%name%</h6></div></div>';

	jQuery.each(allLevelOneCapabilities, function (i, capabilityl1) {
		//console.log(capabilityl1.containerid + " - " + container.id);
		if (capabilityl1.containerid == container.id) {
			html += stringCapabilityL1
				.replaceAll('%id%', capabilityl1.id)
				.replaceAll('%name%', capabilityl1.name)
				.replaceAll('%description%', capabilityl1.name);

			if (showLevel2) {
				jQuery.each(allLevelTwoCapabilities, function (i, capabilityl2) {
					if (capabilityl2.parent == capabilityl1.id) {
						html += stringCapabilityL2
							.replaceAll('%id%', capabilityl2.id)
							.replaceAll('%name%', capabilityl2.name)
							.replaceAll('%description%', capabilityl2.name);
					}
				});
			}

			html += '</div>';
		}
	});
}

function sortDomains() {
	jQuery.each(allData.domains, function (i, domain) {
		//console.log(domain.parent);
		if (domain.parent == null || domain.parent == 'null') {
			allLevelOneDomains.push(domain);
		} else {
			allLevelTwoDomains.push(domain);
		}
	});

	if (allLevelOneDomains.length === 0) {
		console.error('No Level One Domains found');
	}

	//console.log(allData);
	//console.log(allLevelOneDomains);
	//console.log(allLevelTwoDomains);
}

function sortLayers() {
	jQuery.each(allData.layers, function (i, layer) {
		//console.log(layer.parent);
		if (layer.parent == null || layer.parent == 'null') {
			allLevelOneLayers.push(layer);
		} else {
			allLevelTwoLayers.push(layer);
		}
	});

	if (allLevelOneLayers.length === 0) {
		console.error('No Level One Layers found');
	}

	//console.log(allData);
	//console.log(allLevelOneLayers);
	//console.log(allLevelTwoLayers);
}

function sortCapabilities() {
	jQuery.each(allData.capabilities, function (i, capability) {
		//console.log(capability.parent);
		if (capability.parent == null || capability.parent == 'null') {
			allLevelOneCapabilities.push(capability);
		} else {
			allLevelTwoCapabilities.push(capability);
		}
	});

	if (allLevelOneCapabilities.length === 0) {
		console.error('No Level One Capabilities found');
	}
	//console.log(allData);
	//console.log(allLevelOneCapabilities);
	//console.log(allLevelTwoCapabilities);
}

function setDescription(capabilityId, event) {
	if (event == 'hover' && enableHover == false) {
		return;
	}
	if (event == 'click' && enableClick == false) {
		return;
	}

	var result = allData.capabilities.filter(function (data) {
		return data.id == capabilityId;
	});

	capabilityName = result[0].name;
	capabilityDescription = result[0].description;

	document.getElementById('capability-description').innerHTML = '<h4>' + capabilityName + '</h4><p>' + capabilityDescription + '</p>';
}

function setClickEvents() {
	var elements = document.getElementsByClassName('capability');
	for (var i = 0; i < elements.length; i++) {
		elements[i].onclick = function (event) {
			//console.log(this.dataset.capability);
			event.stopPropagation();
			setDescription(this.dataset.capability, 'click');
		};
		elements[i].onmouseover = function (event) {
			//console.log(this.dataset.capability);
			event.stopPropagation();
			setDescription(this.dataset.capability, 'hover');
		};
	}
}

function hasSubs(container) {
	var hassubs = false;

	//console.log(container.id);
	jQuery.each(allLevelTwoLayers, function (i, sub) {
		//console.log(container.id + ": " + sub.id + " = " + sub.parent);

		if (sub.parent === container.id) {
			//console.log(true);
			hassubs = true;
		}
	});

	jQuery.each(allLevelTwoDomains, function (i, sub) {
		//console.log(container.id + ": " + sub.id + " = " + sub.parent);

		if (sub.parent === container.id) {
			//console.log(true);
			hassubs = true;
		}
	});

	return hassubs;
}

function addStyling() {
	/* EQUAL HEIGHT */
	$(function () {
		$('h5').matchHeight();
	});
}

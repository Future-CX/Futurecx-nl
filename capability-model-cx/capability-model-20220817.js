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
     	capabilityModel('initiate');
    })
    .fail(function( jqxhr, textStatus, error ) {
	    var err = textStatus + ", " + error;
	    console.log( "Request Failed: " + err );
	});
})();

//FOR TESTING ONLY
if(location.hostname != "futurecx.nl"){
	//console.log("LOCALHOST");
	let singlelinejson = '{"capabilities":[{"id":"web","name":"Web","short_description":"Short Description","description":"Long description","layerid":"owned","parent_capability":null},{"id":"social","name":"Social","short_description":"Short Description","description":"Long description","layerid":"notowned","parent_capability":null},{"id":"omnichannel-marketing","name":"Omnichannel Marketing","short_description":"Short Description","description":"Long description","layerid":"omnichannel-interaction","parent_capability":null},{"id":"search","name":"Search","short_description":"Short Description","description":"Search allows customers to better seek information on products and services the ANWB offers and help customers make better decisions what product or service they need. An Enterprise Search is connected to many data sources, like Product Data, Content, Knowledge Articles, Digital Assets, etc. Search can be personalized using customer data, like interests, browsing behavior, previous bought products or services or profile data. A search query can be executed by inputting text in a search field or, when connected to a conversational platform, via chatbot or voicebot.A strong benefit of a good search is to avoid customers calling Customer Service Agents with their questions and enable more self-service for the customers.","layerid":"engagement-services","parent_capability":null},{"id":"omnichannel-sales","name":"Omnichannel Sales","short_description":"Short Description","description":"Long description","layerid":"omnichannel-interaction","parent_capability":null},{"id":"customer-management","name":"Customer Management","short_description":"Short Description","description":"Long description","layerid":"omnichannel-interaction","parent_capability":null},{"id":"omnichannel-service","name":"Omnichannel Service","short_description":"Short Description","description":"Long description","layerid":"omnichannel-interaction","parent_capability":null},{"id":"personalisation","name":"Personalisation","short_description":"Short Description","description":"Personalization is tailoring an interaction or conversation based on information a company has learned about an individual. Just like you may tailor a gift for a good friend, companies can tailor content, product offerings and promotions based on information they learn about their customers. Personalization is especially effective at driving repeat engagement and loyalty over time. Recurring interactions create more data from which brands can design ever-more relevant experiences—creating a flywheel effect that generates strong, long-term customer lifetime value and loyalty.","layerid":"engagement-services","parent_capability":null},{"id":"content-management","name":"Content Management","short_description":"Short Description","description":"Content Management is collection, delivery, retrieval, governance and overall management of information in any format. Having a Content Management solution for your organisation allows you to have control of your content. It means having the ability to update, change or delete any images, text, video, or audio. Content Management includes text, rich media, graphics, photos, video and audio for any channel. To create a consistent message via all channels it is crucial to place Content Management from one single source to all channels, online and offline. The Content Management solution will deliver content to web, app, email marketing, social marketing, customer service agents, workforce, shops, field mechanics, etc. A Content Manager is a professional who has a unique role in developing the companys brand and establishing its online presence.","layerid":"engagement-services","parent_capability":null},{"id":"channel-mgt-routing","name":"Channel Mgt & Routing","short_description":"Short Description","description":"A communication platform is a (cloud-based) solution that allows organisations to add communication services like messaging, voice and video to their business applications and processes. Some of the most used applications of a cloud-based communication platform include videoconferencing, chat and email messaging. Via a smart routing (rule)engine the customer is routed/directed to correct resource. That could be a service agent with the requested expertise or a self-service portal or a chatbot that can quickly respond to the question of the customer.","layerid":"omnichannel-interaction","parent_capability":null},{"id":"conversational-ai","name":"Conversational AI","short_description":"Short Description","description":"Conversational AI enables customers to interact with IT applications the way they would with other humans. Conversational AI has primarily taken the form of advanced chatbots via both speech and text. It includes managing the output of the dialogue (content, tone-of-voice, ..), but also natural language processing (NLP) and intent and sentiment recognition. With Conversational AI a lot of customer data is gathered and analysed by listening to the customer and from their perspective. Other then just the factual complaint itself, also the emotions and reasoning is captured.","layerid":"engagement-services","parent_capability":"channel-mgt-routing"},{"id":"customer-experience-management","name":"Customer Experience Mgt","short_description":"Short Description","description":"Customer Experience Management (CXM) is the discipline of understanding customers and deploying strategic plans that enable crossfunctional efforts and customer-centric culture to improve satisfaction, loyalty and advocacy. The goal of customer experience management is to build customer loyalty and to reduce customer churn.","layerid":"omnichannel-interaction","parent_capability":null},{"id":"community-management","name":"Community Management","short_description":"Short Description","description":"Community management is building an authentic community among a businesss customers, employees, and partners through various types of interaction. Its how a brand interact with their audience to create a network in which they can connect, share, and grow. Nurturing groups of people around ANWB brand or organization, and stimulating interaction between community members and generation of user content.","layerid":"omnichannel-interaction","parent_capability":null},{"id":"outbound-messaging","name":"Outbound Messaging","short_description":"Short Description","description":"An outbound message is a message routed from an application and delivered to the customers phone, email inbox or home. This can be a notification like a message, email or icon that appears when a mobile application wants you to pay attention (push notification). Or an email or letter with product or service information. The solution offers regulation of messages and notifications to managing the contact pressure on a customer, so they dont feel spammed.","layerid":"omnichannel-interaction","parent_capability":null},{"id":"social-media-management","name":"Social Media Management","short_description":"Short Description","description":"Social media management is analyzing social media audiences and developing a strategy that’s tailored to them, creating and distributing content for social media profiles, monitoring online conversations, collaborating with influencers, providing community service, and monitoring, measuring, and reporting on social media performance and ROI.","layerid":"omnichannel-interaction","parent_capability":"customer-experience-management"},{"id":"pricing","name":"Pricing","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":null},{"id":"payment","name":"Payment","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":null},{"id":"delivery-management","name":"Delivery Management","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":null},{"id":"travel-planning","name":"Travel Planning","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":null},{"id":"travel-booking","name":"Travel Booking","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":null},{"id":"promotions","name":"Promotions","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"omnichannel-marketing"},{"id":"invoicing","name":"Invoicing","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"omnichannel-sales"},{"id":"task-workflow-management","name":"Task & Workflow Management","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":null},{"id":"ciam","name":"CIAM","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"customer-management"},{"id":"my-profile","name":"My Profile","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"customer-management"},{"id":"cart-checkout","name":"Cart & Checkout","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"omnichannel-sales"},{"id":"quotes","name":"Quotes","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"omnichannel-sales"},{"id":"agent-desktop","name":"Agent Desktop","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"omnichannel-service"},{"id":"case-management","name":"Case Management","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"omnichannel-service"},{"id":"livechat","name":"Live Chat","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"omnichannel-service"},{"id":"chatbot","name":"Chatbot","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"channel-mgt-routing"},{"id":"voicebot","name":"Voicebot","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"channel-mgt-routing"},{"id":"telephony","name":"Telephony","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"channel-mgt-routing"},{"id":"push-messaging","name":"Push Messaging","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"outbound-messaging"},{"id":"email-smtp","name":"Email SMTP","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"outbound-messaging"},{"id":"letters","name":"Letters","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"outbound-messaging"},{"id":"service-messages","name":"Service Messages","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"outbound-messaging"},{"id":"routing","name":"Routing","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"outbound-messaging"},{"id":"campaigns","name":"Campaigns","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"omnichannel-marketing"},{"id":"reward-loyalty","name":"Reward & Loyalty","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"omnichannel-marketing"},{"id":"propositions","name":"Propositions","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"omnichannel-marketing"},{"id":"customer-feedback","name":"Customer Feedback","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"customer-experience-management"},{"id":"reviews","name":"Reviews","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"customer-experience-management"},{"id":"next-best-action","name":"Next Best Action","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"personalisation"},{"id":"content-recommendation","name":"Content Recommendation","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"personalisation"},{"id":"product-recommendation","name":"Product Recommendation","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"personalisation"},{"id":"segmentation","name":"Segmentation","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"personalisation"},{"id":"route-planning","name":"Route Planning","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"travel-planning"},{"id":"route-guidance","name":"Route Guidance","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"travel-planning"},{"id":"booking-engine","name":"Booking Engine","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"travel-booking"},{"id":"omnichannel payment","name":"Omnichannel Payment","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"payment"},{"id":"subscriptions","name":"Subscriptions","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"payment"},{"id":"consent-management","name":"Consent Management","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"customer-management"},{"id":"preference-management","name":"Preference Management","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"customer-management"},{"id":"omnichannel-content","name":"Omnichannel Content","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"content-management"},{"id":"digital-assets-management","name":"Digital Assets Management","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"content-management"},{"id":"knowledge-management","name":"Knowledge Management","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"content-management"},{"id":"product-information-management","name":"Product Information Management","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"content-management"},{"id":"content-search","name":"Content Search","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"search"},{"id":"product-search","name":"Product Search","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"search"},{"id":"knowledge-search","name":"Knowledge Search (FAQ)","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"search"},{"id":"digital-assets-search","name":"Digital Assets Search","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"search"},{"id":"merchandising","name":"merchandising","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"search"},{"id":"optimize-search-results","name":"Optimized Search Results (Ranking)","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"search"},{"id":"forum","name":"Forum","short_description":"Short Description","description":"Long description","layerid":"engagement-services","parent_capability":"community-management"}],"layers":[{"id":"channels","name":"Engagement Channels","short_description":"Short Description","description":"This layer consists of all capabilities ","parent_layer":null},{"id":"owned","name":"Owned Channels","short_description":"Short Description","description":"","parent_layer":"channels"},{"id":"notowned","name":"Non-owned Channels","short_description":"Short Description","description":"","parent_layer":"channels"},{"id":"engagement-services","name":"Engagement Platform Services","short_description":"Short Description","description":"This layer consists of all capabilities that are necessary to engage with the customer for selling and servicing our ANWB products. Capabilities vooral op business funcationaliteit gericht. Shared voor alle Business Lines","parent_layer":null},{"id":"integration","name":"Integration","short_description":"Short Description","description":"Integration","parent_layer":null},{"id":"enterprise-foundation","name":"Enterprice Foundation","short_description":"Short Description","description":"Enterprise","parent_layer":null}]}';
	allCapabilitiesAndLayers = JSON.parse(singlelinejson);
	capabilityModel('initiate');
}



function capabilityModel(method) {
    //console.log("allCapabilitiesAndLayers");
    //console.log(allCapabilitiesAndLayers);
    
    if(method == 'initiate'){
	    sortLayers();
	    sortCapabilities();
	}
	if(method == 'update'){
		enableHover = document.getElementById("switchhover").checked;
		enableClick = document.getElementById("switchclick").checked;
		showLevel2 = document.getElementById("switchlevel2").checked;
	}
    
    createLayers();
    //createCapabilities();
    document.addEventListener('DOMContentLoaded', function(event) {
    	document.getElementById("capability-model").innerHTML = html;
    	setClickEvents();
    })
}

function createLayers() {

    html = "";
    var stringLayer = '<div id="layer-%layerid%" class="row layer"><div class="name name-layer"><h4>%name%</h4></div><div class="description description-layer"><p>%description%</p></div>';
    var stringSublayer = '<div id="sublayer-%layerid%" class="col sublayer"><div class="name name-sublayer"><h4>%name%</h4></div><div class="description description-sublayer"><p>%description%</p></div>';

    jQuery.each(allLevelOneLayers, function(i, layer) {

        html += stringLayer.replace("%layerid%", layer.id).replace("%name%", layer.name).replace("%description%", layer.description);

        createCapabilities(layer);

        jQuery.each(allLevelTwoLayers, function(i, sublayer) {
            if (sublayer.parent_layer === layer.id) {
                html += stringSublayer.replace("%layerid%", sublayer.id).replace("%name%", sublayer.name).replace("%description%", sublayer.description);
            }

            //createCapabilities(sublayer);

            html += "</div>";

        });

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
        if (layer.parent_layer == null) {
            allLevelOneLayers.push(layer);

        } else {
            allLevelTwoLayers.push(layer);

        }
    });
    //console.log(allCapabilitiesAndLayers);
    //console.log(allLevelOneLayers);
    //console.log(allLevelTwoLayers);
}

function sortCapabilities() {

    jQuery.each(allCapabilitiesAndLayers.capabilities, function(i, capability) {
        //console.log(capability.parent_capability);
        if (capability.parent_capability == null) {
            allLevelOneCapabilities.push(capability);

        } else {
            allLevelTwoCapabilities.push(capability);

        }
    });
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
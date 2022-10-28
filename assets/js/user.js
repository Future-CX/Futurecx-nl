var url = window.location.href;
var hash = url.substring(url.indexOf("#")+1);

if(hash === "success"){
    $("#contactsuccess").toggleClass('d-none');
    $("#contactform").toggleClass('d-none');
}
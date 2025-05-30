﻿//isErrorView = false;
//errorStatusCode = 500, httpRequestId = null; serviceId = null;

$(function (jqxhr, settings) {
    if (typeof isErrorView != "undefined")
        if (isErrorView === true
            && errorStatusCode == 500//remove it when deploy the configuration 
        ) {
            e(jqxhr, errorStatusCode);
        }
    var generalTicketCookie = getTicketCookieForGeneralTicket("_CSID");
    if (generalTicketCookie) {
        $('#generalDaemTicket').remove();
        $('ol.breadcrumb').append(`<li id="generalDaemTicket"><a style="border-radius: .25rem;font-size: 14px;padding: 5px 10px;" class="bg-secondary btn btn-form-draft text-white" href="#" data-url=` + btoa(generalTicketCookie) + ` id="generalDaemTicketBtn">
                        <span>
                            <svg viewBox="0 0 48 48" width="20" height="20" style="fill: #fff;">
                                <use xlink:href="#svg-setting-ico"></use>
                            </svg> إنشاء بلاغ داعم
                        </span>
                    </a><li>`);

        delete_cookie("_CSID");
    }
});


$(document).ajaxSend(function (event, jqxhr, settings) {
    $('#supportTicketDiv').remove();
    $('#messageContainer').remove();
    $('#whatsupSupportTicketDiv').remove();

});

$(document).ajaxError(function (ee, jqxhr, settings, exception) {
    setTimeout(function () { e(jqxhr) });
});

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0].toLowerCase() === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}
var ticketReqNumber = null;
function showTicketMessage(jqxhr, settings) {

    ticketReqNumber = $('.btn-request-id:eq(0) .num:eq(0)').text();
    if (settings.method === "GET" || settings.type === "GET") {
        var paramsResult = GetParameterValues(settings.url, 'crnumber');
        if (paramsResult != undefined) {
            SetToLocalStorage('cr', paramsResult);
            if (settings.url.search('HIMSELF') > -1) {
                crNo = null;
            } else
                crNo = paramsResult;
        }
        var licenseIdResult = GetParameterValues(settings.url, 'licenseId');
        if (licenseIdResult != undefined) {
            SetToLocalStorage('lic', licenseIdResult);
            licNo = licenseIdResult;
        }
        var IdentityTypeIdResult = GetParameterValues(settings.url, 'crType') || GetParameterValues(settings.url, 'entityType');
        if (IdentityTypeIdResult != undefined) {
            if (settings.url.search('HIMSELF') > -1) {
                idType = 'NATIONAL_ID';
            }
            else {
                idType = IdentityTypeIdResult;
                SetToLocalStorage('id', IdentityTypeIdResult)
            };
        }
    }
}

function GetFromLocalStorage(key) {
    return localStorage[key];
}
function SetToLocalStorage(key, value) {
    localStorage[key] = value;
}
function GetParameterValues(url, param) {
    var params = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < params.length; i++) {
        var urlparam = params[i].split('=');
        if (urlparam[0].toLocaleLowerCase() == param.toLocaleLowerCase()) {
            return urlparam[1];
        }
    }
}

function formatRequestId(reqId) {
    if (reqId == 'undefined' || reqId == null)
        return '';

    return (reqId.startsWith("bldy")) ? reqId : btoa(reqId);

}
function formatEngOfficeId(engId) {
    if (engId == 'undefined' || engId == null)
        return '';
    return engId;
}
function showWhatsAppChat() {
    const servicesList = [
        "/eservices/engoffice/areareportedit",
        "/eservices/engoffice/addeditcomponent",
        "/eservices/engoffice/areareportold",
        "/eservices/engoffice/areareportfromoffice",
        "/eservices/engoffice/areareport",
        "/eservices/engoffice/occupancy",
        "/eservices/engoffice/editconstruction",
        "/eservices/engoffice/transferconstruction",
        "/eservices/engoffice/renew",
        "/eservices/engoffice/newconstruction",
        "/eservices/engoffice/suv/newconstruction",
        "/eservices/engoffice/inspection",
        "/eservices/engoffice/oldlicense",
        "/eservices/engoffice/landsettlement",
        "/eservices/engoffice/correction",
        "/eservices/engoffice/demolition",
        "/eservices/engoffice/restoration",
        "/eservices/engoffice/portal",
        "/eservices/engoffice/laborhousing",
        "/eservices/engoffice/laborhousingedit",
        "/eservices/engoffice/laborhousingoutstandingtrack",
        "/eservices/engoffice/beneficiarypersona",
        "/eservices/engoffice/commerical",
        "/eservices/engoffice/emtithalissue",
        "/eservices/extraservices",
        "/eservices/contractor/insurance"
    ];
    const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '');

    return servicesList.some(service => currentPath === service || currentPath.startsWith(service));
}

function e(jqxhr, statusCode) {
    try {
        //we can't open tickets in EngOffice Portal, beneficiary inquiries and digging inquiery
        const urlPath = window.location.pathname.toLocaleLowerCase();

        let serviceId = null;
        let httpRequestId = null;
        let crNumber = null;
        let licenseId = null;
        let requestId = null;

        $('#whatsupSupportTicketDiv').remove();

        //If  <input type="hidden" id="enableWhatsAppChatbot" /> exist in application , WhatsApp Chat Bot Support will be available
        //if (jqxhr.responseJSON.httpRequestId.startWith('B') &&(urlPath.search('/engoffice/portal/') > -1 || urlPath=='/consultant' )) {
        if (showWhatsAppChat() && jqxhr.status == 409) {

            const pageUrl = new URL(window.location.href.toLocaleLowerCase());
            var whatsAppTicketUrl = "https://" + pageUrl.hostname + "/Eservices/SupportTicket/Whatsapp/index?eng=(eng)&err=(err)&req=(req)&ser=(ser)";


            const url = new URL(pageUrl);
            const searchParams = new URLSearchParams(url.search);

            let engofficeid = '';
            if (searchParams.has('engofficeid'))
                engofficeid = searchParams.get('engofficeid')
            else if (searchParams.has('officeid'))
                engofficeid = searchParams.get('officeid')
            else if (searchParams.has('contractorid'))
                engofficeid = searchParams.get('contractorid')
            if (!engofficeid)
                engofficeid = $('#hdOfficeId').val();
            engofficeid = formatEngOfficeId(engofficeid);


            serviceId = jqxhr.responseJSON.serviceId;
            httpRequestId = jqxhr.responseJSON.httpRequestId;



            requestId = jqxhr.responseJSON.requestId;
            if (!requestId)
                requestId = searchParams.get('requestid');
            if (!requestId)
                requestId = $('#hdRequestId').val();

            requestId = formatRequestId(requestId);

            whatsAppTicketUrl = whatsAppTicketUrl.replace('(eng)', engofficeid).replace('(err)', btoa(httpRequestId)).replace('(req)', requestId).replace('(ser)', serviceId);

            var whatsAppDiv = `<div id="whatsupSupportTicketDiv"> <div class="alert alert-primary"> <div class="d-flex align-items-center justify-content-around">
                               
                               <a href="(whatsAppUrl)" target="_blank"><span>لطلب المساعدة عن طريق واتساب اضغط هنا</span><img alt="" src="https://(hostname)/BALADYCDN/Content/images/whatsappv2.png"  style="max-width: 100px;"/></a>
                               </div></div></div>`

            whatsAppDiv = whatsAppDiv.replace('(whatsAppUrl)', whatsAppTicketUrl).replace('(hostname)', pageUrl.hostname);


            $('.card-body:last').parents('.p-lg-4').append(whatsAppDiv);

        }
        if (urlPath.search('/eservices/inquiries/') > -1 || urlPath.search('/eservices/digging/newdigginglicenses/query/') > -1) {
            return;
        }
        var goToContactUs = false;

        //remove it when deploy the configuration 
        if (statusCode) {
            if (statusCode != 500)
                return;
        } else if (jqxhr.status != 500)
            return;
        //############################################

        ticketReqNumber = $('.btn-request-id:eq(0) .num:eq(0)').text();
        if (jqxhr && jqxhr.responseJSON) {
            serviceId = jqxhr.responseJSON.serviceId;
            httpRequestId = jqxhr.responseJSON.httpRequestId;
            idType = jqxhr.responseJSON.idType;
            crNumber = jqxhr.responseJSON.crNumber;
            licenseId = jqxhr.responseJSON.licenseId;
            requestId = jqxhr.responseJSON.requestId;
            showTicketUrl = jqxhr.responseJSON.showTicketUrl;
            supportTicketUrl = jqxhr.responseJSON.supportTicketUrl;
        }

        $('#supportTicketDiv').remove();
        //if (ticketReqNumber || licNo || crNo) {
        if (showTicketUrl == true || showTicketUrl == 'True') {
            if (ticketReqNumber || getTicketCookie('cookiereqrd') || httpRequestId) {
                //add requestId to cookie
                setTicketCookie(ticketReqNumber ? ticketReqNumber : requestId);

                $('.card-body:last').parents('.p-lg-4')
                    .append(`<div id="supportTicketDiv"><div class="alert alert-info">لفتح تذكرة دعم&nbsp;&nbsp;<button class="btn btn-primary">اضغط هنا</button></div>
                                <form id="frmTicket" method="post">
                                    <input type="hidden" id="encData" name="encData" value="" />
                                </form>
                            </div>`);
                $('html, body').animate({
                    scrollTop: $('#supportTicketDiv:last').length > 0 ? $('#supportTicketDiv:last').offset().top : $('.card-body:last').offset().top
                }, 600);
            }
        }
        //}
    }
    catch { }
}
function setTicketCookie(name) {
    if (name) {
        var now = new Date();
        var time = now.getTime();
        var expireTime = time + 1000 * 10 * 60//10 minutes;
        now.setTime(expireTime);
        document.cookie = 'cookiereqrd=' + (btoa(unescape(encodeURIComponent(name + '_' + now)))) + ';expires=' + now + ';path=/';
    }
}

function getTicketCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    //return matches ? decodeURIComponent(matches[1]) : undefined;
    var val = matches ? decodeURIComponent(matches[1]) : undefined;
    if (val != undefined) {
        val = decodeURIComponent(escape(window.atob(val)));
        if (Date.parse(val.split('_')[1]) > new Date().getTime())
            return val.split('_')[0];
    }
    return undefined;
}

function getTicketCookieForGeneralTicket(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    //return matches ? decodeURIComponent(matches[1]) : undefined;
    var val = matches ? decodeURIComponent(matches[1]) : undefined;
    if (val != undefined) {
        return decodeURIComponent(escape(val));
    }
    return undefined;
}

//function delete_cookie(name) {
//    document.cookie = name + '=; Max-Age=0';
//}

function delete_cookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}

function showPopConfirm(argParam) {
    if ($('#Confirm-Modal').length > 0) {
        //$('#Confirm-Modal').modal('show');
        //return;
        $('#Confirm-Modal').remove();
    }
    var modal = `<div class="modal fade" id="Confirm-Modal" tabindex="-1" role="dialog" aria-labelledby="gov-timeline-modal" aria-modal="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    تنبية
                </h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <svg class="icon-back" viewBox="0 0 48 48" width="20" height="20">
                        <use xlink:href="#svg-close-ico"></use>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="px-3">
                    <div class="alert alert-info mb-4">
                        <p class="fs-4 text-primary mb-0">
                           عزيزي المستفيد .. برجاء حفظ صورة الشاشة اثناء المشكلة حيث سوف تقوم بارفاقها عند تسجيل التذكرة
                        </p>
                    </div>

                    <div class="cr-number-cont">
                        <div class="align-items-center d-flex justify-content-end">
                            <div> <a id="daemTicketFromPopup" class="btn btn-primary text-white `+ argParam + `">لمتابعة فتح التذكرة</a></div>
                            <div class="mr-1"> <a class="btn btn-primary" href="#" data-dismiss="modal"> العودة لأخذ صورة من الشاشة </a></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    $('body').append(modal);
    $('#Confirm-Modal').modal('show');
}

$(document).on('click', '#supportTicketDiv button.btn.btn-primary', function (e) {
    e.stopPropagation();
    e.preventDefault();
    showPopConfirm('');
});

$(document).on('click', '.daaem-btn a#engOfficeDaemTicket', function (e) {
    e.stopPropagation();
    e.preventDefault();
    showPopConfirm('fromEngOffice');
});

$(document).on('click', '#generalDaemTicket a#generalDaemTicketBtn', function (e) {
    e.stopPropagation();
    e.preventDefault();
    showPopConfirm('generalDaemTicket');
});

$(document).on('click', '#Confirm-Modal a.btn.btn-secondary, #Confirm-Modal a#daemTicketFromPopup', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var form = document.getElementById('ticketFormOpenner');
    if (form != null)
        form.remove();
    form = document.createElement("form");
    form.setAttribute('id', 'ticketFormOpenner');
    form.method = "POST";
    form.target = "_blank";



    if ($(this).hasClass('generalDaemTicket'))//general tiket from any service according to it's configuration
    {
        var href = $('#generalDaemTicket a').data('supporturl');
        if (href.startsWith('https://')) {
            form.action = href;
        }
        else {
            form.action = atob($('#generalDaemTicket a').data('url')) + '&isGeneralService=' + true;
        }
    }
    else {
        var reqId = getTicketCookie('cookiereqrd');
        var offName = getTicketCookie('cookieofn');
        offName = offName == undefined ? "" : offName;
        if ($(this).hasClass('fromEngOffice')) {
            form.action = window.location.origin + '/Eservices/SupportTicket/Home/ValidateNewTicket?engOfficeName=' + offName;
        }
        else form.action = supportTicketUrl + '&engOfficeName=' + offName + '&requestId=' + (ticketReqNumber ? ticketReqNumber : (reqId ? reqId : ""));
    }
    //var my_tb = document.createElement('INPUT');
    //my_tb.type = 'HIDDEN';daemTicketFromPopup
    //my_tb.name = 'q';
    //my_tb.value = 'Values of my hidden1';
    //form.appendChild(my_tb);

    document.body.appendChild(form);
    form.submit();
});

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        // add other defaults here if necessary
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}



//add to message.js file in BALADY CDN
//var script = document.createElement('script');

//script.src = window.location.origin + "/BALADYCDN/Content/Support.js";

//document.head.appendChild(script);
// ==UserScript==
// @name         Auto Page Refresher
// @icon         https://github.com/Acidooo/Auto-Page-Refresher/raw/master/icon.png
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  refreshes pages after a certain time
// @author       Acido
// @include      *
// @grant        none
// ==/UserScript==

const reloadList = ["steamgifts.com",
                    "orlygift.com/giveaway",
                    "alienwarearena.com/member/acidooo-a",
                    "reddit.com/r/udemyfreebies/",
                    "https://www.yemeksepeti.com/konya",
                    "https://www.twitch.tv/directory/following/live",
                    "http://obis.ktun.edu.tr/Ogrenci/SonYilNotlari",
                    "http://obis2.ktun.edu.tr/Ogrenci/SonYilNotlari",
                    "http://obis3.ktun.edu.tr/Ogrenci/SonYilNotlari",
                    "http://obis2.ktun.edu.tr/DersKaydi/Index",
                    "https://lms.ktun.edu.tr/",
                    "https://www.eba.gov.tr",
                    "http://obis3.ktun.edu.tr/DersKaydi",
                    "https://forum.donanimarsivi.com/forumlar/Sicakfirsatlar/",
                    "https://www.mediamarkt.com.tr/tr/product/_realme-gt2-pro-128gb-akıllı-telefon-su-yeşili-1228250.html",
                    "https://www.mediamarkt.com.tr/tr/product/_realme-gt2-pro-128gb-akıllı-telefon-çelik-siyahı-1228362.html"
                   ];


var seconds = 180; // You can change seconds to your desired waiting time
var waitingTime = seconds*1000;
var currentPageUrl;



setTimeout(function () {

    currentPageUrl = window.location !== window.parent.location ? document.referrer : document.location.href;
    console.log("current page url: " + currentPageUrl);

    if (reloadList.some(str => currentPageUrl.includes(str)))
    {
        location.reload();
        var min = seconds/60;
        console.log("Page Refreshed After " + min.toFixed(2) + " minutes");
    }

}, waitingTime);















// for (var i=0;i<1;i++){
//     console.log("Sayfa URL: " + currentPageUrl);
//     console.log("document referrer: " + document.referrer);
//     console.log("document.location.href: " + document.location.href);
//     console.log("window.location: " + window.location);
//     console.log("window.parent.location: " + window.parent.location);

// }

// function isListed(url){
//     return reloadList.some( x => url.includes(x) );
// }

// @match        *://*.steamgifts.com
// @match        *://*.twitch.tv/directory/following*
// @match        *://*.orlygift.com/giveaway
// @match        *://*.alienwarearena.com/member/acidooo-a
// @match        *://*.reddit.com/r/udemyfreebies/*
















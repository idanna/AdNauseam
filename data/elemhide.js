/*jslint browser: true*/

/*global self */

var textAdMatchers = [ 

    { selector: '#tads.c', waitfor: ".ads-ad", handler: googleText, name: 'adsense-1' },  // top
    { selector: '#bottomads', waitfor: ".ads-ad", handler: googleText, name: 'adsense-2' },   // bottom
    { selector: '#rhs_block > #mbEnd', waitfor: ".ads-ad", handler: googleText, name: 'adsense-3' },  // right
    
    { selector: '.ads ul', waitfor: 'li', handler: yahooText, name: 'yahoo' },
    { selector: '.b_ad', waitfor: '.sb_adTA', handler: bingText, name: 'bing' },
    { selector: '#ads', waitfor: 'div.result', handler: duckDuckText, name: 'duckduckgo' },
    { selector: '#rtm_html_441', waitfor: 'tr:nth-child(even)', handler: ebayText, name: 'ebay' },

    { selector: '[class$=SLL]', waitfor: 'div.sllLink.sllAllC', handler: aolText, name: 'aol' },

    { selector: '#content_right > table > tbody > tr > td > div:not(#con-ar)', 
        waitfor: "div[id^='bdfs']", handler: baiduText, name: 'baidu' }
        
    //{ selector: '#right > .atTrunk:last-child', waitfor: '.b_rb', handler: sogouText, name: 'sogou' },
    //{ selector: '.sponsored', waitfor: 'li', handler: sogouTopAndBottomText, name: 'sogou' },
];

function ebayText(anchor) {

    var title = anchor.find('a > div:first-child'),
        site = anchor.find('a > div:nth-child(2)'),
        text = anchor.find('a > div:nth-child(3)'),
        targetUrl = anchor.find('a');

    if (text.length && site.length && title.length) {
 
        var ad = createAd('ebay', title.text(), 
            text.text(), site.text(), targetUrl.attr('href'));  
            
        self.port && self.port.emit('parsed-text-ad', ad);
    }
    else {
        console.warn('ebayText.fail: ', text, site);
    }
}

function aolText(anchor) {

    var title = anchor.find('a.titleLinkBgPaddingAndUnderline');
    var site = anchor.find('a.urlLinkBgPaddingAndUnderline');
    var text = anchor.find('.desc');

    if (text.length && site.length && title.length) {
 
        var ad = createAd('aol', title.text(), 
            text.text(), site.text(), title.attr('href'));  
            
        self.port && self.port.emit('parsed-text-ad', ad);
    }
    else {
        console.warn('aolText.fail: ', text.text(), site.text());
    }
}

function sogouText(anchor) {

    var title = anchor.find('h3 > a');
    var site = anchor.find('div:nth-child(2) a');
    var text = anchor.find('div:last-child a');

    if (text.length && site.length && title.length) {
 
        var ad = createAd('sogou', title.text(), 
            text.text(), site.text(), title.attr('href'));  
            
        self.port && self.port.emit('parsed-text-ad', ad);
    }
    else {
        console.warn('sogouText.fail: ', text, site);
    }
}

function sogouTopAndBottomText(anchor) {

    var title = anchor.find('h3 > a');
    var site = anchor.find('h3 > cite');
    var text = anchor.text();
    
    // Cyrus: replace repeated title and site in text
    text = text.replace(title.text(), "").replace(site.text(), "").replace("  ", "");

    if (text.length && site.length && title.length) {
 
        var ad = createAd('sogou', title.text(), 
            text, site.text(), title.attr('href'));  
            
        self.port && self.port.emit('parsed-text-ad', ad);
    }
    else {
        console.warn('sogouTopAndBottomText.fail: ', text, site);
    }
}

function baiduText(anchor) {
    
    var title = anchor.find("a:first-child");
    var text = anchor.find("font:first-child");
    var site = anchor.find("font:last-child");

    if (text.length && site.length && title.length) {
 
        var ad = createAd('bing', title.text(), 
            text.text(), site.text(), title.attr('href'));  
            
        self.port && self.port.emit('parsed-text-ad', ad);
    }
    else {
        console.warn('baiduText.fail: ', text, site);
    }
}

function bingText(anchor) {
    
    var title = anchor.find("h2 a");
    var text = anchor.find("div.b_caption p");
    var site = anchor.find("div.b_attribution cite");

    if (text.length && site.length && title.length) {
 
        var ad = createAd('bing', title.text(), 
            text.text(), site.text(), title.attr('href'));  
            
        self.port && self.port.emit('parsed-text-ad', ad);
    }
    else {
        console.warn('bingText.fail: ', text, site);
    }
}

function yahooText(anchor) {

    if (anchor.text().length <= 50) { // TODO: temporary; pls fix correctly (see #188)
            
        console.warn('yahoo text-Ad fail: '+anchor.text());   
        return;
    }

    var title = anchor.find('div:first-child a');
    var text = anchor.find('div.abs a');
    var site = anchor.find('em a');
    
    if (text.length && site.length && title.length) {
 
        var ad = createAd('yahoo', title.text(), 
            text.text(), site.text(), title.attr('href'));  
        self.port && self.port.emit('parsed-text-ad', ad);
    }
    else {
        console.warn('yahooText.fail: ', anchor.text(), '(length: ' + 
            anchor.text().length + ')');
    }
}
    
function googleText(anchor) {
    
    //console.log('googleText('+anchor+')');
    
    var title = anchor.find('h3 a'),
        text = anchor.find('.ads-creative'),
        site = anchor.find('.ads-visurl cite');
    
    
    if (text.length && site.length && title.length) {
 
        var ad = createAd('google', title.text(), 
            text.text(), site.text(), title.attr('href'));  
            
        self.port && self.port.emit('parsed-text-ad', ad);
    }
    else {
    
        console.warn('googleText.fail: ', text, site);
    }
}

function duckDuckText(anchor) {

    var title = anchor.find('h2.result__title'),
        text = anchor.find('div.result__snippet a'),
        site = anchor.find('a.result__url');
      
    if (text.length && site.length && title.length) {
        
        var ad = createAd('duckduckgo', title.text(), 
            text.text(), site.text(), title.attr('href'));  
        self.port && self.port.emit('parsed-text-ad', ad);
    } 
    else {
        console.warn('duckDuckText.fail: ',  text, site);
    }
}

function createAd(network,title,text,site,target) {
    
    return  {
        network : network,            
        pageUrl : document.URL,
        title : title,
        text : text,
        site : site,
        targetUrl : target
    };
}
    

/*  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements($,
            "div.comments", 
            commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction(jNode) {
            jNode.text("This comment changed by waitForKeyElements().");
        }
*/
// from: https://gist.github.com/BrockA/2625891
function waitForKeyElements($,
    
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
      
    //console.log(typeof $);
    
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents().find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        
        btargetsFound   = true;
        
        /*  Found target node(s). Go through each and act if they are new. */
        targetNodes.each (function () {
        
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
            
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
    
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj  ||  {};
    var controlKey = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
    
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj[controlKey];
    }
    else {
    
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval( function () {
                    waitForKeyElements($,
                                            selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj[controlKey] = timeControl;
        }
    }
    
    waitForKeyElements.controlObj = controlObj;
}

function runFilters() {

    //console.log(typeof $, typeof element);
    
    for (var i = 0; i < textAdMatchers.length; i++) {
    
        var data = textAdMatchers[i],
            waitSel = data.selector + ' ' + data.waitfor;

        if ( $(this).is(data.selector) ) {
            
            //console.log('ELEMHIDE-HIT: ' + waitSel);
            
            try {
                waitForKeyElements($, waitSel, data.handler);
            }
            catch(e) {
                
                console.warn('failed processing text-ad',data);
            }
        }
    }
}

function nodeRunFilters($) {

    for (var i = 0; i < textAdMatchers.length; i++) {
    
        var data = textAdMatchers[i],
            waitSel = data.selector + ' ' + data.waitfor;
    
        console.log('Trying: ' + data.name+ " :: "+data.selector + " :: " +$(data.selector).length + ' found');
        
        if ( $(data.selector).length ) {
            
            console.log('\n* ElemHide-Hit: ' + data.selector);
            
            try {
                console.log('* Waiting-For: ' + waitSel+'\n');
                waitForKeyElements($, waitSel, data.handler);
            }
            catch(e) {
                
                console.warn('failed processing text-ad',data);
                throw e;
            }
        }
    }
}

function findSelectorByName(name) {

    for (var i = 0; i < textAdMatchers.length; i++) {
        if (textAdMatchers[i].name === name)
            return textAdMatchers[i];
    }
}

if (typeof module == 'undefined' || !module.exports) {

    $(function() { // page-is-ready
        
        var $hidden = $("*").filter(function() {
    
            return /^url\("about:abp-elemhidehit?/.test($(this).css("-moz-binding"));
        });
            
        $hidden.each(runFilters);
    });
}
else { // in Node

    module.exports['matchers'] = textAdMatchers;
    module.exports['getMatcher'] = findSelectorByName;
    module.exports['waitForKeyElements'] = waitForKeyElements;
    module.exports['nodeRunFilters'] = nodeRunFilters;
    module.exports['googleText'] = googleText;
}


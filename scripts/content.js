// fc named vars
const fc_consentRoot = ".fc-consent-root";
const fc_manageOptionsBtn = "fc-button fc-cta-manage-options fc-secondary-button";
const fc_generalInterestsCheckBoxes = "fc-preference-legitimate-interest purpose";
const fc_publisherInterestsCheckBoxes = "fc-preference-legitimate-interest publisher-purpose";
const fc_confirmBtn = "fc-button fc-confirm-choices fc-primary-button";

function checkForModalBlocking()
{
    if (chrome.runtime?.id) {
        // Set current pages tally to 0
        chrome.storage.local.set({"currentPageTally": 0});

        var modalBack = document.querySelector("#body > div.tp-backdrop.tp-active");
        var modal = document.querySelector("#body > div.tp-modal");

        var totalTally = chrome.storage.local.get("allTimeTally", function(result) 
        {
            var removed = 0;
            if (!modal && !modalBack)
            {
                window.setTimeout(checkForModalBlocking, 500);
                return;
            }

            try
            {
                modal.remove();
                removed++;
            }
            catch(err){}
            
            try
            {
                modalBack.remove();
                removed++;
            }
            catch(err){}
            

            totalTally = result.allTimeTally === undefined ? 
                        0 : 
                        result.allTimeTally;

            totalTally += removed;
            chrome.storage.local.set({"allTimeTally": totalTally});
            chrome.storage.local.set({"currentPageTally": removed });
        });
    }
}

function checkForYoutubeAdBlockMessage()
{
    if (chrome.runtime?.id) {
        // Set current pages tally to 0
        chrome.storage.local.set({"currentPageTally": 0 });

        var overlay = document.querySelector("body > tp-yt-iron-overlay-backdrop");
        var dialog = document.querySelector("body > ytd-app > ytd-popup-container > tp-yt-paper-dialog");
        var playButton = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > button");

        var totalTally = chrome.storage.local.get("allTimeTally", function(result) 
        {
            if (!overlay && !dialog)
            {
                window.setTimeout(checkForYoutubeAdBlockMessage, 500);
                return;
            }

            var removed = 0;

            try
            {
                overlay.remove();
                removed++;
            }
            catch(err){}

            try
            {
                dialog.remove();
                removed++;
            }
            catch(err){}

            totalTally = result.allTimeTally === undefined ? 
                        0 : 
                        result.allTimeTally;
                        
            totalTally += removed;
            chrome.storage.local.set({"allTimeTally": totalTally});
            chrome.storage.local.set({"currentPageTally": removed });

            try
            {
                playButton.click(); //// Resume playing
            }
            catch (err)
            {
                //// Must be on the "up next" screen
            }
        });
    }
}

function checkForFcConsentRoot() 
{
    if (chrome.runtime?.id) {
        // Set current pages tally to 0
        chrome.storage.local.set({"currentPageTally": 0 });

        var targetNode = document.querySelectorAll(fc_consentRoot)[0];
        if(!targetNode) 
        {
            window.setTimeout(checkForFcConsentRoot,500);
            return;
        }
        else
        {
            var manageOptionsBtn = document.getElementsByClassName(fc_manageOptionsBtn)[0];
            if (manageOptionsBtn !== null && manageOptionsBtn !== undefined)
            {
                // Click btn
                manageOptionsBtn.click();

                // Gather all checkboxes for "legitimate interests"
                var totalTally = chrome.storage.local.get("allTimeTally", function(result) 
                {
                    console.table(result);

                    totalTally = result.allTimeTally === undefined ? 
                        0 : 
                        result.allTimeTally;

                    var currentTally = 0;

                    //// Preference for general purposes
                    [...document.getElementsByClassName(fc_generalInterestsCheckBoxes)].forEach(element => {
                        element.checked = false; // Uncheck
                        currentTally++;
                    });
        
                    //// 'Publisher' preferences
                    [...document.getElementsByClassName(fc_publisherInterestsCheckBoxes)].forEach(element => {
                        element.checked = false; // Uncheck
                        currentTally++;
                    });

                    totalTally += currentTally;
                    chrome.storage.local.set({"allTimeTally": totalTally});
                    chrome.storage.local.set({"currentPageTally": currentTally });

                    var confirmElement = document.getElementsByClassName(fc_confirmBtn)[0];
                    confirmElement.click();
                });
            }
        }   
    }
}

checkForFcConsentRoot(); // fc Handler
checkForYoutubeAdBlockMessage(); // Youtube "Ad block is not allowed"
checkForModalBlocking(); // Annoying full page modals that popup each page refresh
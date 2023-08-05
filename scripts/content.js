function checkForFcConsentRoot() 
{
    // Set current pages tally to 0
    chrome.storage.local.set({"currentPageTally": 0 });

    var targetNode = document.querySelectorAll(".fc-consent-root")[0];
    if(!targetNode) 
    {
        window.setTimeout(checkForFcConsentRoot,500);
        return;
    }
    else
    {
        var manageOptionsBtn = document.getElementsByClassName("fc-button fc-cta-manage-options fc-secondary-button")[0];
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
                [...document.getElementsByClassName("fc-preference-legitimate-interest purpose")].forEach(element => {
                    element.checked = false; // Uncheck
                    currentTally++;
                });
    
                //// 'Publisher' preferences
                [...document.getElementsByClassName("fc-preference-legitimate-interest publisher-purpose")].forEach(element => {
                    element.checked = false; // Uncheck
                    currentTally++;
                });

                totalTally += currentTally;
                chrome.storage.local.set({"allTimeTally": totalTally});
                chrome.storage.local.set({"currentPageTally": currentTally });

                var confirmElement = document.getElementsByClassName("fc-button fc-confirm-choices fc-primary-button")[0];
                confirmElement.click();
            });
        }
    }
}

checkForFcConsentRoot();
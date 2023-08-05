// fc named vars
const fc_consentRoot = ".fc-consent-root";
const fc_manageOptionsBtn = "fc-button fc-cta-manage-options fc-secondary-button";
const fc_generalInterestsCheckBoxes = "fc-preference-legitimate-interest purpose";
const fc_publisherInterestsCheckBoxes = "fc-preference-legitimate-interest publisher-purpose";
const fc_confirmBtn = "fc-button fc-confirm-choices fc-primary-button";

function checkForFcConsentRoot() 
{
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

checkForFcConsentRoot(); // fc Handler
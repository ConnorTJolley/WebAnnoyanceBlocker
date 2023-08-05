var hostElement = document.getElementById("hostname");

var query = { active: true, currentWindow: true };
function callback(tabs) 
{
    var currentTab = tabs[0];
    console.table(currentTab);

    var url = new URL(currentTab.url);
    hostElement.innerText = url.hostname;
}

chrome.tabs.query(query, callback);

//// Counters
var currentPageElement = document.getElementById("page_blocked_count");
var totalElement = document.getElementById("total_blocked_count");


var totalTally = chrome.storage.local.get("allTimeTally", function(result) 
{
    totalTally = result.allTimeTally === undefined ? 
        0 : 
        result.allTimeTally;
    
    totalElement.innerHTML = totalTally.toLocaleString();
});

var currentPageTally = chrome.storage.local.get("currentPageTally", function(result) 
{
    currentPageTally = result.currentPageTally === undefined ? 
        0 : 
        result.currentPageTally;
    
    currentPageElement.innerHTML = currentPageTally.toLocaleString();
});
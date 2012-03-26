/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var prefs = require("../../../lib/prefs");
var tabs = require("../../../lib/tabs");
var utils = require("../../../lib/utils");

const localTestFolder = collector.addHttpResource('../../../data/');

const gDelay = 0;
const gTimeout = 5000;

var gTabOrder = [
  {index: 1, linkid: 3},
  {index: 2, linkid: 2},
  {index: 3, linkid: 1}
];

var setupModule = function(module)
{
  controller = mozmill.getBrowserController();

  tabBrowser = new tabs.tabBrowser(controller);
  tabBrowser.closeAllTabs();
}

var teardownModule = function()
{
  prefs.preferences.clearUserPref("browser.tabs.loadInBackground");
  utils.closeContentAreaContextMenu(controller);
  tabBrowser.closeAllTabs();
}

var testOpenInForegroundTab = function()
{
  prefs.openPreferencesDialog(controller, prefDialogCallback);

  // Open the HTML testcase:
  controller.open(localTestFolder + "tabbedbrowsing/openinnewtab.html");
  controller.waitForPageLoad();

  for(var i = 0; i < 3; i++) {
    // Switch to the first tab:
    tabBrowser.selectedIndex = 0;

    // Reference to the current link in the testcase:
    var currentLink = new elementslib.Name(controller.tabs.activeTab, "link_" + (i + 1));
    var contextMenuItem = new elementslib.ID(controller.window.document, "context-openlinkintab");

    if(i == 2) {
      // Open another tab by middle-clicking on the link
      tabBrowser.openInNewTab(currentLink);
    } else {
      // Open the context menu and open a new tab
      controller.rightClick(currentLink);
      controller.click(contextMenuItem);
      utils.closeContentAreaContextMenu(controller);
    }

    // Let's see if we have the right number of tabs open and that the first opened tab is selected
    controller.waitFor(function () {
      return tabBrowser.length === (i + 2);
    }, (i + 2) + " tabs have been opened");

    controller.waitFor(function () {
      return tabBrowser.selectedIndex === 1;
    }, "The first opened tab has been selected");
  }

  // Verify that the order of tabs is correct
  for each(tab in gTabOrder) {
    var linkId = new elementslib.ID(controller.tabs.getTab(tab.index), "id");
    controller.waitForElement(linkId);
    controller.assertText(linkId, tab.linkid);
  }

  // Click the close button of the second tab
  tabBrowser.selectedIndex = 1;
  tabBrowser.closeTab("closeButton");
  
  // Verify that we have 3 tabs now and the first tab is selected:
  controller.waitFor(function () {
    return tabBrowser.length === 3;
  }, "3 tabs have been opened");

  controller.waitFor(function () {
    return tabBrowser.selectedIndex === 0;
  }, "The first tab has been selected");
}

var prefDialogCallback = function(controller) {
  var prefDialog = new prefs.preferencesDialog(controller);
  prefDialog.paneId = 'paneTabs';

  // Ensure that 'Switch to tabs immediately' is checked:
  var switchToTabsPref = new elementslib.ID(controller.window.document, "switchToNewTabs");
  controller.waitForElement(switchToTabsPref, gTimeout);
  controller.check(switchToTabsPref, true);

  prefDialog.close(true);
}

/**
 * Map test functions to litmus tests
 */
// testOpenInForegroundTab.meta = {litmusids : [8088]};

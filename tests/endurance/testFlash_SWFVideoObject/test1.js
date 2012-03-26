/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var endurance = require("../../../lib/endurance");
var tabs = require("../../../lib/tabs");

const TEST_DOMAIN = "http://www.mozqa.com/";
const TEST_PAGE = TEST_DOMAIN + "data/firefox/plugins/flash/test_swf_object.html";

const TIMEOUT_PAGE = 50000;

function setupModule() {
  controller = mozmill.getBrowserController();

  enduranceManager = new endurance.EnduranceManager(controller);
  tabBrowser = new tabs.tabBrowser(controller);

  tabs.closeAllTabs(controller);
}

/*
 * Test opening flash content loaded via object
 */
function testFlashObject() {
  enduranceManager.run(function () {
    enduranceManager.loop(function () {
      // If entity > 1 then open a new tab 
      if (enduranceManager.currentEntity > 1) {
        tabBrowser.openTab();
      } 

      // Load the test page in the currently opened tab
      enduranceManager.addCheckpoint("Load a web page with flash content loaded via object");
      controller.open(TEST_PAGE);
      controller.waitForPageLoad(TIMEOUT_PAGE);
      enduranceManager.addCheckpoint("Web page has been loaded"); 
    });
    // Close all tabs
    tabBrowser.closeAllTabs();
  });
}

/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is MozMill Test code.
 *
 * The Initial Developer of the Original Code is
 * Tobias Markus <tobbi.bugs@googlemail.com>.
 *
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Henrik Skupin <hskupin@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

// Include necessary modules
var RELATIVE_ROOT = '../../shared-modules';
var MODULE_REQUIRES = ['PrefsAPI', 'UtilsAPI'];

const localTestFolder = collector.addHttpResource('./files');

const gDelay = 0;
const gTimeout = 5000;

var gTabOrder = [
  {index: 1, linkid: 2},
  {index: 2, linkid: 3},
  {index: 3, linkid: 1}
];

var setupModule = function(module)
{
  controller = mozmill.getBrowserController();

  UtilsAPI.closeAllTabs(controller);
}

var teardownModule = function()
{
  PrefsAPI.preferences.clearUserPref("browser.tabs.loadInBackground");
  UtilsAPI.closeContentAreaContextMenu(controller);
}

var testOpenInBackgroundTab = function()
{
  PrefsAPI.preferencesDialog.open(prefDialogCallback);

  // Open the HTML testcase:
  controller.open(localTestFolder + "openinnewtab.html");
  controller.waitForPageLoad();

  for(var i = 0; i < gTabOrder.length; i++) {
    // Reference to the current link in the testcase:
    var currentLink = new elementslib.Name(controller.tabs.activeTab, "link_" + (i + 1));
    var contextMenuItem = new elementslib.ID(controller.window.document, "context-openlinkintab");
    
    if(i == 2) {
      // Open another tab by middle-clicking on the link
      // XXX: Can be changed to middleClick once bug 535018 is fixed
      controller.mouseDown(currentLink, 1);
      controller.mouseUp(currentLink, 1);
    } else {
      // Open the first link via context menu in a new tab:
      controller.rightClick(currentLink);
      controller.click(contextMenuItem);
      UtilsAPI.closeContentAreaContextMenu(controller);
    }

    // Check that i+1 tabs are open and the first tab is selected
    controller.waitForEval("subject.length == " + (i + 2), gTimeout, 100, controller.tabs);
    controller.waitForEval("subject.activeTabIndex == 0", gTimeout, 100, controller.tabs);
    
    if(i == 0) {
      // Switch to the newly opened tab and back to the first tab
      controller.tabs.selectTabIndex(1);
      controller.tabs.selectTabIndex(0);
    }
  }

  // Verify that the order of tabs is correct
  for each(tab in gTabOrder) {
    var linkId = new elementslib.ID(controller.tabs.getTab(tab.index), "id");
    controller.waitForElement(linkId);
    controller.assertText(linkId, tab.linkid);
  }

  // Select the last opened tab:
  controller.tabs.selectTabIndex(3);

  // Click the close button of the last tab:
  var tabs = new elementslib.Lookup(controller.window.document, '/id("main-window")/id("browser")/id("appcontent")/id("content")/anon({"anonid":"tabbox"})/anon({"anonid":"strip"})/anon({"anonid":"tabcontainer"})');
  var lastTabCloseButton = new elementslib.Elem(tabs.getNode().getItemAtIndex(3).boxObject.lastChild);
  controller.click(lastTabCloseButton);

  // Verify that the last tab is selected:
  controller.waitForEval("subject.length == 3", gTimeout, 100, controller.tabs);
  controller.waitForEval("subject.activeTabIndex == 2", gTimeout, 100, controller.tabs);
}

var prefDialogCallback = function(controller) {
  PrefsAPI.preferencesDialog.setPane(controller, 'paneTabs');

  //Ensure that 'Switch to tabs immediately' is unchecked:
  var switchToTabsPref = new elementslib.ID(controller.window.document, "switchToNewTabs");
  controller.waitForElement(switchToTabsPref, gTimeout);
  controller.check(switchToTabsPref, false);

  PrefsAPI.preferencesDialog.close(controller, true);
}

/**
 * Map test functions to litmus tests
 */
testOpenInBackgroundTab.meta = {litmusids : [8087]};

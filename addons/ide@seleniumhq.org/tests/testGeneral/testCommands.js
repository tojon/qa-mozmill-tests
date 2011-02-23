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
 * The Original Code is Mozmill Test Code.
 *
 * The Initial Developer of the Original Code is the Mozilla Foundation.
 *
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Dave Hunt <dhunt@mozilla.com>
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

/**
 * @fileoverview Test that the Selenium IDE commands function correctly
 * @supported Firefox 3.5 and above, Selenium IDE 1.0.10 and above
 *
 * @author dhunt@mozilla.com (Dave Hunt)
 */

// Include required modules
var Selenium = require("../../shared-modules/selenium");

/**
 * Sets up the test module by acquiring a browser controller.
 * @param {module} module object for the test used by Mozmill.
 */
function setupModule(module) {
  controller = mozmill.getBrowserController();
  sm = new Selenium.SeleniumManager();
}

/**
 * This test verifies the verifyText command is not returning an error.
 */
function testVerifyTextCommand() {
  sm.open(controller);
  sm.baseURL = "chrome://selenium-ide/";
  sm.addCommand({action: "open",
                target: "/content/tests/functional/aut/search.html"});
  sm.addCommand({action: "verifyText",
                target: "link=link with onclick attribute",
                value: "link with onclick attribute"});
  sm.playTest();

  // XXX: Bug 621214 - Find a way to check properties of treeView rows

  //check suite progress indicator
  sm.controller.assert(function () {
    return sm.isSuiteProgressIndicatorGreen;
  }, "Suite progress indicator is green");

  //check suite counts
  sm.controller.assertValue(sm.runCount, "1");
  sm.controller.assertValue(sm.failureCount, "0");

  //check no errors in log
  sm.controller.assert(function () {
    return sm.logConsole.getNode().innerHTML.indexOf('[error]') == -1;
  }, "Log console contains no errors");

}
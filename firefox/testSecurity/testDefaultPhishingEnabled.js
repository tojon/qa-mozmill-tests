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
 * The Initial Developer of the Original Code is Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Aakash Desai <adesai@mozilla.com>
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

// Include the required modules
var prefs = require("../../shared-modules/prefs");
var utils = require("../../shared-modules/utils");

const gDelay = 0;
const gTimeout = 5000;

var setupModule = function(module) {
  module.controller = mozmill.getBrowserController();
}

/**
 * Verify phishing detection is enabled
 */
var testDefaultPhishingEnabled = function() {
  prefs.openPreferencesDialog(prefPaneSetCallback);
}

/**
 * Check that phishing checkboxes are enabled
 *
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
var prefPaneSetCallback = function(controller) {
  var prefDialog = new prefs.preferencesDialog(controller);
  prefDialog.paneId = 'paneSecurity';

  // Check if the Security pane is active
  var attackElem = new elementslib.ID(controller.window.document, "blockAttackSites");
  var forgeryElem = new elementslib.ID(controller.window.document, "blockWebForgeries");

  // Verify Block Attack Sites and Reported Web Forgeries are checked by default
  controller.waitForElement(attackElem, gTimeout);
  controller.assertChecked(attackElem);
  controller.assertChecked(forgeryElem);

  prefDialog.close();
}

/**
 * Map test functions to litmus tests
 */
// testDefaultPhishingEnabled.meta = {litmusids : [8290]};

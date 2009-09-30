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
 * The Initial Developer of the Original Code is Mozilla Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Anthony Hughes <ahughes@mozilla.com>
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
 * **** END LICENSE BLOCK ***** */

/**
 * Litmus test #9292: Encrypted page warning
 */

var RELATIVE_ROOT = '../../shared-modules';
var MODULE_REQUIRES = ['ModalDialogAPI', 'PrefsAPI', 'UtilsAPI'];

const gDelay = 0;
const gTimeout = 5000;

// Used to indicate that the modal encryption warning has been shown
var modalWarningShown = false;

var setupModule = function(module)
{
  controller = mozmill.getBrowserController();
}

var teardownModule = function(module)
{
  var prefs = new Array("security.warn_entering_secure",
                        "security.warn_entering_weak",
                        "security.warn_leaving_secure",
                        "security.warn_submit_insecure",
                        "security.warn_viewing_mixed");

  // Reset the warning blocking prefs
  for each (p in prefs) {
    try {
      PrefsAPI.preferences.branch.clearUserPref(p);
    } catch(e) {}
  }
}

/**
 * Test warning about viewing an encrypted page
 */
var testEncryptedPageWarning = function()
{
  // Make sure the test starts from a blank page because
  // the warnings don't appear if you are on the page
  // where the warning was triggered
  UtilsAPI.closeAllTabs(controller);

  // Make sure the prefs are set
  PrefsAPI.preferencesDialog.open(prefDialogCallback);

  // Create a listener for the warning dialog
  var md = new ModalDialogAPI.modalDialog(handleSecurityWarningDialog);
  md.start();

  // Load an encrypted page
  controller.open("https://www.verisign.com");

  // Prevent the test from ending before the warning can appear
  controller.waitForPageLoad();

  // Test if the the modal dialog has been shown
  controller.assertJS(modalWarningShown == true);
}

/**
 * Call-back handler for preferences dialog
 *
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
var prefDialogCallback = function(controller)
{
  // Get the Security Pane
  PrefsAPI.preferencesDialog.setPane(controller, "paneSecurity");

  // Click the Warning Messages Settings button
  var warningSettingsButton = new elementslib.ID(controller.window.document,
                                                 "warningSettings");
  controller.waitForElement(warningSettingsButton, gTimeout);

  // Create a listener for the Warning Messages Settings dialog
  var md = new ModalDialogAPI.modalDialog(handleSecurityWarningSettingsDialog);
  md.start(500);

  controller.click(warningSettingsButton);

  // Close the preferences dialog
  PrefsAPI.preferencesDialog.close(controller, true);
}

/**
 * Helper function to handle interaction with the
 * Security Warning Settings modal dialog
 *
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
var handleSecurityWarningSettingsDialog = function(controller)
{
  var prefs = new Array("warn_entering_secure",
                        "warn_entering_weak",
                        "warn_leaving_secure",
                        "warn_submit_insecure",
                        "warn_viewing_mixed");

  // Make sure the "encrypted page" pref is checked
  for each (p in prefs) {
    var element = new elementslib.ID(controller.window.document, p);
    controller.waitForElement(element, gTimeout);

    // Check the "encrypted page" pref if it isn't already checked
    if (p == "warn_entering_secure") {
      if (!element.getNode().checked) {
        controller.waitThenClick(element);
      }
    // Uncheck all other prefs
    } else {
      if (element.getNode().checked) {
        controller.waitThenClick(element);
      }
    }
  }

  // Click OK on the Security window
  var okButton = new elementslib.Lookup(controller.window.document,
                                        '/id("SecurityWarnings")' +
                                        '/anon({"anonid":"dlg-buttons"})' +
                                        '/{"dlgtype":"accept"}');
  controller.click(okButton);
}

/**
 * Helper function to handle interaction with the Security Warning modal dialog
 */
var handleSecurityWarningDialog = function(controller)
{
  modalWarningShown = true;

  var enterSecureMessage = UtilsAPI.getProperty("chrome://pipnss/locale/security.properties",
                                                "EnterSecureMessage");

  // Wait for the content to load
  var infoBody = new elementslib.ID(controller.window.document, "info.body");
  controller.waitForElement(infoBody);

  // Verify the message text
  controller.assertProperty(infoBody, "textContent", enterSecureMessage);

  // Verify the "Alert me whenever" checkbox is checked by default
  var checkbox = new elementslib.ID(controller.window.document, "checkbox");
  controller.assertChecked(checkbox);

  // Click the OK button
  var okButton = new elementslib.Lookup(controller.window.document,
                                        '/id("commonDialog")' +
                                        '/anon({"anonid":"buttons"})' +
                                        '/{"dlgtype":"accept"}');
  controller.waitThenClick(okButton);
}

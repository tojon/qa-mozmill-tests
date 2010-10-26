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

// Include required modules
var softwareUpdate = require("../../../shared-modules/testSoftwareUpdateAPI");
var utils = require("../../../shared-modules/testUtilsAPI");

var setupModule = function(module) {
  controller = mozmill.getBrowserController();
  update = new softwareUpdate.softwareUpdate();
}

var teardownModule = function(module) {
  // Collect some data of the current build
  persisted.preBuildId = utils.appInfo.buildID;
  persisted.preLocale = utils.appInfo.locale;
  persisted.preUserAgent = utils.appInfo.userAgent;
  persisted.preVersion = utils.appInfo.version;

  // Save the update properties for later usage
  if (update.activeUpdate) {
    persisted.type = update.activeUpdate.type;
    persisted.isCompletePatch = update.isCompleteUpdate;
    persisted.updateBuildId = update.activeUpdate.buildID;
    persisted.updateType = update.isCompleteUpdate ? "complete" : "partial";
    persisted.updateType += "+fallback";
    persisted.updateVersion = update.activeUpdate.version;
  } else {
    persisted.type = "n/a";
    persisted.isCompletePatch = "n/a";
    persisted.updateBuildId = "n/a";
    persisted.updateType = "n/a";
    persisted.updateVersion = "n/a";
  }

  // Put the downloaded update into failed state
  update.forceFallback();
}

var testFallbackUpdate_Download = function() {
  // Check if the user has permissions to run the update
  controller.assertJS("subject.isUpdateAllowed == true",
                      {isUpdateAllowed: update.allowed});

  // Open the software update dialog and wait until the check has been finished
  update.openDialog(controller);
  update.waitForCheckFinished();

  // Download the update
  update.controller.waitForEval("subject.update.updatesFound == true", 5000, 100,
                                {update: update});
  update.download(persisted.channel);
}

/**
 * Map test functions to litmus tests
 */
// testFallbackUpdate_Download.meta = {litmusids : [8696]};

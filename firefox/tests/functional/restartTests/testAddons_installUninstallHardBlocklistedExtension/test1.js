/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Include required modules
var addons = require("../../../../lib/addons");
var modalDialog = require("../../../../lib/modal-dialog");
var prefs = require("../../../../lib/prefs");
var tabs = require("../../../../lib/tabs");

const BASE_URL = collector.addHttpResource("../../../../../data/");
const TEST_DATA = BASE_URL + "addons/blocklist/hardblock_extension/blocklist.xml";

const PREF_BLOCKLIST = "extensions.blocklist.url";
const PREF_INSTALL_DIALOG = "security.dialog_enable_delay";

const INSTALL_DIALOG_DELAY = 1000;
const TIMEOUT_DOWNLOAD = 25000;

const ADDON = {
  name: "Test Extension (icons)",
  id: "test-icons@quality.mozilla.org",
  url: BASE_URL + "addons/extensions/icons.xpi"
};

function setupModule(aModule) {
  aModule.controller = mozmill.getBrowserController();

  aModule.addonsManager = new addons.AddonsManager(aModule.controller);
  addons.setDiscoveryPaneURL("about:home");

  persisted.addon = ADDON;

  prefs.preferences.setPref(PREF_BLOCKLIST, TEST_DATA);
  prefs.preferences.setPref(PREF_INSTALL_DIALOG, INSTALL_DIALOG_DELAY);

  tabs.closeAllTabs(aModule.controller);
}

function teardownModule(aModule) {
  // Bug 867217
  // Mozmill 1.5 does not have the restartApplication method on the controller.
  // Remove condition when transitioned to 2.0
  if ("restartApplication" in aModule.controller) {
    aModule.controller.restartApplication();
  }
}

/*
 * Install the extension to be blocklisted
 */
function testInstallBlocklistedExtension() {
  var md = new modalDialog.modalDialog(addonsManager.controller.window);

  md.start(addons.handleInstallAddonDialog);
  controller.open(persisted.addon.url);
  md.waitForDialog(TIMEOUT_DOWNLOAD);
}

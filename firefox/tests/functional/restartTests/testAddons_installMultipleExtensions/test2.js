/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Include required modules
var addons = require("../../../../lib/addons");
var {expect} = require("../../../../../lib/assertions");
var prefs = require("../../../../lib/prefs");
var tabs = require("../../../../lib/tabs");

const PREF_INSTALL_DIALOG = "security.dialog_enable_delay";
const PREF_LAST_CATEGORY = "extensions.ui.lastCategory";

function setupModule(aModule) {
  aModule.controller = mozmill.getBrowserController();
  aModule.addonsManager = new addons.AddonsManager(aModule.controller);

  tabs.closeAllTabs(aModule.controller);
}

function teardownModule(aModule) {
  prefs.preferences.clearUserPref(PREF_INSTALL_DIALOG);
  prefs.preferences.clearUserPref(PREF_LAST_CATEGORY);

  delete persisted.addons;

  addons.resetDiscoveryPaneURL();
  aModule.addonsManager.close();

  // Bug 886811
  // Mozmill 1.5 does not have the stopApplication method on the controller.
  // Remove condition when transitioned to 2.0
  if ("stopApplication" in aModule.controller) {
    aModule.controller.stopApplication(true);
  }
}

/**
 * Verifies the addons are installed
 */
function testCheckMultipleExtensionsAreInstalled() {
  addonsManager.open();
  addonsManager.setCategory({category: addonsManager.getCategoryById({id: "extension"})});

  persisted.addons.forEach(function(addon) {
    //Verify the addons are installed
    var aAddon = addonsManager.getAddons({attribute: "value", value: addon.id})[0];
    var addonIsInstalled = addonsManager.isAddonInstalled({addon: aAddon});

    expect.ok(addonIsInstalled, "Add-on has been installed");
  });
}

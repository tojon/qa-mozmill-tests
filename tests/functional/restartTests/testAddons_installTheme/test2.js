/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var addons = require("../../../../lib/addons");
var {expect} = require("../../../../lib/assertions");
var prefs = require("../../../../lib/prefs");
var tabs = require("../../../../lib/tabs");

const BASE_URL = collector.addHttpResource("../../../../data/");
const TEST_DATA = BASE_URL + "layout/mozilla.html";

const PREF_UPDATE_EXTENSION = "extensions.update.enabled";

function setupModule() {
  controller = mozmill.getBrowserController();

  addonsManager = new addons.AddonsManager(controller);
  addons.setDiscoveryPaneURL(TEST_DATA);
}

function teardownModule() {
  delete persisted.theme;
  prefs.preferences.clearUserPref(PREF_UPDATE_EXTENSION);

  addons.resetDiscoveryPaneURL();
  addonsManager.close();
}

/**
 * Verifies the theme is installed
 */
function testThemeIsInstalled() {
  addonsManager.open();

  // Set category to 'Appearance'
  addonsManager.setCategory({
    category: addonsManager.getCategoryById({id: "theme"})
  });

  // Verify the theme is installed
  var aTheme = addonsManager.getAddons({attribute: "value", value: persisted.theme.id})[0];
  var themeIsInstalled = addonsManager.isAddonInstalled({addon: aTheme});

  expect.ok(themeIsInstalled, "The theme is successfully installed");
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var addons = require("../../../../lib/addons");
var modalDialog = require("../../../../lib/modal-dialog");
var tabs = require("../../../../lib/tabs");

const TIMEOUT_DOWNLOAD = 25000;
const TIMEOUT_SWITCH = 100;

const CLICK_COUNT = 3;
const INSTALL_SOURCE = "discovery-promo";

function setupModule() {
  controller = mozmill.getBrowserController();
  am = new addons.AddonsManager(controller);

  tabs.closeAllTabs(controller);
}

function teardownModule() {
  delete persisted.currentAddon;
  am.close();
}

/**
 * Verifies that an addon from the Mozilla Pick of the month section can be installed
 */
function testInstallPickOfTheMonthAddon() {
  am.open();

  // Select the Get Add-ons pane
  am.setCategory({category: am.getCategoryById({id: "discover"})});
  var discovery = am.discoveryPane;
  discovery.waitForPageLoad();

  // Go to Mozilla's pick of the Month panel
  // XXX: Bug 666530
  //      Add a property or attribute on "main-feature" which changes when clicking
  //      next/prev buttons - currently we are clicking the third subsection without
  //      checking if it is the right one
  var section = discovery.getSection("main-feature");
  var nextLink = discovery.getElement({type: "mainFeature_nextLink", parent: section});

  for (var i = 0; i < CLICK_COUNT; i++) {
    controller.click(nextLink);
    controller.sleep(TIMEOUT_SWITCH);
  }

  // Install the addon
  var addToFirefox = discovery.getElement({type: "addon_installButton", parent: section});

  // Retrieve addon src parameter from installation link
  var currentInstallSource = discovery.getInstallSource(addToFirefox);

  controller.assert(function () {
    return currentInstallSource === INSTALL_SOURCE;
  }, "Installation link has source set - got '" + currentInstallSource +
     "', expected '" + INSTALL_SOURCE + "'");

  var md = new modalDialog.modalDialog(am.controller.window);
  md.start(addons.handleInstallAddonDialog);
  controller.click(addToFirefox);

  md.waitForDialog(TIMEOUT_DOWNLOAD);

  // Verify the addon is installed
  am.setCategory({category: am.getCategoryById({id: "extension"})});

  var addon = am.getAddons({attribute: "name", value: persisted.currentAddon})[0];

  controller.assert(function () {
    return am.isAddonInstalled({addon: addon});
  }, "Add-on has been installed - got '" +
     am.isAddonInstalled({addon: addon}) + "', expected 'true'");
}

// XXX: Bug 688146
//      Pick of the Month add-ons are not compatible with this version of Firefox
setupModule.__force_skip__ = "Bug 688146 - 'Pick of the Month' add-ons " +
                             "are not compatible with this version of Firefox";
teardownModule.__force_skip__ = "Bug 688146 - 'Pick of the Month' add-ons " +
                                "are not compatible with this version of Firefox";


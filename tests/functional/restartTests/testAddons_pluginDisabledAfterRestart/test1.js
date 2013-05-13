/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var addons = require("../../../../lib/addons");
var {assert} = require("../../../../lib/assertions");
var tabs = require("../../../../lib/tabs");

function setupModule(aModule) {
  controller = mozmill.getBrowserController();

  // Skip test if we don't have enabled plugins
  var activePlugins = addons.getInstalledAddons(function (aAddon) {
    if (aAddon.isActive && aAddon.type === "plugin")
      return {
        id: aAddon.id
      }
  });

  if (activePlugins.length !== 0) {
    aModule.plugin = activePlugins[0];
  } else {
    testDisablePlugin.__force_skip__= "No enabled plugins detected"
  }

  // If a plugin is disabled the total number of plugins will decrease
  persisted.enabledPlugins = controller.window.navigator.plugins.length;

  addonsManager = new addons.AddonsManager(controller);
  tabs.closeAllTabs(controller);
}

/**
 * Test disabling a plugin
 */
function testDisablePlugin() {
  addonsManager.open();

  // Select the Plugins pane
  addonsManager.setCategory({
    category: addonsManager.getCategoryById({id: "plugin"})
  });

  var aPlugin = addonsManager.getAddons({attribute: "value",
                                         value: plugin.id})[0];

  persisted.plugin = {
    id: aPlugin.getNode().getAttribute("value"),
    name: aPlugin.getNode().getAttribute("name")
  };

  // Disable the plugin
  addonsManager.disableAddon({addon: aPlugin});

  // Check that the plugin is disabled
  assert.equal(aPlugin.getNode().getAttribute("active"), "false",
               persisted.plugin.name + " is disabled");
}

setupModule.__force_skip__ = "Bug 865640 - Shockwave Flash and Java Plug-in are" +
                             " disabled - 'true' should equal 'false'";

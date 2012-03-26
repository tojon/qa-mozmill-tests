/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Include required modules
var softwareUpdate = require("../../../lib/software-update");
var utils = require("../../../lib/utils");

function setupModule(module) {
  controller = mozmill.getBrowserController();
  update = new softwareUpdate.softwareUpdate();

  // Collect some data of the current build
  persisted.updates[persisted.updateIndex].build_post = update.buildInfo;
}

function teardownModule(module) {
  // Prepare persisted object for the next update
  persisted.updateIndex++;
}

/**
 * Test that the update has been correctly applied and no further updates
 * can be found.
 */
function testFallbackUpdate_AppliedAndNoUpdatesFound() {
  // Open the software update dialog and wait until the check has been finished
  update.openDialog(controller);
  update.waitForCheckFinished();

  // No updates should be offered now - filter out major updates
  if (update.updatesFound) {
    update.download(persisted.channel, false);

    controller.assert(function() {
      return update.updateType != persisted.updates[persisted.updateIndex].type;
    }, "No more update of the same type offered.");
  }

  // Check that updates have been applied correctly
  update.assertUpdateApplied(persisted);

  // Update was successful
  persisted.updates[persisted.updateIndex].success = true;
}

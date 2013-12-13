/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Include necessary modules
var search = require("../../../lib/search");

const BASE_URL = collector.addHttpResource("../../../../data/");
const TEST_DATA = BASE_URL + "search/searchresults.html?q={searchTerms}";

function setupModule(aModule) {
  aModule.controller = mozmill.getBrowserController();
  aModule.searchBar = new search.searchBar(aModule.controller);

  aModule.searchBar.installEngine("Test Search Engine", TEST_DATA, {selected: true});
}

function teardownModule(aModule) {
  aModule.searchBar.clear();
  aModule.searchBar.restoreDefaultEngines();

}

/**
 * Use the keyboard shortcut to focus the search bar and start a search
 */
function testShortcutAndSearch() {
  searchBar.focus({type: "shortcut"});
  searchBar.search({text: "Mozilla", action: "goButton"});
}

setupModule.__force_skip__ = "Bug 949428 - Test disabled due to constant failures";
teardownModule.__force_skip__ = "Bug 949428 - Test disabled due to constant failures";
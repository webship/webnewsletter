'use strict';

const { Given, Then } = require('@cucumber/cucumber');
const { friendly } = require('webship-js/tests/step-definitions/webship');

/**
 * Log in as Drupal admin using credentials from env vars.
 *
 * Uses DRUPAL_ADMIN_USERNAME (default: 'admin') and
 * DRUPAL_ADMIN_PASSWORD (default: 'admin' for CI).
 *
 * Example: Given I am logged in as admin
 */
Given('I am logged in as admin', async function () {
  const username = process.env.DRUPAL_ADMIN_USERNAME;
  const password = process.env.DRUPAL_ADMIN_PASSWORD;
  await this.page.goto(`${this.parameters.launchUrl}/user/login`);
  await this.page.getByLabel('Username').fill(username);
  await this.page.getByLabel('Password').fill(password);
  await this.page.locator('input[value="Log in"]').click();
  await this.page.waitForLoadState('networkidle');
});

/**
 * Assert that a form field with the given label is visible on the page.
 *
 * Example #1: Then I should see a "Name" field
 * Example #2: Then I should see a "Email" field
 * Example #3: Then I should see a "Status" field
 * Example #4: Then I should see a "Username" field
 * Example #5: Then I should see a "Password" field
 */
Then(/^(I |we )?should see a "([^"]*)" field$/, async function (pronoun, label) {
  await friendly(this, async () => {
    const locator = this.page.getByLabel(label, { exact: false });
    await locator.waitFor({ state: 'visible', timeout: 10000 });
  }, `Expected to find a field labeled "${label}"`);
});

/**
 * Assert that a form field with the given label (with article "an") is visible.
 *
 * Example #1: Then I should see an "Email" field
 * Example #2: Then I should see an "Author" field
 * Example #3: Then I should see an "Options" field
 * Example #4: And I should see an "Email" field
 * Example #5: And I should see an "Author" field
 */
Then(/^(I |we )?should see an "([^"]*)" field$/, async function (pronoun, label) {
  await friendly(this, async () => {
    const locator = this.page.getByLabel(label, { exact: false });
    await locator.waitFor({ state: 'visible', timeout: 10000 });
  }, `Expected to find a field labeled "${label}"`);
});

/**
 * Assert that a button with the given text is visible on the page.
 *
 * Example #1: Then I should see the button "Subscribe"
 * Example #2: Then I should see the button "Save"
 * Example #3: Then I should see the button "Log in"
 * Example #4: Then I should see the button "Delete"
 * Example #5: Then I should see the button "Submit"
 */
Then(/^(I |we )?should see the button "([^"]*)"$/, async function (pronoun, text) {
  await friendly(this, async () => {
    const locator = this.page.getByRole('button', { name: text, exact: false });
    await locator.waitFor({ state: 'visible', timeout: 10000 });
  }, `Expected to find a button with text "${text}"`);
});

'use strict';

const { Given, Then } = require('@cucumber/cucumber');
const { friendly } = require('webship-js/tests/step-definitions/webship');

/**
 * Run a step body and rethrow any failure as a tester-friendly error.
 */
async function attempt(body, message) {
  try {
    await body();
  } catch (err) {
    throw friendly(message, err);
  }
}

/**
 * Whether a role exists, by the status of its edit page.
 */
async function roleExists(world, role) {
  const response = await world.page.goto(`${world.parameters.launchUrl}/admin/people/roles/manage/${role}`);
  return Boolean(response) && response.status() === 200;
}

/**
 * Create the roles that the users registry names (the "roles" of each entry
 * in cucumber.js worldParameters.users) and that do not exist yet, then grant
 * every role the permissions that its registry entry lists under
 * "rolePermissions". The step pack's `I add the testing users` needs the
 * roles to exist and does not grant permissions, so run this step first,
 * logged in as a user who may administer roles and permissions (the
 * Webmaster). Roles that exist are left alone and permissions are only added.
 *
 * Example #1: Given the testing roles and their permissions exist
 * Example #2: And the testing roles and their permissions exist
 */
Given(/^the testing roles and their permissions exist$/, async function () {
  const users = Object.values(this.parameters.users || {});
  const roles = new Set();
  users.forEach((info) => (info.roles || []).forEach((role) => roles.add(role)));

  for (const role of roles) {
    if (await roleExists(this, role)) continue;
    await attempt(async () => {
      await this.page.goto(`${this.parameters.launchUrl}/admin/people/roles/add`);
      // The label is the role machine name as words; Drupal derives the
      // machine name from it, which matches the machine names in cucumber.js.
      await this.page.locator('#edit-label').fill(role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
      await this.page.waitForFunction(
        (id) => { const el = document.querySelector('#edit-id'); return Boolean(el) && el.value === id; },
        role,
        { timeout: 5000 },
      ).catch(() => {});
      // Set the machine name directly in case the form script did not derive it.
      await this.page.evaluate((id) => { const el = document.querySelector('#edit-id'); if (el) el.value = id; }, role);
      await this.page.locator('#edit-submit').click();
      await this.page.waitForLoadState('networkidle');
      if (!(await roleExists(this, role))) throw new Error(`The "${role}" role does not exist after the form was submitted`);
    }, `Creating the "${role}" role failed.`);
  }

  for (const info of users) {
    const role = (info.roles || [])[0];
    if (!role || !(info.rolePermissions || []).length) continue;
    await attempt(async () => {
      await this.page.goto(`${this.parameters.launchUrl}/admin/people/permissions/${role}`);
      for (const permission of info.rolePermissions) {
        // The checkbox is named after the role and the permission machine name; fall back
        // to the row that shows the permission as text.
        let box = this.page.locator(`input[type="checkbox"][name="${role}[${permission}]"]`).first();
        if (!(await box.count())) box = this.page.locator('tr', { hasText: permission }).first().locator('input[type="checkbox"]').first();
        if (!(await box.count())) throw new Error(`The "${permission}" permission is not on the "${role}" permissions page`);
        await box.check();
      }
      await this.page.locator('#edit-submit').click();
      await this.page.waitForLoadState('networkidle');
    }, `Granting the "${role}" role its permissions failed.`);
  }
});

/**
 * Resolve a form field locator by label, falling back to the label element
 * itself for inputs that are visually replaced by rich editors (CKEditor,
 * file widgets, etc.) which hide the underlying control.
 */
function fieldLocator(page, label) {
  return page
    .locator('label.form-item__label, label.form-required, label')
    .filter({ hasText: new RegExp(`^\\s*${label.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}(\\s|$)`, 'i') })
    .first();
}

/**
 * Assert that a form field with the given label is visible on the page.
 *
 * Example #1: Then I should see a "Name" field
 * Example #2: Then I should see a "Status" field
 * Example #3: Then I should see a "Username" field
 * Example #4: Then I should see a "Password" field
 * Example #5: Then I should see a "Subject" field
 */
Then(/^(?:I |we )?should see a "([^"]*)" field$/, async function (label) {
  await attempt(async () => {
    const locator = fieldLocator(this.page, label);
    await locator.waitFor({ state: 'visible', timeout: 10000 });
  }, `Expected to find a field labeled "${label}"`);
});

/**
 * Assert that a form field with the given label (with article "an") is visible.
 *
 * Example #1: Then I should see an "Email" field
 * Example #2: Then I should see an "Author" field
 */
Then(/^(?:I |we )?should see an "([^"]*)" field$/, async function (label) {
  await attempt(async () => {
    const locator = fieldLocator(this.page, label);
    await locator.waitFor({ state: 'visible', timeout: 10000 });
  }, `Expected to find a field labeled "${label}"`);
});

/**
 * Assert that a button with the given text is visible on the page.
 *
 * Example #1: Then I should see the button "Subscribe"
 * Example #2: Then I should see the button "Save"
 */
Then(/^(?:I |we )?should see the button "([^"]*)"$/, async function (text) {
  await attempt(async () => {
    const locator = this.page.getByRole('button', { name: text, exact: false }).first();
    await locator.waitFor({ state: 'visible', timeout: 10000 });
  }, `Expected to find a button with text "${text}"`);
});

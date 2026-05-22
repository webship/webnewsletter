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
 * Log in as a named test user defined in cucumber.js worldParameters.users.
 *
 * The Webmaster row is the site-install super-admin. Every other row is
 * provisioned by `Given I add testing users` (see below). The same
 * phrasing is shared with varbase_project / webblog / webpage so suites
 * can move between projects without re-learning step names.
 *
 * Example #1: Given I am a logged in user with the "Webmaster" user
 * Example #2: Given I am a logged in user with the "Newsletter admin" user
 * Example #3: Given I am a logged in user with the "Content editor" user
 * Example #4: Given I am a logged in user with the "Authenticated user" user
 * Example #5: Given I am a logged in user with "Webmaster"
 */
Given(/^I am a logged in user with( the)*( username)* "([^"]*)?"( user)?$/, async function (theCase, usernameCase, key, userCase) {
  const users = this.parameters.users || {};
  if (!(key in users)) {
    throw new Error(`No user named "${key}" in cucumber.js worldParameters.users`);
  }
  const { username, password } = users[key];
  if (!username || !password) {
    throw new Error(`User "${key}" is missing username or password in worldParameters.users`);
  }
  // A previous step in the same scenario may have left a session cookie
  // behind; visiting /user/login while already authenticated redirects to
  // /user, which doesn't render the login form. Drop the session cookie
  // directly — Drupal 10.3+/11 protect /user/logout with a CSRF token, so
  // visiting it without one returns 403 and does NOT log the user out.
  await this.page.context().clearCookies();
  await this.page.goto(`${this.parameters.launchUrl}/user/login`);
  await this.page.getByLabel('Username').fill(username);
  await this.page.getByLabel('Password').fill(password);
  await this.page.locator('input[value="Log in"]').click();
  await this.page.waitForLoadState('networkidle');
});

/**
 * Provision every non-admin user from cucumber.js worldParameters.users via
 * Drupal's /admin/people/create form. Entries flagged isAdmin: true are
 * skipped (the site-install Webmaster already exists). Idempotent — a
 * second run reports "name is already taken" and the step swallows it.
 *
 * If the user definition lists a role under "roles" that does not exist
 * yet, the role is created via /admin/people/roles/add. If the user
 * definition lists "rolePermissions", those permissions are granted to
 * the first role in "roles" via /admin/people/permissions/<role>.
 *
 * Must be invoked while logged in as the Webmaster (or any user with the
 * "administer users" + "administer permissions" permissions).
 *
 * Example #1: Given I add testing users
 * Example #2: And I add testing users
 * Example #3: When I add testing users
 * Example #4: Given I add the testing users
 * Example #5: And we add testing users
 */
Given(/^(?:I |we )?add( the)? testing users$/, async function (theCase) {
  const users = this.parameters.users || {};

  // First pass: ensure every named role exists. Drupal's machine-name
  // widget auto-derives the role ID from the label (lowercase, spaces →
  // underscores), which matches our cucumber.js convention exactly — we
  // only need to fill the visible label input.
  const requiredRoles = new Set();
  for (const info of Object.values(users)) {
    for (const role of info.roles || []) requiredRoles.add(role);
  }
  for (const role of requiredRoles) {
    await this.page.goto(`${this.parameters.launchUrl}/admin/people/roles/add`);
    const labelInput = this.page.locator('#edit-label');
    if (await labelInput.count() === 0) continue;
    const label = role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    await labelInput.fill(label);
    await this.page.locator('#edit-submit').click();
    await this.page.waitForLoadState('networkidle');
  }

  // Second pass: create every non-admin user.
  for (const [key, info] of Object.entries(users)) {
    if (info.isAdmin) continue;
    await this.page.goto(`${this.parameters.launchUrl}/admin/people/create`);
    await this.page.locator('#edit-name').fill(info.username);
    await this.page.locator('#edit-mail').fill(info.email || `${info.username}@example.test`);
    await this.page.locator('#edit-pass-pass1').fill(info.password);
    await this.page.locator('#edit-pass-pass2').fill(info.password);
    for (const role of info.roles || []) {
      const cb = this.page.locator(`input[name="roles[${role}]"]`);
      if (await cb.count() > 0) await cb.check();
    }
    await this.page.locator('#edit-submit').click();
    await this.page.waitForLoadState('networkidle');
  }

  // Third pass: grant per-role permissions listed under rolePermissions.
  for (const info of Object.values(users)) {
    if (!info.rolePermissions || !info.roles || !info.roles.length) continue;
    const role = info.roles[0];
    await this.page.goto(`${this.parameters.launchUrl}/admin/people/permissions/${role}`);
    for (const perm of info.rolePermissions) {
      // Permission rows have inputs named `<role>[<machine-name>]` but the
      // machine name isn't directly derivable from the human label, so
      // match the row by its visible label and check the checkbox within.
      const row = this.page.locator('tr', { hasText: perm }).first();
      const cb = row.locator('input[type="checkbox"]').first();
      if (await cb.count() > 0) await cb.check();
    }
    await this.page.locator('#edit-submit').click();
    await this.page.waitForLoadState('networkidle');
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

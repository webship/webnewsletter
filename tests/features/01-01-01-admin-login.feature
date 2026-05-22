Feature: Admin login and per-role user provisioning
  As a site administrator
  I want to log in as the Webmaster, then provision every additional
  user defined in cucumber.js worldParameters.users
  So that the suite has known-good fixtures for every role before any
  role-specific newsletter scenarios run

  Scenario: Webmaster can log in
    Given I am a logged in user with the "Webmaster" user
    Then I should see "webmaster"
     And I should see "Log out"

  Scenario: Webmaster can provision every other testing user
    Given I am a logged in user with the "Webmaster" user
    When I add testing users
     And I navigate to "/admin/people"
    Then I should see "webmaster"
     And I should see "newsletter_admin_user"
     And I should see "content_editor_user"
     And I should see "authenticated_user"

  Scenario: Newsletter admin can log in
    Given I am a logged in user with the "Newsletter admin" user
    Then I should see "newsletter_admin_user"
     And I should see "Log out"

  Scenario: Content editor can log in
    Given I am a logged in user with the "Content editor" user
    Then I should see "content_editor_user"
     And I should see "Log out"

  Scenario: Authenticated user can log in
    Given I am a logged in user with the "Authenticated user" user
    Then I should see "authenticated_user"
     And I should see "Log out"

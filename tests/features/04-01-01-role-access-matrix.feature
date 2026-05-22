Feature: Newsletter access matrix across Standard profile roles
  As a site administrator
  I want to verify newsletter URL access for every default role
  So that I know who can and cannot manage subscribers, and the public
  subscribe form remains reachable for everyone

  Scenario: Webmaster can reach the subscriber listing
    Given I am a logged in user with the "Webmaster" user
    When I navigate to "/admin/config/webnewsletter/emails"
    Then I should see "Web Newsletter Emails"
     And I should see "Email"

  Scenario: Webmaster can reach the add-subscriber form
    Given I am a logged in user with the "Webmaster" user
    When I navigate to "/admin/config/webnewsletter/email/add"
    Then I should see "Add web newsletter emails"
     And I should see an "Email" field

  Scenario: Newsletter admin can reach the subscriber listing
    Given I am a logged in user with the "Newsletter admin" user
    When I navigate to "/admin/config/webnewsletter/emails"
    Then I should see "Web Newsletter Emails"
     And I should see "Email"

  Scenario: Newsletter admin can reach the add-subscriber form
    Given I am a logged in user with the "Newsletter admin" user
    When I navigate to "/admin/config/webnewsletter/email/add"
    Then I should see "Add web newsletter emails"
     And I should see an "Email" field

  Scenario: Content editor cannot reach the subscriber listing
    Given I am a logged in user with the "Content editor" user
    When I navigate to "/admin/config/webnewsletter/emails"
    Then I should see "Access denied"

  Scenario: Content editor cannot reach the add-subscriber form
    Given I am a logged in user with the "Content editor" user
    When I navigate to "/admin/config/webnewsletter/email/add"
    Then I should see "Access denied"

  Scenario: Authenticated user cannot reach the subscriber listing
    Given I am a logged in user with the "Authenticated user" user
    When I navigate to "/admin/config/webnewsletter/emails"
    Then I should see "Access denied"

  Scenario: Authenticated user cannot reach the add-subscriber form
    Given I am a logged in user with the "Authenticated user" user
    When I navigate to "/admin/config/webnewsletter/email/add"
    Then I should see "Access denied"

  Scenario: Anonymous user cannot reach the subscriber listing
    Given I am an anonymous user
    When I navigate to "/admin/config/webnewsletter/emails"
    Then I should see "Access denied"

  Scenario: Every role can subscribe via the public form
    Given I am an anonymous user
    When I navigate to "/newsletter/subscribe"
    Then I should see "Newsletter Subscribe"
     And I should see the button "Subscribe"
    Given I am a logged in user with the "Authenticated user" user
    When I navigate to "/newsletter/subscribe"
    Then I should see "Newsletter Subscribe"
     And I should see the button "Subscribe"
    Given I am a logged in user with the "Content editor" user
    When I navigate to "/newsletter/subscribe"
    Then I should see "Newsletter Subscribe"
     And I should see the button "Subscribe"

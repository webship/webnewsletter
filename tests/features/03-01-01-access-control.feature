Feature: Access control on newsletter admin pages
  As a site administrator
  I want only authorized users to reach the newsletter admin URLs
  So that the subscriber list and the settings page are not exposed

  Scenario: Anonymous user cannot reach the subscriber listing
    Given I am an anonymous user
    When I navigate to "/admin/config/webnewsletter/emails"
    Then I should see "Access denied"

  Scenario: Anonymous user cannot reach the add-subscriber form
    Given I am an anonymous user
    When I navigate to "/admin/config/webnewsletter/email/add"
    Then I should see "Access denied"

  Scenario: Anonymous user cannot reach the settings page
    Given I am an anonymous user
    When I navigate to "/admin/structure/webnewsletter-emails"
    Then I should see "Access denied"

  Scenario: Anonymous user can reach the public subscribe form
    Given I am an anonymous user
    When I navigate to "/newsletter/subscribe"
    Then I should see "Newsletter Subscribe"
     And I should see the button "Subscribe"

  Scenario: Webmaster can reach the subscriber listing
    Given I am a logged in user with the "Webmaster" user
    When I navigate to "/admin/config/webnewsletter/emails"
    Then I should see "Web Newsletter Emails"

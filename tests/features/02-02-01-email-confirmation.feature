Feature: Confirmation flow after a newsletter subscription
  As a newsletter subscriber
  I want the site to confirm that my subscription was recorded
  So that I know my submission was successful

  Scenario: Anonymous subscriber sees the thank-you confirmation message
    Given I am an anonymous user
    When I navigate to "/newsletter/subscribe"
     And I fill in "Webship Team" for "Name"
     And I fill in "confirm-anon@webship.co" for "Email"
     And I press "Subscribe"
    Then I should see "Thank you for joining us"

  Scenario: Authenticated subscriber sees the thank-you confirmation message
    Given I am a logged in user with the "Authenticated user" user
    When I navigate to "/newsletter/subscribe"
     And I fill in "Webship Team" for "Name"
     And I fill in "confirm-auth@webship.co" for "Email"
     And I press "Subscribe"
    Then I should see "Thank you for joining us"

  Scenario: A webform submission shows up on the webform results page
    Given I am an anonymous user
    When I navigate to "/newsletter/subscribe"
     And I fill in "Rajab N" for "Name"
     And I fill in "confirm-results@webship.co" for "Email"
     And I press "Subscribe"
    Then I should see "Thank you for joining us"
    Given I am a logged in user with the "Webmaster" user
    When I navigate to "/admin/structure/webform/manage/newsletter_subscribe/results/submissions"
    Then I should see "Newsletter Subscribe"
     And I should see "confirm-results@webship.co"

  Scenario: A webform submission creates a matching subscriber entity in the listing
    Given I am an anonymous user
    When I navigate to "/newsletter/subscribe"
     And I fill in "Cross-check User" for "Name"
     And I fill in "confirm-listing@webship.co" for "Email"
     And I press "Subscribe"
    Then I should see "Thank you for joining us"
    Given I am a logged in user with the "Webmaster" user
    When I navigate to "/admin/config/webnewsletter/emails"
    Then I should see "confirm-listing@webship.co"
     And I should see "Cross-check User"

  Scenario: The email-confirmation webform handler is wired into newsletter_subscribe
    Given I am a logged in user with the "Webmaster" user
    When I navigate to "/admin/structure/webform/manage/newsletter_subscribe/handlers"
    Then I should see "Newsletter Subscribe"
     And I should see "Email Confirmation"

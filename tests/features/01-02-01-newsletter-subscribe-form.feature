Feature: Newsletter Subscribe Form
  As an anonymous user
  I want to subscribe to the newsletter
  So that I can receive newsletter updates

  Background:
    Given I am an anonymous user

  Scenario: Anonymous user can access the newsletter subscribe form
    When I navigate to "/newsletter/subscribe"
    Then I should see "Newsletter Subscribe"
     And I should see a "Name" field
     And I should see an "Email" field
     And I should see the button "Subscribe"

  Scenario: Anonymous user can subscribe with valid data
    When I navigate to "/newsletter/subscribe"
     And I fill in "Webship Team" for "Name"
     And I fill in "info@webship.co" for "Email"
     And I press "Subscribe"
    Then I should see "Thank you for joining us"
     And the url should match "/"

  Scenario: Duplicate email subscription is prevented
    Given I navigate to "/newsletter/subscribe"
      And I fill in "Webship Team" for "Name"
      And I fill in "info@webship.co" for "Email"
      And I press "Subscribe"
     When I navigate to "/newsletter/subscribe"
      And I fill in "Another Name" for "Name"
      And I fill in "info@webship.co" for "Email"
      And I press "Subscribe"
    Then I should see "Thank you for joining us"

  Scenario: Subscribe form requires email
    When I navigate to "/newsletter/subscribe"
     And I fill in "Test User" for "Name"
     And I press "Subscribe"
    Then I should see "field is required"

  Scenario: Subscribe form requires name
    When I navigate to "/newsletter/subscribe"
     And I fill in "rajabn@gmail.com" for "Email"
     And I press "Subscribe"
    Then I should see "field is required"

  Scenario: Subscribe form validates email format
    When I navigate to "/newsletter/subscribe"
     And I fill in "Test User" for "Name"
     And I fill in "not-a-valid-email" for "Email"
     And I press "Subscribe"
    Then I should see "not-a-valid-email"

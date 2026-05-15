Feature: Email Confirmation on Subscription
  As a newsletter subscriber
  I want to receive a confirmation email
  So that I know my subscription was successful

  Background:
    Given I am an anonymous user

  Scenario: Subscriber receives confirmation email after subscribing
    When I navigate to "/newsletter/subscribe"
     And I fill in "Webship Team" for "Name"
     And I fill in "info@webship.co" for "Email"
     And I press "Subscribe"
    Then I should see "Thank you for joining us"

  Scenario: Subscriber entity is created on webform submission
    When I navigate to "/newsletter/subscribe"
     And I fill in "Rajab N" for "Name"
     And I fill in "rajabn@gmail.com" for "Email"
     And I press "Subscribe"
    Then I should see "Thank you for joining us"

  Scenario: Webform submission page is accessible by admin
    Given I am logged in as admin
    When I navigate to "/admin/structure/webform/manage/newsletter_subscribe/results/submissions"
    Then I should see "Newsletter Subscribe"

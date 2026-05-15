Feature: Admin Subscriber Management
  As an admin user
  I want to manage newsletter subscribers
  So that I can maintain the subscriber list

  Background:
    Given I am logged in as admin

  Scenario: Admin can view subscribers list
    When I navigate to "/admin/config/webnewsletter/emails"
    Then I should see "Web Newsletter Emails"
     And I should see "Email"
     And I should see "Name"
     And I should see "Status"
     And I should see "Subscribed"

  Scenario: Admin can add a subscriber manually
    When I navigate to "/admin/config/webnewsletter/email/add"
    Then I should see "Add web newsletter emails"
     And I should see an "Email" field
     And I should see a "Name" field
     And I should see a "Status" field
    When I fill in "rajabn@gmail.com" for "Email"
     And I fill in "Rajab N" for "Name"
     And I press "Save"
    Then I should see "rajabn@gmail.com"
     And the url should match "webnewsletter/email"

  Scenario: Admin can edit a subscriber
    Given I navigate to "/admin/config/webnewsletter/email/add"
      And I fill in "info@webship.co" for "Email"
      And I fill in "Webship" for "Name"
      And I press "Save"
      And I navigate to "/admin/config/webnewsletter/emails"
    When I click "Edit" in the "Webship" row
     And I fill in "Webship Team" for "Name"
     And I press "Save"
    Then I should see "Webship Team"

  Scenario: Admin can delete a subscriber
    Given I navigate to "/admin/config/webnewsletter/email/add"
      And I fill in "info@webship.co" for "Email"
      And I fill in "Test Delete" for "Name"
      And I press "Save"
    When I click "Delete"
     And I press "Delete" by "value" attr
    Then I should see "Web Newsletter Emails"
     And I should not see "Test Delete"

  Scenario: Admin can deactivate a subscriber
    Given I navigate to "/admin/config/webnewsletter/email/add"
      And I fill in "rajabn@gmail.com" for "Email"
      And I fill in "Rajab N" for "Name"
      And I press "Save"
      And I navigate to "/admin/config/webnewsletter/emails"
    When I click "Edit" in the "Rajab N" row
     And I uncheck the checkbox "#edit-status-value"
     And I press "Save"
    Then I should see "Inactive"

  Scenario: Admin settings page is accessible
    When I navigate to "/admin/structure/webnewsletter-emails"
    Then I should see "Web Newsletter Emails"

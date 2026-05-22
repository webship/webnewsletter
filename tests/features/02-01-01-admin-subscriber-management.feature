Feature: Admin subscriber management
  As a newsletter admin
  I want to view, add, edit, deactivate, and delete newsletter
  subscribers from the admin UI
  So that the subscriber list always reflects reality

  Background:
    Given I am a logged in user with the "Webmaster" user

  Scenario: Subscriber listing exposes the configured columns
    When I navigate to "/admin/config/webnewsletter/emails"
    Then I should see "Web Newsletter Emails"
     And I should see "Email"
     And I should see "Name"
     And I should see "Status"
     And I should see "Subscribed"

  Scenario: Add form exposes the expected fields
    When I navigate to "/admin/config/webnewsletter/email/add"
    Then I should see "Add web newsletter emails"
     And I should see an "Email" field
     And I should see a "Name" field
     And I should see a "Status" field

  Scenario: Admin can add a subscriber manually
    When I navigate to "/admin/config/webnewsletter/email/add"
     And I fill in "rajabn@gmail.com" for "Email"
     And I fill in "Rajab N" for "Name"
     And I press "Save"
    Then I should see "rajabn@gmail.com"
     And the url should match "webnewsletter/email"

  Scenario: A newly added subscriber appears in the listing
    Given I navigate to "/admin/config/webnewsletter/email/add"
      And I fill in "listing@webship.co" for "Email"
      And I fill in "Listing Test User" for "Name"
      And I press "Save"
    When I navigate to "/admin/config/webnewsletter/emails"
    Then I should see "listing@webship.co"
     And I should see "Listing Test User"

  Scenario: Admin can edit an existing subscriber's name
    Given I navigate to "/admin/config/webnewsletter/email/add"
      And I fill in "edit-target@webship.co" for "Email"
      And I fill in "Edit Target" for "Name"
      And I press "Save"
      And I navigate to "/admin/config/webnewsletter/emails"
    When I click "Edit" in the "Edit Target" row
     And I fill in "Edit Target Updated" for "Name"
     And I press "Save"
    Then I should see "Edit Target Updated"

  Scenario: Admin can deactivate a subscriber
    Given I navigate to "/admin/config/webnewsletter/email/add"
      And I fill in "inactive@webship.co" for "Email"
      And I fill in "Inactive Target" for "Name"
      And I press "Save"
      And I navigate to "/admin/config/webnewsletter/emails"
    When I click "Edit" in the "Inactive Target" row
     And I uncheck the checkbox "#edit-status-value"
     And I press "Save"
    Then I should see "Inactive"

  Scenario: Admin can delete a subscriber
    Given I navigate to "/admin/config/webnewsletter/email/add"
      And I fill in "delete-target@webship.co" for "Email"
      And I fill in "Delete Target" for "Name"
      And I press "Save"
    When I click "Delete"
     And I press "Delete" by "value" attr
    Then I should see "Web Newsletter Emails"
     And I should not see "Delete Target"

  Scenario: Subscriber listing is reachable from /admin/content
    When I navigate to "/admin/content"
    Then I should see "Web Newsletter Emails"

  Scenario: Settings page is reachable from /admin/structure
    When I navigate to "/admin/structure/webnewsletter-emails"
    Then I should see "Web Newsletter Emails"

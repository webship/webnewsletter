Feature: Access Control
  As a system administrator
  I want proper access control on newsletter pages
  So that only authorized users can manage subscribers

  Scenario: Anonymous user cannot access subscriber admin list
    Given I am an anonymous user
    When I navigate to "/admin/config/webnewsletter/emails"
    Then I should see "Access denied"

  Scenario: Anonymous user cannot add subscribers via admin form
    Given I am an anonymous user
    When I navigate to "/admin/config/webnewsletter/email/add"
    Then I should see "Access denied"

  Scenario: Anonymous user can access public subscribe form
    Given I am an anonymous user
    When I navigate to "/newsletter/subscribe"
    Then I should see "Newsletter Subscribe"
     And I should see the button "Subscribe"

  Scenario: Admin user can access subscriber list
    Given I am logged in as admin
    When I navigate to "/admin/config/webnewsletter/emails"
    Then I should see "Web Newsletter Emails"

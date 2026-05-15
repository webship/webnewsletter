<?php

namespace Drupal\webnewsletter\Plugin\WebformHandler;

use Drupal\Core\Form\FormStateInterface;
use Drupal\webform\Plugin\WebformHandlerBase;
use Drupal\webform\WebformSubmissionInterface;

/**
 * Creates a newsletter subscriber entity on webform submission.
 *
 * @WebformHandler(
 *   id = "webnewsletter_subscribe",
 *   label = @Translation("Newsletter Subscribe"),
 *   category = @Translation("Web Newsletter"),
 *   description = @Translation("Creates a newsletter subscriber entity on form submission."),
 *   cardinality = \Drupal\webform\Plugin\WebformHandlerInterface::CARDINALITY_UNLIMITED,
 *   results = \Drupal\webform\Plugin\WebformHandlerInterface::RESULTS_PROCESSED,
 *   submission = \Drupal\webform\Plugin\WebformHandlerInterface::SUBMISSION_REQUIRED,
 * )
 */
class WebnewsletterSubscribeWebformHandler extends WebformHandlerBase {

  /**
   * {@inheritdoc}
   */
  public function postSave(WebformSubmissionInterface $webform_submission, $update = TRUE) {
    if ($update) {
      return;
    }

    $data = $webform_submission->getData();
    $email = $data['email'] ?? '';
    $name = $data['name'] ?? '';

    if (empty($email)) {
      return;
    }

    $existing = \Drupal::entityTypeManager()
      ->getStorage('webnewsletter_emails')
      ->loadByProperties(['email' => $email]);

    if (!empty($existing)) {
      return;
    }

    $entity = \Drupal::entityTypeManager()
      ->getStorage('webnewsletter_emails')
      ->create([
        'email' => $email,
        'name' => $name,
        'status' => TRUE,
        'uid' => \Drupal::currentUser()->id(),
      ]);
    $entity->save();
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {}

}

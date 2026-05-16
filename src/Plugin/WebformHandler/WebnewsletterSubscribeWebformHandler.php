<?php

namespace Drupal\webnewsletter\Plugin\WebformHandler;

use Drupal\Core\Form\FormStateInterface;
use Drupal\webform\Plugin\WebformHandlerBase;
use Drupal\webform\WebformSubmissionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

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
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    $instance = parent::create($container, $configuration, $plugin_id, $plugin_definition);
    $instance->currentUser = $container->get('current_user');
    return $instance;
  }

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

    $storage = $this->entityTypeManager->getStorage('webnewsletter_emails');

    $existing = $storage->loadByProperties(['email' => $email]);
    if (!empty($existing)) {
      return;
    }

    $entity = $storage->create([
      'email' => $email,
      'name' => $name,
      'status' => TRUE,
      'uid' => $this->currentUser->id(),
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

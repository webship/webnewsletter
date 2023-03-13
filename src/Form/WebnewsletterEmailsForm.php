<?php

namespace Drupal\webnewsletter\Form;

use Drupal\Core\Entity\ContentEntityForm;
use Drupal\Core\Form\FormStateInterface;

/**
 * Form controller for the web newsletter emails entity edit forms.
 */
class WebnewsletterEmailsForm extends ContentEntityForm {

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    $result = parent::save($form, $form_state);

    $entity = $this->getEntity();

    $message_arguments = ['%label' => $entity->toLink()->toString()];
    $logger_arguments = [
      '%label' => $entity->label(),
      'link' => $entity->toLink($this->t('View'))->toString(),
    ];

    switch ($result) {
      case SAVED_NEW:
        $this->messenger()->addStatus($this->t('New web newsletter emails %label has been created.', $message_arguments));
        $this->logger('webnewsletter')->notice('Created new web newsletter emails %label', $logger_arguments);
        break;

      case SAVED_UPDATED:
        $this->messenger()->addStatus($this->t('The web newsletter emails %label has been updated.', $message_arguments));
        $this->logger('webnewsletter')->notice('Updated web newsletter emails %label.', $logger_arguments);
        break;
    }

    $form_state->setRedirect('entity.webnewsletter_emails.canonical', ['webnewsletter_emails' => $entity->id()]);

    return $result;
  }

}

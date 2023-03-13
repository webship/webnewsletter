<?php

namespace Drupal\webnewsletter\Entity;

use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Entity\RevisionableContentEntityBase;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\user\EntityOwnerTrait;
use Drupal\webnewsletter\WebnewsletterEmailsInterface;

/**
 * Defines the web newsletter emails entity class.
 *
 * @ContentEntityType(
 *   id = "webnewsletter_emails",
 *   label = @Translation("Web Newsletter Emails"),
 *   label_collection = @Translation("Web Newsletter Emailss"),
 *   label_singular = @Translation("web newsletter emails"),
 *   label_plural = @Translation("web newsletter emailss"),
 *   label_count = @PluralTranslation(
 *     singular = "@count web newsletter emailss",
 *     plural = "@count web newsletter emailss",
 *   ),
 *   handlers = {
 *     "list_builder" = "Drupal\webnewsletter\WebnewsletterEmailsListBuilder",
 *     "views_data" = "Drupal\views\EntityViewsData",
 *     "access" = "Drupal\webnewsletter\WebnewsletterEmailsAccessControlHandler",
 *     "form" = {
 *       "add" = "Drupal\webnewsletter\Form\WebnewsletterEmailsForm",
 *       "edit" = "Drupal\webnewsletter\Form\WebnewsletterEmailsForm",
 *       "delete" = "Drupal\Core\Entity\ContentEntityDeleteForm",
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\Core\Entity\Routing\AdminHtmlRouteProvider",
 *     }
 *   },
 *   base_table = "webnewsletter_emails",
 *   revision_table = "webnewsletter_emails_revision",
 *   show_revision_ui = TRUE,
 *   admin_permission = "administer webnewsletter emails",
 *   entity_keys = {
 *     "id" = "id",
 *     "revision" = "revision_id",
 *     "label" = "id",
 *     "uuid" = "uuid",
 *     "owner" = "uid",
 *   },
 *   revision_metadata_keys = {
 *     "revision_user" = "revision_uid",
 *     "revision_created" = "revision_timestamp",
 *     "revision_log_message" = "revision_log",
 *   },
 *   links = {
 *     "collection" = "/admin/config/webnewsletter/emails/",
 *     "add-form" = "/admin/config/webnewsletter/email/add",
 *     "canonical" = "/admin/config/webnewsletter/email/{webnewsletter_emails}",
 *     "edit-form" = "/admin/config/webnewsletter/email/{webnewsletter_emails}/edit",
 *     "delete-form" = "/admin/config/webnewsletter/email/{webnewsletter_emails}/delete",
 *   },
 *   field_ui_base_route = "entity.webnewsletter_emails.settings",
 * )
 */
class WebnewsletterEmails extends RevisionableContentEntityBase implements WebnewsletterEmailsInterface {

  use EntityChangedTrait;
  use EntityOwnerTrait;

  /**
   * {@inheritdoc}
   */
  public function preSave(EntityStorageInterface $storage) {
    parent::preSave($storage);
    if (!$this->getOwnerId()) {
      // If no owner has been set explicitly, make the anonymous user the owner.
      $this->setOwnerId(0);
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {

    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['uid'] = BaseFieldDefinition::create('entity_reference')
      ->setRevisionable(TRUE)
      ->setLabel(t('Author'))
      ->setSetting('target_type', 'user')
      ->setDefaultValueCallback(static::class . '::getDefaultEntityOwner')
      ->setDisplayOptions('form', [
        'type' => 'entity_reference_autocomplete',
        'settings' => [
          'match_operator' => 'CONTAINS',
          'size' => 60,
          'placeholder' => '',
        ],
        'weight' => 15,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'author',
        'weight' => 15,
      ])
      ->setDisplayConfigurable('view', TRUE);

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Authored on'))
      ->setDescription(t('The time that the web newsletter emails was created.'))
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'timestamp',
        'weight' => 20,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayOptions('form', [
        'type' => 'datetime_timestamp',
        'weight' => 20,
      ])
      ->setDisplayConfigurable('view', TRUE);

    $fields['changed'] = BaseFieldDefinition::create('changed')
      ->setLabel(t('Changed'))
      ->setDescription(t('The time that the web newsletter emails was last edited.'));

    return $fields;
  }

}

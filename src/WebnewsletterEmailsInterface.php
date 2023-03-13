<?php

namespace Drupal\webnewsletter;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface defining a web newsletter emails entity type.
 */
interface WebnewsletterEmailsInterface extends ContentEntityInterface, EntityOwnerInterface, EntityChangedInterface {

}

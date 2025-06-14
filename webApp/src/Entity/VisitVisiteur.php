<?php

namespace App\Entity;

use App\Repository\VisitVisiteurRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VisitVisiteurRepository::class)]
class VisitVisiteur
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $present = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $commentaire = null;

    #[ORM\ManyToOne(inversedBy: 'visitVisiteurs')]
    private ?visite $visite = null;

    #[ORM\ManyToOne(inversedBy: 'visitVisiteurs')]
    private ?visiteur $visiteur = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isPresent(): ?bool
    {
        return $this->present;
    }

    public function setPresent(bool $present): static
    {
        $this->present = $present;

        return $this;
    }

    public function getCommentaire(): ?string
    {
        return $this->commentaire;
    }

    public function setCommentaire(?string $commentaire): static
    {
        $this->commentaire = $commentaire;

        return $this;
    }

    public function getVisite(): ?visite
    {
        return $this->visite;
    }

    public function setVisite(?visite $visite): static
    {
        $this->visite = $visite;

        return $this;
    }

    public function getVisiteur(): ?visiteur
    {
        return $this->visiteur;
    }

    public function setVisiteur(?visiteur $visiteur): static
    {
        $this->visiteur = $visiteur;

        return $this;
    }
}

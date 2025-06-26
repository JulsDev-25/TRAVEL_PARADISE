<?php

namespace App\Entity;

use App\Repository\VisitVisiteurRepository;
use App\Entity\Visite;
use App\Entity\Visiteur;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: VisitVisiteurRepository::class)]
class VisitVisiteur
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    // Groupes pour l'ID : utilisé dans plusieurs contextes
    #[Groups(['visite:item', 'visite:detail', 'visiteur:item', 'visiteur:detail', 'visit:update'])]
    private ?int $id = null;

    #[ORM\Column]
    // Groupes pour 'present' : utilisé pour les mises à jour et pour voir le statut dans une visite ou un visiteur
    #[Groups(['visite:item', 'visite:detail', 'visiteur:item', 'visiteur:detail', 'visit:update'])]
    private ?bool $present = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    // Groupes pour 'commentaire' : utilisé pour les mises à jour et pour voir le commentaire dans une visite ou un visiteur
    #[Groups(['visite:item', 'visite:detail', 'visiteur:item', 'visiteur:detail', 'visit:update'])]
    private ?string $commentaire = null;

    #[ORM\ManyToOne(inversedBy: 'visitVisiteurs')]
    // Groupe pour la relation Visite : quand on voit un VisitVisiteur, on veut voir les infos de base de la visite
    #[Groups(['visiteur:detail', 'visit:update'])] // On ne veut pas la visite complète dans 'visite:item' pour éviter la récursion
    private ?Visite $visite = null;

    #[ORM\ManyToOne(inversedBy: 'visitVisiteurs')]
    // Groupe pour la relation Visiteur : quand on voit un VisitVisiteur, on veut voir les infos de base du visiteur
    #[Groups(['visite:item', 'visit:update'])] // On ne veut pas le visiteur complet dans 'visiteur:detail' pour éviter la récursion
    private ?Visiteur $visiteur = null;

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

    public function getVisite(): ?Visite
    {
        return $this->visite;
    }

    public function setVisite(?Visite $visite): static
    {
        $this->visite = $visite;

        return $this;
    }

    public function getVisiteur(): ?Visiteur
    {
        return $this->visiteur;
    }

    public function setVisiteur(?Visiteur $visiteur): static
    {
        $this->visiteur = $visiteur;

        return $this;
    }
}
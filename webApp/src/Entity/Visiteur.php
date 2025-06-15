<?php

namespace App\Entity;

use App\Entity\VisitVisiteur;
use App\Repository\VisiteurRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VisiteurRepository::class)]
class Visiteur
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $prenom = null;

    /**
     * @var Collection<int, VisitVisiteur>
     */
    #[ORM\OneToMany(targetEntity: VisitVisiteur::class, mappedBy: 'visiteur')]
    private Collection $visitVisiteurs;

    public function __construct()
    {
        $this->visitVisiteurs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }

    /**
     * @return Collection<int, VisitVisiteur>
     */
    public function getVisitVisiteurs(): Collection
    {
        return $this->visitVisiteurs;
    }

    public function addVisitVisiteur(VisitVisiteur $visitVisiteur): static
    {
        if (!$this->visitVisiteurs->contains($visitVisiteur)) {
            $this->visitVisiteurs->add($visitVisiteur);
            $visitVisiteur->setVisiteur($this);
        }

        return $this;
    }

    public function removeVisitVisiteur(VisitVisiteur $visitVisiteur): static
    {
        if ($this->visitVisiteurs->removeElement($visitVisiteur)) {
            if ($visitVisiteur->getVisiteur() === $this) {
                $visitVisiteur->setVisiteur(null);
            }
        }

        return $this;
    }
}

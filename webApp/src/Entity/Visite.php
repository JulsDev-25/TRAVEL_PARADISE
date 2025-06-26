<?php

namespace App\Entity;

// Correction du namespace du repository
use App\Repository\VisiteRepository;
use App\Entity\Guide;
use App\Entity\VisitVisiteur;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: VisiteRepository::class)]
class Visite
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    // Ajout de 'visite:item' pour le détail
    #[Groups(['visite:read', 'visite:item'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    // Ajout de 'visite:item' pour le détail
    #[Groups(['visite:read', 'visite:item'])]
    private ?string $photo = null;

    #[ORM\Column(length: 255)]
    // Ajout de 'visite:item' pour le détail
    #[Groups(['visite:read', 'visite:item'])]
    private ?string $pays = null;

    #[ORM\Column(length: 255)]
    // Ajout de 'visite:item' pour le détail
    #[Groups(['visite:read', 'visite:item'])]
    private ?string $lieu = null;

    // Correction du type de date
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    // Ajout de 'visite:item' pour le détail
    #[Groups(['visite:read', 'visite:item'])]
    private ?\DateTimeInterface $date = null; // Utilisation de DateTimeInterface

    // Correction du type d'heure
    #[ORM\Column(type: Types::TIME_MUTABLE)]
    // Ajout de 'visite:item' pour le détail
    #[Groups(['visite:read', 'visite:item'])]
    private ?\DateTimeInterface $heureDebut = null; // Utilisation de DateTimeInterface

    #[ORM\Column]
    // Ajout de 'visite:item' pour le détail
    #[Groups(['visite:read', 'visite:item'])]
    private ?int $duree = null;

    // Correction du type d'heure
    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Groups(['visite:read', 'visite:item'])]
    private ?\DateTimeInterface $heureFin = null; // Utilisation de DateTimeInterface

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['visite:read', 'visite:item'])]
    private ?string $commentaire = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['visite:read', 'visite:item', 'visit:update'])]
    private ?string $commentaireFin = null;

    #[ORM\ManyToOne(inversedBy: 'visites')]
    #[ORM\JoinColumn(nullable: false)]
    // Ajout de 'visite:item' pour le détail
    #[Groups(['visite:read', 'visite:item'])]
    private ?Guide $guide = null;

    /**
     * @var Collection<int, VisitVisiteur>
     */
    #[ORM\OneToMany(targetEntity: VisitVisiteur::class, mappedBy: 'visite', cascade: ['persist', 'remove'])] // Ajout de cascade pour la gestion des relations
    // Ajout de 'visite:detail' pour gérer la récursion
    #[Groups(['visite:item', 'visite:detail'])]
    private Collection $visitVisiteurs;

    public function __construct()
    {
        $this->visitVisiteurs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(string $photo): static
    {
        $this->photo = $photo;

        return $this;
    }

    public function getPays(): ?string
    {
        return $this->pays;
    }

    public function setPays(string $pays): static
    {
        $this->pays = $pays;

        return $this;
    }

    public function getLieu(): ?string
    {
        return $this->lieu;
    }

    public function setLieu(string $lieu): static
    {
        $this->lieu = $lieu;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface // Utilisation de DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static // Utilisation de DateTimeInterface
    {
        $this->date = $date;

        return $this;
    }

    public function getHeureDebut(): ?\DateTimeInterface // Utilisation de DateTimeInterface
    {
        return $this->heureDebut;
    }

    public function setHeureDebut(\DateTimeInterface $heureDebut): static // Utilisation de DateTimeInterface
    {
        $this->heureDebut = $heureDebut;

        return $this;
    }

    public function getDuree(): ?int
    {
        return $this->duree;
    }

    public function setDuree(int $duree): static
    {
        $this->duree = $duree;

        return $this;
    }

    public function getHeureFin(): ?\DateTimeInterface // Utilisation de DateTimeInterface
    {
        return $this->heureFin;
    }

    public function setHeureFin(\DateTimeInterface $heureFin): static // Utilisation de DateTimeInterface
    {
        $this->heureFin = $heureFin;

        return $this;
    }

    public function getCommentaire(): ?string
    {
        return $this->commentaire;
    }

    public function setCommentaire(string $commentaire): static
    {
        $this->commentaire = $commentaire;

        return $this;
    }

    public function getCommentaireFin(): ?string
    {
        return $this->commentaireFin;
    }

    public function setCommentaireFin(?string $commentaireFin): self
    {
        $this->commentaireFin = $commentaireFin;

        return $this;
    }

    public function getGuide(): ?Guide
    {
        return $this->guide;
    }

    public function setGuide(?Guide $guide): static
    {
        $this->guide = $guide;

        return $this;
    }

    /**
     * @return Collection<int, VisitVisiteur>
     */
    // Le groupe 'visite:item' est bien là. Nous avons ajouté 'visite:detail' pour la récursion.
    #[Groups(['visite:item', 'visite:detail'])]
    public function getVisitVisiteurs(): Collection
    {
        return $this->visitVisiteurs;
    }

    public function addVisitVisiteur(VisitVisiteur $visitVisiteur): static
    {
        if (!$this->visitVisiteurs->contains($visitVisiteur)) {
            $this->visitVisiteurs->add($visitVisiteur);
            $visitVisiteur->setVisite($this);
        }

        return $this;
    }

    public function removeVisitVisiteur(VisitVisiteur $visitVisiteur): static
    {
        if ($this->visitVisiteurs->removeElement($visitVisiteur)) {
            // set the owning side to null (unless already changed)
            if ($visitVisiteur->getVisite() === $this) {
                $visitVisiteur->setVisite(null);
            }
        }

        return $this;
    }

    // Suppression de la propriété et des méthodes pour $visiteursSelectionnes
    private ?array $visiteursSelectionnes = [];

    public function getVisiteursSelectionnes(): ?array
    {
        return $this->visiteursSelectionnes;
    }

    public function setVisiteursSelectionnes(?array $visiteursSelectionnes): void
    {
        $this->visiteursSelectionnes = $visiteursSelectionnes;
    }
}
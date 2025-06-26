<?php

namespace App\Controller;

use App\Entity\Visite;
use App\Entity\VisitVisiteur;
use App\Entity\Visiteur;
use App\Form\AjoutVisiteurType;
use App\Form\VisiteForm;
use App\Repository\VisiteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
#[Route('/visite')]
final class VisiteController extends AbstractController
{
  #[Route(name: 'app_visite_index', methods: ['GET'])]
  public function index(VisiteRepository $visiteRepository): Response
  {
    return $this->render('visite/index.html.twig', [
      'visites' => $visiteRepository->findAll(),
    ]);
  }

  #[Route('/new', name: 'app_visite_new', methods: ['GET', 'POST'])]
  public function new(Request $request, EntityManagerInterface $entityManager): Response
  {
    $visite = new Visite();
    $form = $this->createForm(VisiteForm::class, $visite);
    $form->handleRequest($request);

    $nouveauVisiteur = new Visiteur();
    $formVisiteur = $this->createForm(AjoutVisiteurType::class, $nouveauVisiteur);
    $formVisiteur->handleRequest($request);

    if ($formVisiteur->isSubmitted() && $formVisiteur->isValid()) {
      $entityManager->persist($nouveauVisiteur);
      $entityManager->flush();

      $this->addFlash('success', 'Visiteur ajouté avec succès ✅');
      return $this->redirectToRoute('app_visite_new');
    }

    if ($form->isSubmitted()) {
      if ($form->isValid()) {
        $entityManager->persist($visite);
        $entityManager->flush();

        $visiteurs = $form->get('visiteursSelectionnes')->getData();
        foreach ($visiteurs as $visiteur) {
          $vv = new VisitVisiteur();
          $vv->setVisite($visite);
          $vv->setVisiteur($visiteur);
          $vv->setPresent(false);
          $vv->setCommentaire(null);
          $entityManager->persist($vv);
        }

        $entityManager->flush();

        $this->addFlash('success', 'Visite créée avec succès ✅');
        return $this->redirectToRoute('app_visite_index');
      } else {
        $this->addFlash('error', 'Le formulaire contient des erreurs ❌');
      }
    }

    return $this->render('visite/new.html.twig', [
      'visite' => $visite,
      'form' => $form,
      'formVisiteur' => $formVisiteur->createView(),
    ]);
  }

  #[Route('/{id}', name: 'app_visite_show', methods: ['GET'])]
  public function show(Visite $visite, EntityManagerInterface $entityManager): Response
  {
    // Récupération des visiteur pour cette vite dans la table VisitVisiteur
    $visiteursVisite = $entityManager->getRepository(VisitVisiteur::class)
      ->findBy(['visite' => $visite]);

    $visiteursPreselectionnes = array_map(fn($r) => $r->getVisiteur(), $visiteursVisite);
    $visite->setVisiteursSelectionnes($visiteursPreselectionnes);
    
    return $this->render('visite/show.html.twig', [
      'visite' => $visite,
    ]);
  }

  #[Route('/{id}/edit', name: 'app_visite_edit', methods: ['GET', 'POST'])]
  public function edit(Request $request, Visite $visite, EntityManagerInterface $entityManager): Response
  {
    // Récupération des visiteur pour cette vite dans la table VisitVisiteur
    $visiteursVisite = $entityManager->getRepository(VisitVisiteur::class)
      ->findBy(['visite' => $visite]);

    $visiteursPreselectionnes = array_map(fn($r) => $r->getVisiteur(), $visiteursVisite);
    $visite->setVisiteursSelectionnes($visiteursPreselectionnes);

    $form = $this->createForm(VisiteForm::class, $visite);
    $form->handleRequest($request);

    $nouveauVisiteur = new Visiteur();
    $formVisiteur = $this->createForm(AjoutVisiteurType::class, $nouveauVisiteur);
    $formVisiteur->handleRequest($request);

    if ($formVisiteur->isSubmitted() && $formVisiteur->isValid()) {
      $entityManager->persist($nouveauVisiteur);
      $entityManager->flush();

      $this->addFlash('success', 'Visiteur ajouté avec succès ✅');
      return $this->redirectToRoute('app_visite_edit', ['id' => $visite->getId()]);
    }

    if ($form->isSubmitted()) {
      if ($form->isValid()) {
        foreach ($visiteursVisite as $r) {
          $entityManager->remove($r);
        }

        $nouveauxVisiteurs = $form->get('visiteursSelectionnes')->getData();
        foreach ($nouveauxVisiteurs as $visiteur) {
          $vv = new VisitVisiteur();
          $vv->setVisite($visite);
          $vv->setVisiteur($visiteur);
          $vv->setPresent(false);
          $vv->setCommentaire(null);
          $entityManager->persist($vv);
        }

        $entityManager->flush();

        $this->addFlash('success', 'Visite modifiée avec succès ✅');
        return $this->redirectToRoute('app_visite_index');
      } else {
        $this->addFlash('error', 'Le formulaire contient des erreurs ❌');
      }
    }

    return $this->render('visite/edit.html.twig', [
      'visite' => $visite,
      'form' => $form,
      'formVisiteur' => $formVisiteur->createView(),
    ]);
  }

  #[Route('/{id}', name: 'app_visite_delete', methods: ['POST'])]
  public function delete(Request $request, Visite $visite, EntityManagerInterface $entityManager): Response
  {
    if ($this->isCsrfTokenValid('delete' . $visite->getId(), $request->getPayload()->getString('_token'))) {
      $entityManager->remove($visite);
      $entityManager->flush();
    }

    $this->addFlash('success', 'Visite supprimée ✅');
    return $this->redirectToRoute('app_visite_index');
  }
}

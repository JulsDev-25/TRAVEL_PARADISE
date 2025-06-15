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

/**
 * VisiteController handles the CRUD operations for the Visite entity.
 */
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

        // Formulaire secondaire : ajout visiteur
        $nouveauVisiteur = new Visiteur();
        $formVisiteur = $this->createForm(AjoutVisiteurType::class, $nouveauVisiteur);
        $formVisiteur->handleRequest($request);

        // Soumission du petit formulaire
        if ($formVisiteur->isSubmitted() && $formVisiteur->isValid()) {
            $entityManager->persist($nouveauVisiteur);
            $entityManager->flush();

            // Redirige vers la même page pour réinitialiser les formulaires
            return $this->redirectToRoute('app_visite_new');
        }

        // Soumission du formulaire de visite
        if ($form->isSubmitted() && $form->isValid()) {
            // Sauvegarder la Visite
            $entityManager->persist($visite);
            $entityManager->flush();

            // Récupérer les visiteurs sélectionnés
            $visiteurs = $form->get('visiteursSelectionnes')->getData();

            foreach ($visiteurs as $visiteur) {
                $visitVisiteur = new VisitVisiteur();
                $visitVisiteur->setVisite($visite);
                $visitVisiteur->setVisiteur($visiteur);
                $visitVisiteur->setPresent(false);
                $visitVisiteur->setCommentaire(null);

                $entityManager->persist($visitVisiteur);
            }

            $entityManager->flush();

            return $this->redirectToRoute('app_visite_index');
        }

        return $this->render('visite/new.html.twig', [
            'visite' => $visite,
            'form' => $form,
            'formVisiteur' => $formVisiteur->createView(),
        ]);
    }


    #[Route('/{id}', name: 'app_visite_show', methods: ['GET'])]
    public function show(Visite $visite): Response
    {
        return $this->render('visite/show.html.twig', [
            'visite' => $visite,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_visite_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Visite $visite, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(VisiteForm::class, $visite);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_visite_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('visite/edit.html.twig', [
            'visite' => $visite,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_visite_delete', methods: ['POST'])]
    public function delete(Request $request, Visite $visite, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete' . $visite->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($visite);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_visite_index', [], Response::HTTP_SEE_OTHER);
    }
}

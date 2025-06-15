<?php

namespace App\Controller;

use App\Entity\VisitVisiteur;
use App\Form\VisitVisiteurForm;
use App\Repository\VisitVisiteurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * VisitVisiteurController handles the CRUD operations for the VisitVisiteur entity.
 */
#[IsGranted('ROLE_USER')]
#[Route('/visit/visiteur')]
final class VisitVisiteurController extends AbstractController
{
    #[Route(name: 'app_visit_visiteur_index', methods: ['GET'])]
    public function index(VisitVisiteurRepository $visitVisiteurRepository): Response
    {
        return $this->render('visit_visiteur/index.html.twig', [
            'visit_visiteurs' => $visitVisiteurRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_visit_visiteur_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $visitVisiteur = new VisitVisiteur();
        $form = $this->createForm(VisitVisiteurForm::class, $visitVisiteur);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($visitVisiteur);
            $entityManager->flush();

            return $this->redirectToRoute('app_visit_visiteur_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('visit_visiteur/new.html.twig', [
            'visit_visiteur' => $visitVisiteur,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_visit_visiteur_show', methods: ['GET'])]
    public function show(VisitVisiteur $visitVisiteur): Response
    {
        return $this->render('visit_visiteur/show.html.twig', [
            'visit_visiteur' => $visitVisiteur,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_visit_visiteur_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, VisitVisiteur $visitVisiteur, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(VisitVisiteurForm::class, $visitVisiteur);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_visit_visiteur_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('visit_visiteur/edit.html.twig', [
            'visit_visiteur' => $visitVisiteur,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_visit_visiteur_delete', methods: ['POST'])]
    public function delete(Request $request, VisitVisiteur $visitVisiteur, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$visitVisiteur->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($visitVisiteur);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_visit_visiteur_index', [], Response::HTTP_SEE_OTHER);
    }
}

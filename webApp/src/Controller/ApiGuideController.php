<?php

namespace App\Controller;

use App\Repository\VisiteRepository;
use App\Repository\VisitVisiteurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class ApiGuideController extends AbstractController
{
    #[Route('/visites', name: 'api_guide_visites', methods: ['GET'])]
    public function visites(VisiteRepository $visiteRepo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user || !$user->getGuide()) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $visites = $visiteRepo->findBy(['guide' => $user->getGuide()]);

        return $this->json($visites, 200, [], ['groups' => 'visite:read']);
    }

    #[Route('/visites/{id}', name: 'api_guide_visite_detail', methods: ['GET'])]
    public function visiteDetail(int $id, VisiteRepository $visiteRepo): JsonResponse
    {
        $user = $this->getUser();
        if (!$user || !$user->getGuide()) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $visite = $visiteRepo->find($id);
        if (!$visite || $visite->getGuide() !== $user->getGuide()) {
            return $this->json(['error' => 'Not found or not allowed'], 403);
        }

        return $this->json($visite, 200, [], ['groups' => 'visite:item']);
    }

    #[Route('/visites/{id}/commentaire-fin', name: 'api_guide_visite_commentaire_fin', methods: ['PUT'])]
    public function updateCommentaire(int $id, Request $request, VisiteRepository $visiteRepo, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user || !$user->getGuide()) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $visite = $visiteRepo->find($id);
        if (!$visite || $visite->getGuide() !== $user->getGuide()) {
            return $this->json(['error' => 'Not found or not allowed'], 403);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['commentaireFin'])) {
            return $this->json(['error' => 'Missing commentaireFin'], 400);
        }

        if (!is_string($data['commentaireFin']) || trim($data['commentaireFin']) === '') {
            return $this->json(['error' => 'CommentaireFin invalide'], 400);
        }

        $visite->setCommentaireFin($data['commentaireFin']);
        $em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Commentaire de fin mis à jour.',
            'visiteId' => $visite->getId(),
        ]);
    }

    #[Route('/visites/presences', name: 'api_visite_enregistrer_presences', methods: ['POST'])]
    public function enregistrerPresences(
        Request $request,
        VisiteRepository $visiteRepo,
        VisitVisiteurRepository $visitVisiteurRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        $user = $this->getUser();

        if (!$user || !$user->getGuide()) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['presences']) || !is_array($data['presences'])) {
            return $this->json(['error' => 'Liste des présences manquante ou invalide'], 400);
        }

        foreach ($data['presences'] as $presence) {
            if (!isset($presence['visitVisiteurId'])) {
                continue;
            }

            $visitVisiteur = $visitVisiteurRepo->find($presence['visitVisiteurId']);

            if (!$visitVisiteur) {
                continue;
            }

            $visite = $visitVisiteur->getVisite();
            if (!$visite || $visite->getGuide() !== $user->getGuide()) {
                return $this->json(['error' => "Accès interdit pour la présence de l'ID {$presence['visitVisiteurId']}"], 403);
            }

            if (isset($presence['present'])) {
                $visitVisiteur->setPresent((bool) $presence['present']);
            }

            if (isset($presence['commentaire'])) {
                $visitVisiteur->setCommentaire($presence['commentaire']);
            }
        }

        $em->flush();

        return $this->json(['success' => true, 'message' => 'Présences mises à jour ✅']);
    }
}
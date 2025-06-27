<?php

namespace App\Controller;

use App\Repository\GuideRepository;
use App\Repository\VisiteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * DashboardController handles the dashboard view for authenticated users.
 */
#[IsGranted('ROLE_USER')]
class DashboardController extends AbstractController
{
   #[Route('/dashboard', name: 'app_dashboard')]
public function index(
    GuideRepository $guideRepo,
    VisiteRepository $visiteRepo
): Response {
    $totalGuides = $guideRepo->count([]);
    $totalVisites = $visiteRepo->count([]);
    $tauxPresence = 83; // À calculer dynamiquement plus tard

    // 👉 Visites par guide (pour le graphique)
    $visitesParGuide = $guideRepo->createQueryBuilder('g')
        ->leftJoin('g.visites', 'v')
        ->select('g.prenom', 'g.nom', 'COUNT(v.id) as nbVisites')
        ->groupBy('g.id')
        ->getQuery()
        ->getResult();

    // Exemple de format attendu en JS
    $graphData = [];
    foreach ($visitesParGuide as $row) {
        $graphData[] = [
            'guide' => $row['prenom'] . ' ' . $row['nom'],
            'nb' => (int) $row['nbVisites'],
        ];
    }

    return $this->render('dashboard.html.twig', [
        'totalGuides' => $totalGuides,
        'totalVisites' => $totalVisites,
        'tauxPresence' => $tauxPresence,
        'graphData' => $graphData, // pour JS
    ]);
}
}

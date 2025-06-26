<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ApiGuideController extends AbstractController
{
    #[Route('/api/guide', name: 'app_api_guide')]
    public function index(): Response
    {
        return $this->render('api_guide/index.html.twig', [
            'controller_name' => 'ApiGuideController',
        ]);
    }
}

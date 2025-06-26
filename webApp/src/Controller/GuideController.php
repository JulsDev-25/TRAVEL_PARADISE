<?php

namespace App\Controller;

use App\Entity\Guide;
use App\Entity\User;
use App\Form\GuideForm;
use App\Repository\GuideRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
#[Route('/guide')]
final class GuideController extends AbstractController
{
    #[Route(name: 'app_guide_index', methods: ['GET'])]
    public function index(GuideRepository $guideRepository): Response
    {
        return $this->render('guide/index.html.twig', [
            'guides' => $guideRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_guide_new', methods: ['GET', 'POST'])]
    public function new(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): Response {
        $guide = new Guide();
        $form = $this->createForm(GuideForm::class, $guide);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Création du compte user lié au guide
            $user = new User();
            $nom = $guide->getNom();
            $prenom = $guide->getPrenom();
            $email = strtolower($guide->getPrenom() . '.' . $guide->getNom()) . '@travel-paradise.com';
            $user->setEmail($email);
            $user->setRoles(['ROLE_GUIDE']);
            $user->setPassword($passwordHasher->hashPassword($user, 'guide123'));
            $user->setNom($nom);
            $user->setPrenom($prenom);
            $user->setGuide($guide);

            $entityManager->persist($guide);
            $entityManager->persist($user);
            $entityManager->flush();

            $this->addFlash('success', "Guide créé avec son compte utilisateur ✅ (Email : $email / Mot de passe : guide123)");

            return $this->redirectToRoute('app_guide_index');
        }

        return $this->render('guide/new.html.twig', [
            'guide' => $guide,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_guide_show', methods: ['GET'])]
    public function show(Guide $guide): Response
    {
        return $this->render('guide/show.html.twig', [
            'guide' => $guide,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_guide_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Guide $guide, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(GuideForm::class, $guide);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            $this->addFlash('success', 'Guide mis à jour ✅');

            return $this->redirectToRoute('app_guide_index');
        }

        return $this->render('guide/edit.html.twig', [
            'guide' => $guide,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_guide_delete', methods: ['POST'])]
    public function delete(Request $request, Guide $guide, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete' . $guide->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($guide);
            $entityManager->flush();
        }

        $this->addFlash('success', 'Guide supprimé ❌');

        return $this->redirectToRoute('app_guide_index');
    }
}

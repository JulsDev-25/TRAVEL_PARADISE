<?php

namespace App\Form;

use App\Entity\visite;
use App\Entity\visiteur;
use App\Entity\VisitVisiteur;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class VisitVisiteurForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('present')
            ->add('commentaire')
            ->add('visite', EntityType::class, [
                'class' => visite::class,
                'choice_label' => 'id',
            ])
            ->add('visiteur', EntityType::class, [
                'class' => visiteur::class,
                'choice_label' => 'id',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => VisitVisiteur::class,
        ]);
    }
}

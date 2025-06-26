<?php

namespace App\Form;

use App\Entity\Guide;
use App\Entity\Visite;
use App\Entity\Visiteur;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class VisiteForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        /** @var Visite $visite */
        $visite = $options['data'];

        $builder
            ->add('photo')
            ->add('pays')
            ->add('lieu')
            ->add('date')
            ->add('heureDebut', TimeType::class, [
                'input' => 'datetime',
                'widget' => 'single_text',
            ])
            ->add('duree', null, [
                'attr' => ['step' => '1'],
            ])
            ->add('heureFin', TimeType::class, [
                'input' => 'datetime',
                'widget' => 'single_text',
                'attr' => ['readonly' => true],
            ])
            ->add('commentaire')
            ->add('guide', EntityType::class, [
                'class' => Guide::class,
                'choice_label' => function (Guide $guide) {
                    return sprintf('%d - %s %s', $guide->getId(), $guide->getNom(), $guide->getPrenom());
                },
            ])
            ->add('visiteursSelectionnes', EntityType::class, [
                'class' => Visiteur::class,
                'choice_label' => fn(Visiteur $v) => $v->getPrenom() . ' ' . $v->getNom(),
                'multiple' => true,
                'expanded' => true,
                'mapped' => false,
                'required' => false,
                'label' => 'Visiteurs participant à la visite',
                'data' => $visite->getVisiteursSelectionnes(),
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Visite::class,
        ]);
    }
}

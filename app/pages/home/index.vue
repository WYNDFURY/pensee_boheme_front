<template>
  <div class="text-neutral-800 font-[Josefin_Slab]">
    <!-- First section - Hero -->
    <section class="">
      <div class="mx-auto">
        <div class="flex flex-col md:flex-row items-center">
          <h1
            class="text-3xl text-center md:text-5xl font-extrabold leading-tight mx-16 my-20 bg-gradient-to-tl from-[#A37847] to-[#3A3025] text-transparent bg-clip-text"
          >
            Chaque création, est une ode à la beauté de la nature et à l'imagination
          </h1>
          <div class="">
            <NuxtImg
              src="/home/landpage_1.jpg"
              alt="Pensée Bohème création florale"
              class="rounded-b-4xl opacity-70"
              fit="cover"
              format="webp"
              quality="90"
              loading="lazy"
              width="700"
              height="700"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Second section - About -->
    <section class="">
      <div class="mx-auto">
        <div class="flex flex-col md:flex-row-reverse items-center">
          <div class="">
            <h2 class="text-3xl mb-6 text-center text-accent-500 my-10">
              Je suis Cécile, <br />
              créatrice de Pensée Bohème fleuriste passionnée et engagée
            </h2>
            <div class="">
              <NuxtImg
                src="/home/landpage_2.jpg"
                alt="Cécile - Pensée Bohème"
                format="webp"
                quality="90"
                loading="lazy"
              />
            </div>
            <p class="text-lg font-light leading-relaxed mb-4">
              Passionnée de nature et soucieuse de l'environnement qui m'entoure, je fais le choix
              de me tourner vers des valeurs qui me ressemblent. C'est pourquoi je travaille sur
              commande dans une démarche
              <NuxtLink to="/engagement" class="font-semibold text-accent-500"
                >éco-responsable</NuxtLink
              >.
            </p>
            <p class="text-lg font-light leading-relaxed mb-4">
              Je vous accueille sur
              <NuxtLink to="/contact" class="font-semibold text-accent-500">rendez-vous</NuxtLink>
              dans mon atelier à Beuzeville-la-Grenier; petit village Normand situé entre Le Havre
              et Rouen.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Third section - Philosophy -->
    <section class="py-20">
      <div class="mx-auto">
        <div class="flex flex-col text-center">
          <div class="w-full mt-8">
            <NuxtImg
              src="/home/landpage_3.jpg"
              alt="Créations Pensée Bohème"
              format="webp"
              quality="90"
              loading="lazy"
            />
          </div>

          <div class="py-8 bg-primary_pink">
            <h2 class="text-3xl mb-6 text-center text-accent-500">
              Derrière le nom Pensée Bohème se cache l'essence même de mon travail.
            </h2>
            <p class="text-lg font-light leading-relaxed mb-4">
              Enfant j'ai été émerveillée par la beauté de la Pensée; cette fleur qui symbolise la
              douceur et la créativité; c'est une des premières fleurs dont j'ai le souvenir de
              découvrir dans le jardin de mes parents.
            </p>
            <p class="text-lg font-light leading-relaxed mb-4">
              L'esprit Bohème quant à lui évoque pour moi une esthétique sauvage et poétique. C'est
              cette fusion entre la beauté naturelle de la Pensée et l'audace de la vie Bohème qui
              guide ma créativité !
            </p>
            <div class="h-px bg-neutral-200 my-8 w-full">-</div>
            <p class="text-xl font-light italic text-neutral-600">
              Bienvenue dans cet espace où chaque projet, chaque création, est une ode à la beauté
              de la nature et à l'imagination.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup></script>

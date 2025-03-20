<template>
  <div class="flex flex-col gap-20 font-[Josefin_Slab] text-neutral-800">
    <!-- First section - Hero -->
    <section class="h-[calc(100vh-80px)]">
      <div class="flex h-full flex-col items-center md:flex-row-reverse">
        <h1
          class="flex flex-1 items-center justify-center bg-gradient-to-tl from-[#A37847] to-[#3A3025] bg-clip-text text-center font-extrabold leading-tight text-transparent md:text-left md:my-auto md:w-1/2 md:text-5xl px-10 md:px-20 xl:px-32 text-[4vh] md:text-[8vh] 2xl:text-[10vh]"
        >
          Chaque création, <br />
          est une ode à la beauté de la nature et à l'imagination
        </h1>
        <figure class="relative h-1/2 w-full md:h-full md:w-1/2">
          <NuxtImg
            src="/home/landpage_1_test.jpg"
            alt="Pensée Bohème création florale"
            class="h-full w-full rounded-b-4xl md:h-full md:rounded-none object-cover opacity-80"
            format="webp"
            quality="90"
            loading="lazy"
          />
          <figcaption
            class="absolute bottom-2 right-2 bg-black/30 px-2 py-1 text-xs text-white rounded backdrop-blur-sm"
          >
            © Studio Larose
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Second section - About -->
    <section>
      <div class="flex flex-col items-center px-10 gap-10 md:flex-row-reverse">
        <h2 class="text-center text-3xl leading-normal text-accent-500 md:hidden">
          Je suis Cécile, <br />
          créatrice de Pensée Bohème fleuriste passionnée et engagée
        </h2>
        <div class="">
          <NuxtImg
            src="/home/landpage_2.jpg"
            alt="Cécile - Pensée Bohème"
            class="mx-auto w-2/3 md:w-full"
            format="webp"
            quality="90"
            loading="lazy"
          />
        </div>
        <div class="text-center text-xl font-light leading-relaxed">
          <h2 class="hidden md:block my-10 text-center text-3xl leading-normal text-accent-500">
            Je suis Cécile, <br />
            créatrice de Pensée Bohème fleuriste passionnée et engagée
          </h2>
          <p class="my-5">
            Passionnée de nature et soucieuse de l'environnement qui m'entoure, je fais le choix de
            me tourner vers des valeurs qui me ressemblent. C'est pourquoi je travaille sur commande
            dans une démarche
            <NuxtLink
              to="/engagement"
              class="relative border-b border-dotted border-accent-500 font-semibold text-accent-500 group md:border-none"
            >
              éco-responsable.
              <span
                class="absolute bottom-0 left-0 hidden h-px w-0 bg-accent-500 transition-all duration-300 md:block md:group-hover:w-full"
              ></span>
            </NuxtLink>
          </p>
          <p>
            Je vous accueille sur
            <NuxtLink
              to="/contact"
              class="relative border-b border-dotted border-accent-500 font-semibold text-accent-500 group md:border-none"
              >rendez-vous<span
                class="absolute bottom-0 left-0 hidden h-px w-0 bg-accent-500 transition-all duration-300 md:block md:group-hover:w-full"
              ></span>
            </NuxtLink>
            dans mon atelier à Beuzeville-la-Grenier; petit village Normand situé entre Le Havre et
            Rouen.
          </p>
        </div>
      </div>
    </section>

    <!-- Third section - Philosophy -->
    <section>
      <div class="flex flex-col mx-auto text-center md:flex-col-reverse md:gap-10 mb-30">
        <div class="relative">
          <figure class="relative md:hidden">
            <NuxtImg
              src="/home/landpage_3_mobile.jpg"
              alt="Créations Pensée Bohème"
              class="opacity-80"
              format="webp"
              quality="90"
              loading="lazy"
            />
            <figcaption
              class="absolute bottom-2 right-2 bg-black/30 px-2 py-1 text-xs text-white rounded backdrop-blur-sm"
            >
              © Cupcakes Photographie
            </figcaption>
          </figure>
          <figure class="relative hidden md:block md:w-2/3 md:mx-auto">
            <NuxtImg
              src="/home/landpage_3_desktop.jpg"
              alt="Créations Pensée Bohème"
              class="w-full opacity-80"
              format="webp"
              quality="90"
              loading="lazy"
            />
            <figcaption
              class="absolute bottom-2 right-2 bg-black/30 px-2 py-1 text-xs text-white rounded backdrop-blur-sm"
            >
              © Cupcakes Photographie
            </figcaption>
          </figure>
        </div>

        <div class="bg-primary_pink px-10 py-8">
          <h2 class="mb-6 text-center text-2xl text-accent-500">
            Derrière le nom Pensée Bohème se cache l'essence même de mon travail.
          </h2>
          <p class="mb-4 text-xl font-light leading-relaxed">
            Enfant j'ai été émerveillée par la beauté de la Pensée; cette fleur qui symbolise la
            douceur et la créativité; c'est une des premières fleurs dont j'ai le souvenir de
            découvrir dans le jardin de mes parents.
          </p>
          <p class="text-xl font-light leading-relaxed">
            L'esprit Bohème quant à lui évoque pour moi une esthétique sauvage et poétique. C'est
            cette fusion entre la beauté naturelle de la Pensée et l'audace de la vie Bohème qui
            guide ma créativité !
          </p>
          <div class="mx-auto w-2/3">
            <USeparator
              orientation="horizontal"
              class="h-10"
              :avatar="{ src: '/PB_pensee_logo.svg', size: 'xl' }"
            />
          </div>
          <p class="italic text-xl font-medium leading-relaxed">
            Bienvenue dans cet espace où chaque projet, chaque création, est une ode à la beauté de
            la nature et à l'imagination.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup></script>

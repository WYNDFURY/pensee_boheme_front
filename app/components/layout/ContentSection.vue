<template>
  <component
    :is="tag"
    :class="[colorClass, 'px-10 lg:px-20 py-8 text-pretty']"
  >
    <header v-if="title" class="text-center">
      <component
        :is="titleTag"
        :id="titleId"
        class="font-bold text-2xl text-accent-500"
        :class="{ 'mb-15': !separator }"
        v-bind="titleAttrs"
      >
        {{ title }}
      </component>
      <div
        v-if="separator"
        class="h-px w-24 my-5 mx-auto rounded-full bg-accent-500"
        role="separator"
        aria-hidden="true"
      />
    </header>
    <div class="flex flex-col gap-4 text-xl font-medium leading-relaxed xl:mx-28 2xl:mx-68 max-w-7xl justify-self-center">
      <slot />
    </div>
    <slot name="footer" />
  </component>
</template>

<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      color?: 'green' | 'orange' | 'pink'
      title?: string
      titleTag?: 'h1' | 'h2' | 'h3'
      titleId?: string
      titleAttrs?: Record<string, string>
      tag?: 'section' | 'div'
      separator?: boolean
    }>(),
    {
      color: 'green',
      titleTag: 'h2',
      tag: 'div',
      separator: false,
    }
  )

  const colorMap: Record<string, string> = {
    green: 'bg-primary_green',
    orange: 'bg-primary_orange',
    pink: 'bg-primary_pink',
  }

  const colorClass = computed(() => colorMap[props.color])
</script>

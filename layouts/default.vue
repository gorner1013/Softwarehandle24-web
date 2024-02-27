<script setup>
const { locale } = useI18n()
</script>

<template>
  <Html :lang="locale">
    <Body class="lining-nums proportional-nums font-sans leading-normal">
      <LayoutHeader />
      <slot />
      <LayoutFooter />
    </Body>
  </Html>
</template>

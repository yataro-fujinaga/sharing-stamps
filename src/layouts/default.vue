<template lang="pug">
v-app
  v-app-bar(app, color='teal darken-1') 
    v-container
      v-row
        v-col(cols='12')
          span.font-weight-bold.white--text スタンプ共有サービス
  v-main.mt-3
    Nuxt
  v-footer.justify-center(app) Copyright(c) 2022. Yataro Fujinaga
</template>

<script>
export default {
  name: 'DefaultPage',
}
</script>

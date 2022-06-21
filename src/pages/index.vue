<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='4')
      v-form
        .mb-2
          span.font-weight-bold.text-h5 スタンプ登録
        v-text-field(
          name='stamp_id',
          outlined,
          dense,
          autofocus,
          counter='10',
          label='スタンプID',
          hint='4文字以上10文字以下の半角英数字(小文字)と_'
        )
        v-text-field(
          name='image_url',
          outlined,
          dense,
          label='画像URL',
          hint='スタンプにしたい画像のURL'
        )
        v-textarea(
          name='description',
          outlined,
          dense,
          label='説明',
          hint='スタンプの説明'
        )
        v-btn.font-weight-bold.white--text(color='teal lighten-1', depressed) 登録
    v-col(cols='12', xs='12', sm='12', md='8')
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      stamp_ids: [],
      rules: {
        required: (value) => !!value || '入力必須です',
        stamp_id: {
          counter: (value) => {
            return (
              (value.length >= 4 && value.length <= 10) ||
              'スタンプIDは4文字以上、10文字以下です'
            )
          },
          checker: (value) => {
            const pattern = /^[a-z0-9_]+$/
            return (
              pattern.test(value) || '小文字の半角英数字と_を入力してください'
            )
          },
        },
        image_url: {
          checker: (value) => {
            const pattern = /^(https?:\/\/).+$A/
            return (
              pattern.test(value) ||
              'http://もしくはhttps://から始まるURLを入力してください'
            )
          },
        },
        description: {
          counter: (value) => {
            return (
              (value.length >= 5 && value.length <= 100) ||
              '説明は5文字以上、100文字以下です'
            )
          },
        },
      },
    }
  },
  head() {
    return {
      title: 'トップ',
    }
  },
}
</script>

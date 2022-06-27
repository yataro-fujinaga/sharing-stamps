<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='4')
      v-form(ref='form', v-model='stampForm.valid')
        .mb-2
          span.font-weight-bold.text-h5 スタンプ登録
        .mb-2(v-if='isSuccess')
          span.green--text {{ response.title }}
        .mb-2(v-else-if='isError')
          span.red--text {{ response.title }}
        v-text-field(
          name='id',
          v-model='stampForm.id',
          outlined,
          dense,
          autofocus,
          counter='20',
          label='スタンプID',
          hint='4文字以上20文字以下の半角英数字(小文字)と_',
          :rules='[rules.required, rules.id.counter, rules.id.checker, rules.id.unique]'
        )
        v-text-field(
          name='image_url',
          v-model='stampForm.image_url',
          outlined,
          dense,
          label='画像URL',
          hint='スタンプにしたい画像のURL',
          :rules='[rules.required, rules.image_url.checker]'
        )
        v-textarea(
          name='description',
          v-model='stampForm.description',
          outlined,
          dense,
          label='説明',
          hint='スタンプの説明',
          counter='100',
          :rules='[rules.required, rules.description.counter]'
        )
        v-btn.font-weight-bold.white--text(
          color='teal lighten-1',
          depressed,
          :disabled='!stampForm.valid',
          @click='registerStamp'
        ) 登録
    v-col.d-md-flex(cols='12', xs='12', sm='12', md='8')
      v-container
        v-row
          v-col(cols='12', md='4', v-for='stamp in stamps', :key='stamp.id')
            v-card(outlined, :to='"/stamps/" + stamp.id')
              v-card-title {{ stamp.id }}
              v-card-subtitle {{ stamp.description }}
              v-card-text
                v-responsive(aspect-ratio='1')
                  v-img(:src='stamp.image_url', aspect-ratio='1')
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      stampForm: {
        valid: true,
        id: null,
        image_url: null,
        description: null,
      },
      response: {
        type: null,
        title: '',
        messages: {
          id: [],
          image_url: [],
          description: [],
        },
      },
      stamps: [],
      rules: {
        required: (value) => !!value || '入力必須です',
        id: {
          counter: (value) => {
            return (
              (!!value && value.length >= 4 && value.length <= 20) ||
              'スタンプIDは4文字以上、10文字以下です'
            )
          },
          checker: (value) => {
            const pattern = /^[a-z0-9_]+$/
            return (
              pattern.test(value) || '小文字の半角英数字と_を入力してください'
            )
          },
          unique: (value) => {
            return (
              this.isUniqueId(value) ||
              'IDが重複しています。別のIDを入力してください。'
            )
          },
        },
        image_url: {
          checker: (value) => {
            const pattern = /^(https?|ftp)(:\/\/[\w/:%#$&?()~.=+-]+)$/
            return (
              pattern.test(value) ||
              'http://もしくはhttps://から始まるURLを入力してください'
            )
          },
        },
        description: {
          counter: (value) => {
            return (
              (!!value && value.length >= 5 && value.length <= 100) ||
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
  mounted() {
    this.getStamps()
  },
  methods: {
    getStamps() {
      const database = this.$fire.firestore

      database
        .collection('stamps')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            this.stamps.push(doc.data())
          })
        })
    },
    addStamp() {
      const database = this.$fire.firestore

      const stampObj = {
        id: this.stampForm.id,
        image_url: this.stampForm.image_url,
        description: this.stampForm.description,
      }

      database
        .collection('stamps')
        .add(stampObj)
        .then((docRef) => {
          this.stamps.push(stampObj)
        })
        .catch((error) => {
          this.Error(error)
        })
    },
    registerStamp() {
      if (!this.$refs.form.validate()) return

      this.addStamp(this.stampForm)

      this.$refs.form.reset()

      this.Successful(this.stampForm.id)
    },
    isUniqueId(id) {
      for (const stamp of this.stamps) {
        if (stamp.id === id) return false
      }
      return true
    },
    Successful(id) {
      this.response.type = 'Success'
      this.response.title = `スタンプ:${id}を登録しました。`
    },
    Error(title, messages = null) {
      this.response.type = 'Error'
      this.response.title = title
      this.response.messages = messages
    },
    isSuccess() {
      return this.response.type === 'Success'
    },
    isError() {
      return this.response.type === 'Error'
    },
  },
}
</script>

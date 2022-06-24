<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='4')
      v-form(ref='form', v-model='stamp_form.valid')
        .mb-2
          span.font-weight-bold.text-h5 スタンプ登録
        .mb-2(v-if='response.isSuccess')
          span.green--text {{ response.message }}
        v-text-field(
          name='id',
          v-model='stamp_form.id',
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
          v-model='stamp_form.image_url',
          outlined,
          dense,
          label='画像URL',
          hint='スタンプにしたい画像のURL',
          :rules='[rules.required, rules.image_url.checker]'
        )
        v-textarea(
          name='description',
          v-model='stamp_form.description',
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
          :disabled='!stamp_form.valid',
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
      stamp_form: {
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
    getStamps: async () => {
      const database = this.$fire.firestore
      const querySnapshot = await database.getDocs(
        database.collection(database, 'stamps')
      )

      querySnapshot.forEach((doc) => {
        this.stamps.push(doc)
      })

      console.log(this.stamps)
    },
    addStamp: async (formObj) => {
      const database = this.$fire.firestore
      try {
        await database.addDoc(
          database.collection(database, 'stamps', {
            id: formObj.id,
            image_url: formObj.image_url,
            description: formObj.description,
          })
        )
      } catch (error) {
        console.log(error)
      }
    },
    registerStamp() {
      if (!this.$refs.form.validate()) return

      this.addStamp(this.stamp_form)

      this.$refs.form.reset()

      this.isSuccess()
    },
    isUniqueId(id) {
      for (const stamp of this.stamps) {
        if (stamp.id === id) return false
      }
      return true
    },
    isSuccess() {
      this.response.type = 'Success'
      this.response.title = 'スタンプを登録しました。'
    },
  },
}
</script>

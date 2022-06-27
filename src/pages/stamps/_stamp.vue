<template lang="pug">
v-container
  v-row
    v-col(cols='12')
      v-card(outlined)
        v-card-title {{ stamp.id }}
        v-card-subtitle {{ stamp.description }}
        v-card-text
          v-responsive(aspect-ratio='1')
            v-img(:src='stamp.image_url', aspect-ratio='1')
</template>

<script>
export default {
  name: 'ShowPage',
  data() {
    return {
      response: {
        type: null,
        title: null,
      },
      stamp: {
        id: null,
        image_url: null,
        description: null,
      },
    }
  },
  head() {
    return {
      title: this.$route.params.stamp,
    }
  },
  created() {
    const stampId = this.$route.params.stamp
    this.getStamp(stampId)
  },
  methods: {
    getStamp(stampId) {
      const database = this.$fire.firestore

      database
        .collection('stamps')
        .where('id', '==', stampId)
        .limit(1)
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0]
            this.stamp = doc.data()
          } else {
            this.Error('エラーが発生しました。')
          }
        })
        .catch(() => {
          this.Error('エラーが発生しました。')
        })
    },
    Error(title) {
      this.response.type = 'Error'
      this.response.title = title
    },
  },
}
</script>

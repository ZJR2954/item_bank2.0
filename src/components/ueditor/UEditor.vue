<template>
  <div>
    <vue-editor v-model="text" :config="myConfig"/>
  </div>
</template>

<script>
  import VueEditor from 'vue-ueditor-wrap'

  export default {
    name: "u-editor",
    props: {
      value: String,
      readonly: {
        type: Boolean,
        default: false
      }
    },
    components: {
      VueEditor
    },
    data() {
      return {
        text: this.value,
        myConfig: {
          // serverUrl: 'http://127.0.0.1:8081/config',
          UEDITOR_HOME_URL: '/UEditor/',
          autoHeightEnabled: false,
          initialFrameWidth: '100%',
          initialFrameHeight: 300,
          readonly: this.readonly,
          toolbars: [[
            'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|',
            'forecolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertcode', 'pagebreak', 'template', '|',
            'horizontal', 'spechars', '|',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            'preview', 'searchreplace', 'kityformula'
          ]]
        }
      }
    },
    watch: {
      value(newValue) {
        this.text = newValue;
      },
      text(newValue) {
        this.$emit('input', newValue);
      }

    },
    methods: {}
  }
</script>

<style scoped>

</style>
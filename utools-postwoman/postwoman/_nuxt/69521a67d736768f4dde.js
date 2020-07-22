(window.webpackJsonp=window.webpackJsonp||[]).push([[71],{942:function(t,e,o){"use strict";o.r(e);o(48),o(15),o(7),o(10);var n=o(238),r={data:function(){return{fb:n.a}},props:{show:Boolean},components:{modal:function(){return o.e(0).then(o.bind(null,948))}},computed:{environmentJson:function(){return JSON.stringify(this.$store.state.postwoman.environments,null,2)}},methods:{hideModal:function(){this.$emit("hide-modal")},openDialogChooseFileToReplaceWith:function(){this.$refs.inputChooseFileToReplaceWith.click()},openDialogChooseFileToImportFrom:function(){this.$refs.inputChooseFileToImportFrom.click()},replaceWithJSON:function(){var t=this,e=new FileReader;e.onload=function(e){var content=e.target.result,o=JSON.parse(content);t.$store.commit("postwoman/replaceEnvironments",o)},e.readAsText(this.$refs.inputChooseFileToReplaceWith.files[0]),this.fileImported(),this.syncToFBEnvironments()},importFromJSON:function(){var t=this,e=new FileReader;e.onload=function(e){var content=e.target.result,o=JSON.parse(content);"environment"===o._postman_variable_scope||"globals"===o._postman_variable_scope?t.importFromPostman(o):t.importFromPostwoman(o)},e.readAsText(this.$refs.inputChooseFileToImportFrom.files[0]),this.syncToFBEnvironments()},importFromPostwoman:function(t){var e=this.$t("file_imported");this.$store.commit("postwoman/importAddEnvironments",{environments:t,confirmation:e})},importFromPostman:function(t){var e={name:t.name,variables:[]};t.values.forEach((function(element){return e.variables.push({key:element.key,value:element.value})}));var o=[e];this.importFromPostwoman(o)},exportJSON:function(){var text=this.environmentJson;text=text.replace(/\n/g,"\r\n");var t=new Blob([text],{type:"text/json"}),e=document.createElement("a");e.download="postwoman-environment.json",e.href=window.URL.createObjectURL(t),e.target="_blank",e.style.display="none",document.body.appendChild(e),e.click(),document.body.removeChild(e),this.$toast.success(this.$t("download_started"),{icon:"done"})},syncEnvironments:function(){this.$store.commit("postwoman/replaceEnvironments",n.a.currentEnvironments),this.fileImported()},syncToFBEnvironments:function(){null!==n.a.currentUser&&n.a.currentSettings[1].value&&n.a.writeEnvironments(JSON.parse(JSON.stringify(this.$store.state.postwoman.environments)))},fileImported:function(){this.$toast.info(this.$t("file_imported"),{icon:"folder_shared"})}}},l=o(42),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return t.show?o("modal",{on:{close:t.hideModal}},[o("div",{attrs:{slot:"header"},slot:"header"},[o("ul",[o("li",[o("div",{staticClass:"flex-wrap"},[o("h3",{staticClass:"title"},[t._v(t._s(t.$t("import_export"))+" "+t._s(t.$t("environments")))]),t._v(" "),o("div",[o("button",{staticClass:"icon",on:{click:t.hideModal}},[o("i",{staticClass:"material-icons"},[t._v("close")])])])]),t._v(" "),o("div",{staticClass:"flex-wrap"},[o("span",{directives:[{name:"tooltip",rawName:"v-tooltip",value:{content:t.fb.currentUser?t.$t("replace_current"):t.$t("login_first")},expression:"{\n              content: !fb.currentUser ? $t('login_first') : $t('replace_current'),\n            }"}]},[o("button",{staticClass:"icon",attrs:{disabled:!t.fb.currentUser},on:{click:t.syncEnvironments}},[o("i",{staticClass:"material-icons"},[t._v("folder_shared")]),t._v(" "),o("span",[t._v(t._s(t.$t("import_from_sync")))])])]),t._v(" "),o("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.$t("replace_current"),expression:"$t('replace_current')"}],staticClass:"icon",on:{click:t.openDialogChooseFileToReplaceWith}},[o("i",{staticClass:"material-icons"},[t._v("create_new_folder")]),t._v(" "),o("span",[t._v(t._s(t.$t("replace_json")))]),t._v(" "),o("input",{ref:"inputChooseFileToReplaceWith",staticStyle:{display:"none"},attrs:{type:"file",accept:"application/json"},on:{change:t.replaceWithJSON}})]),t._v(" "),o("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.$t("preserve_current"),expression:"$t('preserve_current')"}],staticClass:"icon",on:{click:t.openDialogChooseFileToImportFrom}},[o("i",{staticClass:"material-icons"},[t._v("folder_special")]),t._v(" "),o("span",[t._v(t._s(t.$t("import_json")))]),t._v(" "),o("input",{ref:"inputChooseFileToImportFrom",staticStyle:{display:"none"},attrs:{type:"file",accept:"application/json"},on:{change:t.importFromJSON}})])])])])]),t._v(" "),o("div",{attrs:{slot:"body"},slot:"body"},[o("textarea",{directives:[{name:"model",rawName:"v-model",value:t.environmentJson,expression:"environmentJson"}],attrs:{rows:"8"},domProps:{value:t.environmentJson},on:{input:function(e){e.target.composing||(t.environmentJson=e.target.value)}}})]),t._v(" "),o("div",{attrs:{slot:"footer"},slot:"footer"},[o("div",{staticClass:"flex-wrap"},[o("span"),t._v(" "),o("span",[o("button",{staticClass:"icon",on:{click:t.hideModal}},[t._v("\n          "+t._s(t.$t("cancel"))+"\n        ")]),t._v(" "),o("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.$t("download_file"),expression:"$t('download_file')"}],staticClass:"icon primary",on:{click:t.exportJSON}},[t._v("\n          "+t._s(t.$t("export"))+"\n        ")])])])])]):t._e()}),[],!1,null,null,null);e.default=component.exports}}]);
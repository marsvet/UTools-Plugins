(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{253:function(e,t,l){var content=l(289);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,l(47).default)("771a739a",content,!0,{sourceMap:!1})},288:function(e,t,l){"use strict";var o=l(253);l.n(o).a},289:function(e,t,l){(t=l(46)(!1)).push([e.i,"fieldset[data-v-2da7920e]{margin:16px 0;border-radius:8px;background-color:var(--bg-dark-color)}fieldset[data-v-2da7920e],fieldset legend[data-v-2da7920e]{transition:all .2s ease-in-out}fieldset legend[data-v-2da7920e]{display:inline-block;align-items:center;justify-content:center;color:var(--fg-color);font-weight:700;cursor:pointer}fieldset legend *[data-v-2da7920e]{vertical-align:middle}fieldset legend i[data-v-2da7920e]{margin-left:8px}fieldset.blue legend[data-v-2da7920e]{color:#57b5f9}fieldset.gray legend[data-v-2da7920e]{color:#bcc2cd}fieldset.green legend[data-v-2da7920e]{color:#50fa7b}fieldset.cyan legend[data-v-2da7920e]{color:#8be9fd}fieldset.purple legend[data-v-2da7920e]{color:#bd93f9}fieldset.orange legend[data-v-2da7920e]{color:#ffb86c}fieldset.pink legend[data-v-2da7920e]{color:#ff79c6}fieldset.red legend[data-v-2da7920e]{color:#f55}fieldset.yellow legend[data-v-2da7920e]{color:#f1fa8c}fieldset.no-colored-frames legend[data-v-2da7920e]{color:var(--fg-color)}",""]),e.exports=t},366:function(e,t,l){"use strict";l.r(t);l(24),l(37),l(48);var o={computed:{frameColorsEnabled:function(){return this.$store.state.postwoman.settings.FRAME_COLORS_ENABLED||!1},sectionString:function(){return"".concat(this.$route.path.replace(/\/+$/,""),"/").concat(this.label)}},props:{label:{type:String,default:"Section"},collapsed:{type:Boolean}},methods:{collapse:function(e){e.target.parentNode.parentNode.querySelector(".collapsible").classList.toggle("hidden"),this.$store.commit("setCollapsedSection",this.sectionString)},isCollapsed:function(label){return this.$store.state.theme.collapsedSections.includes(this.sectionString)||!1}}},d=(l(288),l(42)),component=Object(d.a)(o,(function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("fieldset",{class:{"no-colored-frames":!e.frameColorsEnabled},attrs:{id:e.label.toLowerCase()}},[l("legend",{on:{click:function(t){return t.preventDefault(),e.collapse(t)}}},[l("span",[e._v(e._s(e.label))]),e._v(" "),l("i",{staticClass:"material-icons"},[e._v("\n      "+e._s(e.isCollapsed(e.label)?"expand_more":"expand_less")+"\n    ")])]),e._v(" "),l("div",{staticClass:"collapsible",class:{hidden:e.isCollapsed(e.label.toLowerCase())}},[e._t("default")],2)])}),[],!1,null,"2da7920e",null);t.default=component.exports}}]);
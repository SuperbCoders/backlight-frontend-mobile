const server="https://blacklight.ru",groupBy=(e,a)=>e.reduce((e,t)=>({...e,[t[a]]:[...e[t[a]]||[],t]}),{});new Vue({el:"#cases",data(){return{activeYear:null,items:[]}},computed:{computedYears(){const e=this.items.map(e=>(e.pdf.replace("http","https"),e.year=e.date_at.substr(0,4),e));let a=[];return e.forEach(t=>{let e=a.find(e=>e.value===t.year);e?e.items.push(t):a.push({value:t.year,items:[]})}),a.sort((e,t)=>parseInt(t.value)-parseInt(e.value))}},methods:{toggleActiveYear(e){this.activeYear===e&&(this.activeYear=null),this.activeYear=e},loadItems(e){axios.get(server+`/api/cases/${e}/?format=json`).then(e=>{this.cases=e.data})}},mounted(){axios.get(server+"/api/cases/?format=json").then(e=>{this.items=e.data})}}),new Vue({el:"#awards",data(){return{info:{}}},mounted(){axios.get(server+"/api/rewards/?format=json").then(e=>this.info=e.data)},methods:{openMore:function(e){$(".awards-full-item .window").eq(e).addClass("active")}}}),new Vue({el:"#awards-full",data(){return{info:{}}},mounted(){axios.get(server+"/api/rewards/?format=json").then(e=>this.info=e.data)},methods:{closeMore:function(){$(".window-awards-open").removeClass("active")}}}),new Vue({el:"#note",data(){return{info:{}}},mounted(){axios.get(server+"/api/text/main_about/?format=json").then(e=>this.info=e.data)}}),new Vue({el:"#presentation",data(){return{info:{}}},mounted(){axios.get(server+"/api/file/presentation/?format=json").then(e=>{this.info=e.data,this.info.file_mobile+="#toolbar=0"})}}),new Vue({el:"#team",data(){return{info:{}}},mounted(){axios.get(server+"/api/employees/?format=json").then(e=>this.info=e.data.filter(e=>1==e.status))},methods:{openMore:function(e){$(".team-full-item .window").eq(e).addClass("active")}},filters:{nameOnly(e){return e.split(" ")[0]}}}),new Vue({el:"#team-full",data(){return{info:{}}},mounted(){axios.get(server+"/api/employees/?format=json").then(e=>this.info=e.data)},methods:{closeMore:function(){$(".window-team-open").removeClass("active")}}}),new Vue({el:"#phone",data(){return{info:{}}},mounted(){axios.get(server+"/api/contacts/?format=json").then(e=>this.info=e.data)}}),new Vue({el:"#modal-contacts",data(){return{contacts:{},socials:[]}},mounted(){axios.get(server+"/api/contacts/?format=json").then(e=>{this.contacts=e.data}),axios.get(server+"/api/urls/?format=json").then(e=>this.socials=e.data)}}),new Vue({el:"#footer",data(){return{socials:[]}},mounted(){axios.get(server+"/api/urls/?format=json").then(e=>this.socials=e.data)}});
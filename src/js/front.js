const server = 'https://blacklight.ru';
const groupBy = (items, key) => items.reduce(
  (result, item) => ({
    ...result,
    [item[key]]: [
      ...(result[item[key]] || []),
      item,
    ],
  }),
  {},
);
new Vue({
  el: '#cases',
  data () {
    return {
      activeYear: null,
      items: []
    };
  },
  computed: {
    computedYears () {
      const items = this.items.map((elem) => {
        elem.pdf.replace('http', 'https')
        elem.year = elem.date_at.substr(0, 4)
        return elem;
      });

      let years = [];
      items.forEach(item => {
        let year = years.find(year => year.value === item.year)
        if(year) {
          year.items.push(item);
        } else {
          years.push({
            value: item.year,
            items: []
          })
        }
      });


      return years.sort((a, b) => parseInt(b.value) - parseInt(a.value));
    }
  },
  methods: {
    toggleActiveYear(year) {
      if(this.activeYear === year) this.activeYear = null

      this.activeYear = year;
    },
    loadItems (year) {
      axios.get(`${server}/api/cases/${year}/?format=json`).then((response) => {
        this.cases = response.data;
      });
    },
  },
  mounted () {
    axios
      .get(`${ server }/api/cases/?format=json`)
      .then(response => {
        this.items = response.data
      })
  },
});

new Vue({
  el: '#awards',
  data () {
    return {
      info: []
    };
  },
  mounted () {

    axios
      .get(`${ server }/api/rewards/?format=json`)
      .then(response => {
        this.info = response.data.sort((a,b) => {
          return b.year - a.year;
        })
      })

  },
  methods: {
    openMore: function (index) {
      console.log(index);
      $('.awards-full-item .window').eq(index).addClass('active');
    },
  }
});

new Vue({
  el: '#awards-full',
  data () {
    return {
      info: {}
    };
  },
  mounted () {
    axios
      .get(`${ server }/api/rewards/?format=json`)
      .then(response => {
        this.info = response.data.sort((a,b) => {
          return b.year - a.year;
        })
      })
  },
  methods: {
    closeMore: function () {
      $('.window-awards-open').removeClass('active');
    },
  }
});

new Vue({
  el: '#note',
  data () {
    return {
      info: {}
    };
  },
  mounted () {
    axios
      .get(`${ server }/api/text/main_about/?format=json`)
      .then(response => (this.info = response.data))
  }
});

new Vue({
  el: "#vacancies",
  data() {
    return {
      vacancies: [],
      vacancy: {}
    };
  },
  methods: {
  },
  created() {
    axios.get(`${server}/api/jobs/?format=json`).then((response) => {
      this.vacancies = response.data;
      this.isLoading = false;
    });
  },
});


new Vue({
  el: '#presentation',
  data () {
    return {
      info: {}
    };
  },
  mounted () {
    axios
      .get(`${ server }/api/file/presentation/?format=json`)
      .then(response => {
        this.info = response.data
        this.info.file_mobile += '#toolbar=0'
      })
  },
});

new Vue({
  el: '#team',
  data () {
    return {
      info: {}
    };
  },
  mounted () {
    axios
      .get(`${ server }/api/employees/?format=json`)
      .then(response => (this.info = response.data.filter(item => item.status == true)))
  },
  methods: {
    openMore: function (index) {
      $('.team-full-item .window').eq(index).addClass('active');
    },
  },
  filters: {
    nameOnly (value) {
      return value.split(' ')[0];
    }

  }
});

new Vue({
  el: '#team-full',
  data () {
    return {
      info: {}
    };
  },
  mounted () {
    axios
      // .get('test.json')
      .get(`${ server }/api/employees/?format=json`)
      .then(response => (this.info = response.data))
  },
  methods: {
    closeMore: function () {
      $('.window-team-open').removeClass('active');
    },
  }
});

new Vue({
  el: '#phone',
  data () {
    return {
      info: {}
    };
  },
  mounted () {
    axios
      .get(`${ server }/api/contacts/?format=json`)
      .then(response => (this.info = response.data))
  },
});

new Vue({
  el: '#modal-contacts',
  data () {
    return {
      contacts: {},
      socials: []
    };
  },
  mounted () {
    axios
      .get(`${ server }/api/contacts/?format=json`)
      .then(response => {
        this.contacts = response.data
      })
    axios
      .get(`${ server }/api/urls/?format=json`)
      .then((response) => (this.socials = response.data));
  },
});

new Vue({
  el: '#footer',
  data () {
    return {
      socials: []
    };
  },
  mounted () {
    axios
      .get(`${ server }/api/urls/?format=json`)
      .then((response) => (this.socials = response.data));
  },
});
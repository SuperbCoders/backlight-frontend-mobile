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
      info: [
        {
          "id": 8,
          "year": 2019,
          "type": "Пиар",
          "work_title": "в номинации \"Лучшая вирусная кампания\"",
          "festival": "TAGLINE",
          "image": null,
          "category": "Бронза"
        },
        {
          "id": 5,
          "year": 2018,
          "type": "SMM",
          "work_title": "в номинации Social Media",
          "festival": "TAGLINE",
          "image": null,
          "category": null
        },
        {
          "id": 2,
          "year": 2018,
          "type": "SMM",
          "work_title": "в номинации «Лучшее Social Media финансовой компании»",
          "festival": "TAGLINE",
          "image": null,
          "category": null
        },
        {
          "id": 3,
          "year": 2018,
          "type": "брендинг",
          "work_title": "в номинации «Лучший интерактивный брендинг»",
          "festival": "TAGLINE",
          "image": null,
          "category": null
        },
        {
          "id": 4,
          "year": 2018,
          "type": "SMM",
          "work_title": "в номинации «Лучшая страница/ группа»",
          "festival": "TAGLINE",
          "image": null,
          "category": null
        },
        {
          "id": 20,
          "year": 2021,
          "type": "Инфлюенс-маркетинг",
          "work_title": "в номинации \"Бизнес-вызовы/Local marketing\"",
          "festival": "EFFIE",
          "image": null,
          "category": "Серебро"
        },
        {
          "id": 19,
          "year": 2021,
          "type": "Креатив",
          "work_title": "в номинации \"Медиа/Медиаинновация и медиаидея\"",
          "festival": "EFFIE",
          "image": null,
          "category": "Серебро"
        },
        {
          "id": 18,
          "year": 2021,
          "type": "Стратегия",
          "work_title": "в номинации \"Электронная коммерция\"",
          "festival": "Silver Mercury",
          "image": null,
          "category": "Серебро"
        },
        {
          "id": 17,
          "year": 2021,
          "type": "брендинг",
          "work_title": "в номинации \"Лучшая кампания построения лояльности бренду\"",
          "festival": "Silver Mercury",
          "image": null,
          "category": "Серебро"
        },
        {
          "id": 16,
          "year": 2020,
          "type": "брендинг",
          "work_title": "в номинации \"Лучший некоммерческий проект\"",
          "festival": "Tagline Summer Awards 2020",
          "image": null,
          "category": "Золото"
        },
        {
          "id": 15,
          "year": 2021,
          "type": "Пиар",
          "work_title": "в номинации \"Лучшая кампания для медиа/СМИ\"",
          "festival": "TAGLINE",
          "image": null,
          "category": "Золото"
        },
        {
          "id": 14,
          "year": 2021,
          "type": "Стратегия",
          "work_title": "в номинации \"Лучшее использование digital/mobile инструментов\"",
          "festival": "Silver Mercury",
          "image": null,
          "category": "Золото"
        },
        {
          "id": 13,
          "year": 2020,
          "type": "брендинг",
          "work_title": "в номинации \"Лучший некоммерческий проект\"",
          "festival": "Tagline Summer Awards 2020",
          "image": null,
          "category": "Бронза"
        },
        {
          "id": 12,
          "year": 2020,
          "type": "Инфлюенс-маркетинг",
          "work_title": "в номинации \"Лучшее использование лидеров мнений\"",
          "festival": "Silver Mercury",
          "image": null,
          "category": "Бронза"
        },
        {
          "id": 11,
          "year": 2020,
          "type": "Видео",
          "work_title": "в номинации \"Комедийный ролик\"",
          "festival": "Big Picture festival",
          "image": null,
          "category": "Бронза"
        },
        {
          "id": 10,
          "year": 2019,
          "type": "SMM",
          "work_title": "в номинации \"Social Media\"",
          "festival": "MIXX Russia Awards",
          "image": null,
          "category": "Серебро"
        },
        {
          "id": 9,
          "year": 2019,
          "type": "Пиар",
          "work_title": "в номинации \"Лучшая вирусная кампания\"",
          "festival": "TAGLINE",
          "image": null,
          "category": "Серебро"
        },
        {
          "id": 7,
          "year": 2019,
          "type": "Видео",
          "work_title": "в номинации \"Лучший видеопроект\"",
          "festival": "TAGLINE",
          "image": null,
          "category": "Бронза"
        },
        {
          "id": 6,
          "year": 2019,
          "type": "Пиар",
          "work_title": "в номинации \"Лучшая кампания для финансовой/страховой организации\"",
          "festival": "TAGLINE",
          "image": null,
          "category": "Бронза"
        }
      ]
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
      .then(response => (this.info = response.data))
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
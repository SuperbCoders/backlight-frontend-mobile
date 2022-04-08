const server = `${window.location.protocol}//${window.location.host}`
new Vue({
    el: '#cases',
    data() {
        return {
            info: {}
        };
    },
    mounted() {
        axios
            .get(`${server}/api/cases/?format=json`)
            .then(response => (this.info = response.data))
    },
});


new Vue({
    el: '#awards',
    data() {
        return {
            info: {}
        };
    },
    mounted() {
        axios
            .get(`${server}/api/rewards/?format=json`)
            .then(response => (this.info = response.data))
    },
    methods: {
        openMore: function (index) {
            $('.awards-full-item .window').eq(index).addClass('active');
        },
    }
});

new Vue({
    el: '#awards-full',
    data() {
        return {
            info: {}
        };
    },
    mounted() {
        axios
            .get(`${server}/api/rewards/?format=json`)
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
    data() {
        return {
            info: {}
        };
    },
    mounted() {
        axios
            .get(`${server}/api/text/main_about/?format=json`)
            .then(response => (this.info = response.data))
    }
});


new Vue({
    el: '#presentation',
    data() {
        return {
            info: {}
        };
    },
    mounted() {
        axios
            .get(`${server}/api/file/presentation/?format=json`)
            .then(response => {
                this.info = response.data
                this.info.file_mobile += '#toolbar=0'
            })
    },
});

new Vue({
    el: '#team',
    data() {
        return {
            info: {}
        };
    },
    mounted() {
        axios
            .get(`${server}/api/employees/?format=json`)
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
    data() {
        return {
            info: {}
        };
    },
    mounted() {
        axios
            // .get('test.json')
            .get(`${server}/api/employees/?format=json`)
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
    data() {
        return {
            info: {}
        };
    },
    mounted() {
        axios
            .get(`${server}/api/contacts/?format=json`)
            .then(response => (this.info = response.data))
    },
});

new Vue({
    el: '#modal-contacts',
    data() {
        return {
            contacts: {},
            socials: []
        };
    },
    mounted() {
        axios
            .get(`${server}/api/contacts/?format=json`)
            .then(response => {this.contacts = response.data})
        axios
            .get(`${server}/api/urls/?format=json`)
            .then((response) => (this.socials = response.data));
    },
});

new Vue({
    el: '#footer',
    data() {
        return {
            socials: []
        };
    },
    mounted() {
        axios
            .get(`${server}/api/urls/?format=json`)
            .then((response) => (this.socials = response.data));
    },
});

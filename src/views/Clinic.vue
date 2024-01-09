<template>
    <div class="container">
        <h1>{{clinicName}}</h1>


        <div class="dentists">
            <div v-for="dentist in dentists" :key="dentist.id">
                <div class="oneDentist">
                    <img src="../assets/dentists.png" class="dentist-image" />
                    <b>{{ dentist.username }}</b>

                    <div v-for="timeslot in allTimeslots" :key="timeslot.id">
                        <div class="appointment" v-show="timeslot.dentist_id === dentist.id">
                            <b>{{ timeslot.start_time }} {{ timeslot.end_time }}</b><br>{{ dentist.username }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
        
</template>
<script>
import { Api } from '@/Api';

export default {
    name: 'Clinic-page',
    data() {
        return {
            clinicId: '',
            clinicName: '',
            dentists: [],
            allTimeslots: [],
            timeslotsToDisplay: [],
            timeslots: []
        }
    },
      mounted() {
        this.getClinicDetails()
        this.getDentists()
        this.getAllTimeslots()
    },
    methods: {
        getClinicDetails() {
            let url = window.location.pathname.split('/')[2];
            this.clinicId = url;
            Api.get('/v1/clinics/' + this.clinicId)
                .then(res => {
                    console.log(res.data.message)
                    this.clinicName = res.data.message[0].name
                })
                .catch(error => {
                    console.error(error.response.data)
                })
        },

        getDentists() {
            Api.get(`v1/clinics/${this.clinicId}/dentists`)
            .then(res => {
                this.dentists = res.data.message
                console.log(this.dentists)
            })
            .catch(error => {
                    console.error(error.response.data)
            })
        },

        getAllTimeslots() {
            Api.get('v1/timeslots')
            .then(res => {
                this.allTimeslots = res.data.timeslots
                console.log(this.allTimeslots)

            })
             .catch(error => {
                    console.error(error.response.data)
            })
        },
        getTimeslotsForDentist() {
        }
        }
    }
</script>

<style>
    @import url("../assets/styles/style.css");
</style>


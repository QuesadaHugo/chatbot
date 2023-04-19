export class Message {
    message;
    date;
    participant;

    constructor(participant, message, date = null) {
        this.participant = participant;
        this.message = message;
        if (date == null) date = new Date();
        this.date = date;
    }

    getFormattedDateWithTime() {
        let mm = this.date.getMonth() + 1; // Months start at 0!
        let dd = this.date.getDate();
        let hh = this.date.getHours();
        let min = this.date.getMinutes();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        if (hh < 10) hh = '0' + hh;
        if (min < 10) min = '0' + min;

        return `${dd}/${mm}/${this.date.getFullYear()} à ${hh}:${min}`;
    }

    getFormattedDate() {
        let mm = this.date.getMonth() + 1; // Months start at 0!
        let dd = this.date.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return `${dd}/${mm}/${this.date.getFullYear()}`;
    }

    getFormattedTime() {
        let hh = this.date.getHours();
        let min = this.date.getMinutes();
        
        if (hh < 10) hh = '0' + hh;
        if (min < 10) min = '0' + min;

        return `${hh}:${min}`;
    }
}
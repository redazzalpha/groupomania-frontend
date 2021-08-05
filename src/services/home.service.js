const services = {
    checkPublication: (v) => {
        return !/^\s+$/gi.test(v);
    },
    dateTime(timeStr) {
        let datetime = timeStr.replace(".000Z", " ");
        let datetimeTab = datetime.split("T");
        let dateTab = datetimeTab[0].split("-");
        let year = dateTab[0];
        let month = dateTab[1];
        let day = dateTab[2];
        let time = datetimeTab[1];
        let timeTab = time.split(":");
        let hours = timeTab[0];
        let minutes = timeTab[1];
        //let seconds = timeTab[2];
        let hoursInt = parseInt(hours) + 2;
        return `${day}/${month}/${year} à ${hoursInt}:${minutes}`;
    },

};

module.exports = services;
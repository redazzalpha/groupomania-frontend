const services = {
    isNotEmpty: (text) => {
        return !/^\s+$/gi.test(text);
    },

};

module.exports = services;
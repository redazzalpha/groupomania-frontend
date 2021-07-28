const services = {
    checkPublication: (v) => {
        return !/^\s+$/gi.test(v);
    }
};

module.exports = services;
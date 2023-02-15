'use strict';

/**
 * @module test/mock/dw/dw.svc.js
 */

module.exports = {
    LocalServiceRegistry: {
        createService: function (id) {
            if (id === 'oplux_event_services_v3') {
                return {
                    getURL: function () {
                        return 'https://api.tst.o-plux.com/v3/event';
                    },
                    call: function () {
                        return {
                            ok: true,
                            status: 'OK',
                            object: { checkoutSessionId: '12345-12345' },
                            getStatus: function () {
                                return 'OK';
                            },
                            isOk: function () {
                                return true;
                            },
                            getObject: function () {
                                return {
                                    checkoutSessionId: '12345-12345'
                                };
                            },
                            getErrorMessage: function () {
                                return '';
                            }
                        };
                    }
                };
            } else if (id === 'oplux_event_services_v2') {
                return {
                    configuration: {
                        credential: {
                            URL: 'https://staging.o-plux.com/v2/event'
                        }
                    },
                    setURL: function () {
                        return 'https://staging.o-plux.com/v2/event';
                    },
                    getURL: function () {
                        return 'https://staging.o-plux.com/v2/event';
                    },
                    call: function () {
                        return {
                            ok: true,
                            status: 'OK',
                            object: { checkoutSessionId: '12345-12345' },
                            getStatus: function () {
                                return 'OK';
                            },
                            isOk: function () {
                                return true;
                            },
                            getObject: function () {
                                return {
                                    checkoutSessionId: '12345-12345'
                                };
                            },
                            getErrorMessage: function () {
                                return '';
                            }
                        };
                    }
                };
            } else if (id === 'oplux_name_services') {
                return {
                    setURL: function () {
                        return 'https://staging-name-normalizer.o-plux.com/';
                    },
                    getURL: function () {
                        return 'https://staging-name-normalizer.o-plux.com/';
                    },
                    call: function () {
                        return {
                            firstName: {
                                alphabet: null,
                                reading: null,
                                writing: '太郎'
                            },
                            lastName: {
                                alphabet: null,
                                existed: true,
                                reading: null,
                                writing: '山田'
                            },
                            letterCount: {
                                alphabetCountInName: 0,
                                hiraganaCountInName: 0,
                                kanjiCountInName: 4,
                                katakanaCountInName: 0,
                                nameLength: 4,
                                otherCountInName: 0
                            },
                            result: 'success',
                            time: 1,
                            getStatus: function () {
                                return 'OK';
                            },
                            isOk: function () {
                                return true;
                            },
                            getObject: function () {
                                return {
                                    checkoutSessionId: '12345-12345'
                                };
                            },
                            getErrorMessage: function () {
                                return '';
                            }
                        };
                    }
                }
            }
            return null;
        }
    }
};

import composeClass from 'compose-class';
import Symbol from 'es6-symbol';
import EventEmitter from 'eventemitter3';
import ObservableMixin from 'observable-mixin';
import { requires, assert, assertMethods } from '../../../common/utils/contracts';

const TYPE_NAME = '[scanner]';
const ENGINE_METHODS = ['startScanning', 'stopScanning'];
const ERR_START = `${TYPE_NAME} Already started`;
const ERR_STOP = `${TYPE_NAME} Already stopped`;

const FIELDS = {
    logger: Symbol('logger'),
    engine: Symbol('engine'),
    emitter: Symbol('emitter'),
    isRunning: Symbol('isRunning')
};

const METHODS = {
    onDiscover: Symbol('onDiscover')
};

const Scanner = composeClass({
    mixins: [
        ObservableMixin(FIELDS.emitter)
    ],

    constructor(logger, engine) {
        requires('logger', logger);
        requires('engine', engine);
        assertMethods('engine', ENGINE_METHODS, engine);

        this[FIELDS.logger] = logger;
        this[FIELDS.engine] = engine;
        this[FIELDS.emitter] = new EventEmitter();
        this[FIELDS.isRunning] = false;

        this[METHODS.onDiscover] = (peripheral) => {
            this[FIELDS.emitter].emit('discover', peripheral);
        };
    },

    isRunning() {
        return this[FIELDS.isRunning];
    },

    start() {
        assert(ERR_START, !this.isRunning());

        this[FIELDS.isRunning] = true;

        this[FIELDS.emitter].emit('start');

        this[FIELDS.engine].on('discover', this[METHODS.onDiscover]);
        this[FIELDS.engine].startScanning();

        return this;
    },

    stop() {
        assert(ERR_STOP, this.isRunning());

        this[FIELDS.isRunning] = false;

        this[FIELDS.emitter].emit('stop');

        this[FIELDS.engine].stopScanning();
        this[FIELDS.engine].removeListener('discover', this[METHODS.onDiscover]);

        return this;
    }
});

export default function create(...args) {
    return new Scanner(...args);
}
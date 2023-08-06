import { assign, createMachine } from 'xstate';

export const counterMachine = createMachine({
    id: 'counter',

    context: { // Here, we will define the initial state of the machine
        count: 0
    },
    on: {   // Here we will define the events that will trigger the transitions.
        incrementEvent: {
            actions: assign({
                count: (context) => context.count + 1
            })
        },
        decrementEvent: {
            actions: assign({
                count: (context) => context.count - 1
            })
        }
    }
});